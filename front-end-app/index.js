let username = prompt('Enter your username')
let contactUsername = prompt('Enter contact username')

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

const rtcHandler = new RTCPeerConnectionHandler(peerConnection);

peerConnection.onicecandidate = (event) => {
  if(event.candidate) {
    serverConnection.send(JSON.stringify({data: { type: 'candidate', candidate: event.candidate }, from: username, to: contactUsername }))
  }
}

peerConnection.ondatachannel = (event) => {
  var dataChannel = event.channel
  dataChannel.onmessage = (message) => {
    console.log(message)
  }
}

// open connection to the server   
serverConnection = new WebSocket('ws://localhost:9090');

serverConnection.onopen = (event) => {
  let textChannel
  serverConnection.send(JSON.stringify({ data: { type: 'user', from: username, to: contactUsername} }))
  
  connectButton.addEventListener('click', () => {
    textChannel = peerConnection.createDataChannel('mychannel')
    rtcHandler.createOffer()
      .then(offer => {
        serverConnection.send(JSON.stringify({ data: offer , from: username, to: contactUsername}))
      })
  })

    serverConnection.onmessage = (messageEvent) => {
      
      message = JSON.parse(messageEvent.data)
      if(message.data.type === 'offer') {
        console.log('receive Offer ' + message.data)
        rtcHandler.receiveOfferAndCreateAnswer(message)
            .then(answer => {
              serverConnection.send(JSON.stringify({ data: answer, from: username, to: contactUsername }))
            });
      }
      else if(message.data.type === 'answer') {
        console.log('receive Answer ' + message.data)
        rtcHandler.receiveAnswer(message);
      }
      else if(message.data.type == 'candidate') {
        rtcHandler.receiveIceCandidate(message);
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
