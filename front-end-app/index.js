let username = prompt('Enter your username')

const connectButton = document.getElementById("connect-button")
// Getting the stream of the webcam and feed it to the videoCam element
const videoCam = document.getElementById("videoCam")
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
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
    serverConnection.send(JSON.stringify({data: { type: 'candidate', candidate: event.candidate } }))
  }
}

peerConnection.onicegatheringstatechange = (event) => {
  if(event) {
    console.log(event)
  }
}

peerConnection.onconnectionstatechange = (event) => {
  if (peerConnection.connectionState === 'connected') {
      console.log('PeersConnected')
      // Peers connected!
  }
}

// open connection to the server   
serverConnection = new WebSocket('ws://localhost:9090');

serverConnection.onopen = (event) => {
  
  serverConnection.send(JSON.stringify({ data: { type: 'user', username: username} }))
  serverConnection.send(JSON.stringify({ data: { type: 'candidate', candidate: 'candidate'} }))
  connectButton.addEventListener('click', () => {
    peerConnection.createDataChannel('mychannel')
    rtcHandler.createOffer()
      .then(offer => {
        serverConnection.send(JSON.stringify({ data: offer , username: 'omanmu'}))
      })
  })

    serverConnection.onmessage = (messageEvent) => {
      console.log(messageEvent)
      message = JSON.parse(messageEvent.data)
      if(message.data.type === 'offer') {
        console.log('receive Offer ' + message.data)
        rtcHandler.receiveOfferAndCreateAnswer(message)
            .then(answer => {
              serverConnection.send(JSON.stringify({ data: answer, username: 'oman' }))
            });
      }
      else if(message.data.type === 'answer') {
        console.log('receive Answer ' + message.data)
        rtcHandler.receiveAnswer(message);
      }
      else if(message.iceCandidate) {
        rtcHandler.receiveIceCandidate(message);
      }
    }

}
