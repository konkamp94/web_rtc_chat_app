const db = require('./config/db_config')
const  User  = require('./models/user')
//require our websocket library 
const WebSocketServer = require('ws').Server; 
const express = require('express');
const http = require("http");
const cors = require('cors');
const bcrypt = require ('bcrypt');
const dotenv = require('dotenv');

dotenv.config();
console.log(process.env.TOKEN_SECRET)

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

app.post('/register', (req, res) => {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
         req.body.password = hash;
         User.create(req.body)
         .then((newUser) => {
            res.json(newUser)
         })
         .catch(error => {
            res.status(400).json(error)
         })
      });
})

app.post('/login', (req,res) => {
   const user = User.findOne({ where: { username: req.body.username } })
         .then((user) => {
            bcrypt.compare(req.body.password, user.password).then(matched => {
               if(matched) res.status(200).json({ username: user.username, message: 'Successful Login' });
               res.status(400).json({message: 'Wrong Username or Password'})
            })
            .catch(error => {
               res.status(500).json(error)
            })
         })
         .catch(error => {
            res.status(400).json({message: 'Wrong Username or Password'})
         })
})

let server = http.createServer(app);
server.listen(9090)

//creating a websocket route at port /signaling 
var wss = new WebSocketServer({server: server, path: "/signaling"});
let activeConnections = {}
//when a user connects to our sever 
wss.on('connection', function(connection) { 
   console.log("user connected");
	
   //when server gets a message from a connected user 
   connection.on('message', function(messageJson){
      let message = JSON.parse(messageJson)
      console.log(message.data.type)
      if(message.data.type  === 'offer') {
         // console.log('receive offer')
         if(activeConnections[message.to]) {
            activeConnections[message.to].send(JSON.stringify(message))
         } else {
            console.log('user not connected')
         }
      } 
      else if(message.data.type === 'answer') {
         console.log('receive answer')
         if(activeConnections[message.to]) {
            activeConnections[message.to].send(JSON.stringify(message))
         } else {
            console.log('user not connected')
         }
      }
      else if(message.data.type === 'candidate') {
         if(activeConnections[message.to]) {
            activeConnections[message.to].send(JSON.stringify(message))
         }
      }
      else if(message.data.type === 'user') {
         activeConnections[message.data.from] = connection
         console.log('user' + activeConnections)
      }
      console.log("Got message from a user:", message);
   }); 
	
   // connection.send(JSON.stringify({offer: 'offer', user: 'oman'})); 
});