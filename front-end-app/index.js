let username = prompt('Enter your username')
let contactUsername = prompt('Enter contact username')
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
const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
const peerConnection = new webkitRTCPeerConnection(configuration);
// open connection to the server   
serverConnection = new WebSocket('ws://localhost:9090/signaling');
const rtcHandler = new RTCPeerConnectionHandler(peerConnection);
const signal = new SignalingHandler(serverConnection);

peerConnection.onicecandidate = (event) => {
  if(event.candidate) {
    signal.sendCandidate(event.candidate, username, contactUsername)
  }
}

peerConnection.ondatachannel = (event) => {
  var dataChannel = event.channel
  dataChannel.onmessage = (message) => {
    console.log(message)
  }
}

serverConnection.onopen = (event) => {
  let textChannel
  signal.sendAuthenticationMessage(accessToken, username, contactUsername)
  
  connectButton.addEventListener('click', () => {
    textChannel = peerConnection.createDataChannel('mychannel')
    rtcHandler.createOffer()
      .then(offer => {
        signal.sendOfferOrAnswer(offer, username, contactUsername)
      })
  })

    serverConnection.onmessage = (messageEvent) => {
      
      message = JSON.parse(messageEvent.data)
      if(message.data.type === 'offer') {
        console.log('receive Offer ' + message.data)
        rtcHandler.receiveOfferAndCreateAnswer(message)
            .then(answer => {
              signal.sendOfferOrAnswer(answer, username, contactUsername)
            });
      }
      else if(message.data.type === 'answer') {
        console.log('receive Answer ' + message.data)
        rtcHandler.receiveAnswer(message);
      }
      else if(message.data.type === 'candidate') {
        rtcHandler.receiveIceCandidate(message);
      } else if(message.data.type === 'authentication error') {
        console.log(message)
      }
    }

    peerConnection.onconnectionstatechange = (event) => {
      if (peerConnection.connectionState === 'connected') {
          console.log('PeersConnected')
          if(username === 'oman') {
            textChannel.onopen = () => {
            textChannel.send(JSON.stringify({ message: 'hey P2P CONNECTION' }))
          // Peers connected!
            }
          }
    }
  }

}
