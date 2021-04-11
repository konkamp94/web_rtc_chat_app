class CustomRTCPeerConnection {

    constructor(username, contactUsername) {
        this.configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        this.peerConnection = new webkitRTCPeerConnection(this.configuration);
        this.username = username
        this.contactUsername = contactUsername
    }

    createOffer = async () => {
        const offer = await this.peerConnection.createOffer()
        await this.peerConnection.setLocalDescription(offer);
        return offer
    }

    createAnswer = async () => {
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        return answer
    }

    receiveOfferAndCreateAnswer = async (message) => {
        const remoteDescr = new RTCSessionDescription(message.data);
        await this.peerConnection.setRemoteDescription(remoteDescr);
        return await this.createAnswer()
    }

    receiveAnswer = async (message) => {
        const remoteDescr = new RTCSessionDescription(message.data);
        await this.peerConnection.setRemoteDescription(remoteDescr)
    }

    receiveIceCandidate = async (message) => {
        console.log(message)
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(message.data.candidate));
    }



}