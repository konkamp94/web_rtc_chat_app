const db = require('./config/db_config')
const  User  = require('./models/user')
const { generateAccessToken, generateRefreshToken } = require('./services/authentication/generateJwt')
const authenticateSocketConnection  = require('./services/authentication/auth_socket_connection')
//require our websocket library 
const WebSocketServer = require('ws').Server; 
const express = require('express');
const http = require("http");
const cors = require('cors');
const bcrypt = require ('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { ValidationError }  = require('sequelize');

// reads the env file and sets the environment variables
dotenv.config();

// connect to db
db.authenticate()
   .then(() => {
      console.log('Connection has been established successfully.');
   })
.catch (error => {
   console.error('Unable to connect to the database:', error);
})

const app = express()

app.use(cors())
// Configuring body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/register', (req, res) => {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
         if(err) {
            res.status(500).json({ error: err });
         }

         req.body.password = hash;

         User.findOne({ where: { username: req.body.username } })
         .then(user =>{ 
            console.log(user)
            if(user === null) {
               User.create(req.body)
               .then((newUser) => {
                  res.json({newUser})
               })
               .catch(error => {
                  if(error instanceof ValidationError){
                     console.warn(error)
                     res.status(400).json(error.message)
                  } else {
                     console.warn(error)
                     throw error
                  }
               }) 
            } else {
               console.log('exists')
               res.status(400).json({message: 'username already exists'})
            }
         });
      });
})

app.post('/api/login', (req,res) => {
   const user = User.findOne({ where: { username: req.body.username } })
         .then((user) => {
            return { matched: bcrypt.compare(req.body.password, user.password), user }
         })
         .then(result => {
               if(result.matched) {
                  let accessToken = generateAccessToken(result.user.username);
                  // authenticateSocketConnection(accessToken);
                  let refreshToken = generateRefreshToken(result.user.username);
                  res.status(200).json({ accessToken, refreshToken })
               } else {
                  res.status(401).json({ message: 'Wrong Username or Password'  })
               }
            })
         .catch(error => {
            console.log(error)
            res.status(500).json(error);
         })
         .catch(error => {
            res.status(401).json({message: 'Wrong Username or Password'})
         })
})

//TO DO: add a middleware for authentication
app.get('/api/user', (req,res) => {
   const usernameSearchString = req.query.username
   const users = User.findOne({
      where:{
         username: usernameSearchString
      }
   })
   .then((result) => {
      if(result) {
         let isOnline = activeConnections[result.username] ? true : false
         console.log(activeConnections[result.username])
         res.status(200).json({ username: result.username, description: 'desc', isOnline })
      } else {
         res.status(404).json({message: `user with username ${usernameSearchString} not found` })
      }
   })
   .catch((err) => {
      res.status(500).json(err)
   })
})

let server = http.createServer(app);

//creating a websocket route at port /signaling 
var wss = new WebSocketServer({server: server, path: "/api/signaling"});
let activeConnections = {}
//when a user connects to our server 
wss.on('connection', function(connection) { 
   console.log("user connected");
	
   //when server gets a message from a connected user 
   connection.on('message', function(messageJson){
      let message = JSON.parse(messageJson)
      console.log(message.data.type)
      if(message.data.type  === 'offer' && activeConnections[message.from]) {
         // console.log('receive offer')
         if(activeConnections[message.to]) {
            activeConnections[message.to].send(JSON.stringify(message))
         } else {
            console.log('user not connected')
         }
      } 
      else if(message.data.type === 'answer' && activeConnections[message.from]) {
         console.log('receive answer')
         if(activeConnections[message.to]) {
            activeConnections[message.to].send(JSON.stringify(message))
         } else {
            console.log('user not connected')
         }
      }
      else if(message.data.type === 'candidate' && activeConnections[message.from]) {
         if(activeConnections[message.to]) {
            activeConnections[message.to].send(JSON.stringify(message))
         }
      }
      else if(message.data.type === 'authentication') {
         let authentication = authenticateSocketConnection(message.data.accessToken, message.from)
         if(authentication.authenticated) {
            console.log('authenticated')
            activeConnections[message.from] = connection 
            console.log(activeConnections)
         } else if(authentication.error){
            connection.send(JSON.stringify({data: { type: 'authentication error', error: authentication.error } }))
            connection.close()
         } else {
            connection.send(JSON.stringify("usernames dont match!"))
            connection.close()
         }
         // console.log('user' + activeConnections)
      } else {
         // check if is logged in to send the second message and not close the connection
         connection.send(JSON.stringify("First Authenticate yourself to send signaling messages or send the right message type"))
         connection.close()
      }
      console.log("Got message from a user:", message);
   });

   connection.on('close', () => {
      console.log("connection closed")
      for(const username in activeConnections) {
         if(activeConnections[username] === connection) {
            console.log("find a key with username")
            delete activeConnections[username]
            break;
         } 
      }
   });
	
   // connection.send(JSON.stringify({offer: 'offer', user: 'oman'})); 
});

server.listen(9090)