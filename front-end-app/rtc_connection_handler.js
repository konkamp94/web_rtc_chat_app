class RTCPeerConnectionHandler {

    constructor(peerConnection) {
        this.peerConnection = peerConnection
    }

    async createOffer() {
        const offer = await this.peerConnection.createOffer()
        await this.peerConnection.setLocalDescription(offer);
        return offer
    }

    async createAnswer() {
        const answer = await this.peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        return answer
    }

    async receiveOfferAndCreateAnswer(message) {
        const remoteDescr = new RTCSessionDescription(message.data);
        await this.peerConnection.setRemoteDescription(remoteDescr);
        return await this.createAnswer()
    }

    async receiveAnswer(message) {
        const remoteDescr = new RTCSessionDescription(message.data);
        await this.peerConnection.setRemoteDescription(remoteDescr)
    }

    async receiveIceCandidate(message) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(message.iceCandidate));
    }



}