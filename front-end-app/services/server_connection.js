class SignalingHandler {
    constructor(serverConnection) {
        this.serverConnection = serverConnection
    }

    sendAuthenticationMessage = (accessToken, from) => {
        this.serverConnection.send(
            JSON.stringify({ data: { type: 'authentication', accessToken }, from })
        )
    }

    sendOfferOrAnswer = (data, from, to) => {
        this.serverConnection.send(JSON.stringify({ data, from, to }))
    }

    sendCandidate = (candidate, from, to) => {
        serverConnection.send(
            JSON.stringify({data: { type: 'candidate', candidate }, from, to })
        )
    }

}

