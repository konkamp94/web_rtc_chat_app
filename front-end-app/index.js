let username = prompt('Enter your username')
// let contactUsername = prompt('Enter contact username')
let accessToken = prompt("Pass Access Token")
const connectButton = document.getElementById("connect-button")
// Getting the stream of the webcam and feed it to the videoCam element
const videoCam = document.getElementById("videoCam")
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function (stream) {
        console.log(stream)
        videoCam.srcObject = stream;
      })
      .catch(function (error) {
        console.log("Something went wrong!");
      });
  }

// create RTCPeer Connection   
// open connection to the server   
let peerConnections = {}
let dataChannels = {}
serverConnection = new WebSocket('ws://localhost:9090/signaling');
const signal = new SignalingHandler(serverConnection);

serverConnection.onopen = (event) => {
  
  signal.sendAuthenticationMessage(accessToken, username)

  connectButton.addEventListener('click', () => {
    let contactUsername = document.getElementById('friend-username').value;
    if(!peerConnections[contactUsername]) {

      peerConnections[contactUsername] = new CustomRTCPeerConnection(username, contactUsername);

      peerConnections[contactUsername].peerConnection.onicecandidate = (event) => {
        if(event.candidate) {
          signal.sendCandidate(event.candidate, username, contactUsername)
        }
      } 

      peerConnections[contactUsername].peerConnection.ondatachannel = (event) => {
        var dataChannel = event.channel
        dataChannel.onmessage = (message) => {
          console.log(message)
        }
      }

      dataChannels[contactUsername] = peerConnections[contactUsername].peerConnection.createDataChannel('chat-messages')

      peerConnections[contactUsername].peerConnection.onconnectionstatechange = (event) => {
        console.log(event)
        if (peerConnections[contactUsername].peerConnection.connectionState === 'connected') {
            console.log('PeersConnected')
            dataChannels[contactUsername].onopen = () => {
              document.getElementById('send').addEventListener('click', () => {
                dataChannels[contactUsername].send({ message:  document.getElementById('send-message-input').value })
              })
            }
        }
      }

      peerConnections[contactUsername].createOffer()
        .then(offer => {
          signal.sendOfferOrAnswer(offer, username, contactUsername)
        })
    } else {
      console.log('connection exists')
    }
  })

    serverConnection.onmessage = (messageEvent) => {
      
      message = JSON.parse(messageEvent.data);

      if(!peerConnections[message.from]) {

        peerConnections[message.from] = new CustomRTCPeerConnection(username, message.from);

        peerConnections[message.from].peerConnection.onicecandidate = (event) => {
          if(event.candidate) {
            signal.sendCandidate(event.candidate, username, message.from)
          }
        };  
  
        peerConnections[message.from].peerConnection.ondatachannel = (event) => {
          dataChannels[message.from] = event.channel;

          dataChannels[message.from].onmessage = (message) => {
            console.log(message)
          }
          
          dataChannels[message.from].onopen = () => {
            document.getElementById('send').addEventListener('click', () => {
              dataChannels[message.from].send({ message:  document.getElementById('send-message-input').value })
            })
          }
        }

        peerConnections[message.from].peerConnection.onconnectionstatechange = (event) => {
          if (peerConnections[message.from].peerConnection === 'connected') {
              console.log('PeersConnected')

              dataChannels[contactUsername].onopen = () => {
                document.getElementById('send').addEventListener('click', () => {
                  dataChannels[contactUsername].send({ message:  document.getElementById('send-message-input').value });
                })
              } 
          }
        }

      }

      if(message.data.type === 'offer') {
        console.log('receive Offer ' + message.data)
        peerConnections[message.from].receiveOfferAndCreateAnswer(message)
            .then(answer => {
              signal.sendOfferOrAnswer(answer, username, message.from)
            });
      }
      else if(message.data.type === 'answer') {
        console.log('receive Answer ' + message.data)
        peerConnections[message.from].receiveAnswer(message);
      }
      else if(message.data.type === 'candidate') {
        console.log('receive candidate')
        peerConnections[message.from].receiveIceCandidate(message);
      } else if(message.data.type === 'authentication error') {
        console.log(message)
      }


  }
}