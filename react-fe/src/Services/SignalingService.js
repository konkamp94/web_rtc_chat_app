import React, { Component } from 'react';
import axios from 'axios'

export default class SignalingService extends Component {
    // serverConnection is the websocket connection with the signaling server
    constructor(serverConnection) {
        super();
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
        this.serverConnection.send(
            JSON.stringify({data: { type: 'candidate', candidate }, from, to })
        )
    }
    
}