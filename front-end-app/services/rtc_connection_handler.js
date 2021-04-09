class RTCPeerConnectionHandler {

    constructor(peerConnection) {
        this.peerConnection = peerConnection
    }

    createOffer = async () => {
        const offer = await this.peerConnection.createOffer()
        await this.peerConnection.setLocalDescription(offer);
        return offer
    }

    createAnswer = async () => {
        const answer = await this.peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
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
        await peerConnection.addIceCandidate(new RTCIceCandidate(message.data.candidate));
    }



}