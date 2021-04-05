//require our websocket library 
var WebSocketServer = require('ws').Server; 

//creating a websocket server at port 9090 
var wss = new WebSocketServer({port: 9090}); 
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