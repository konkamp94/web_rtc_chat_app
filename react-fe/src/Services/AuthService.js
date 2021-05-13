import React, { Component } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios'

export default class AuthService extends Component{
    isAuthenticated

    isAuthenticated = () => {
        return this.isAuthenticated
    }

    getDecodedJwt(accessToken) {
        return jwt_decode(accessToken)
    }

    login = (username, password) => {
        let body = { username, password }
        return axios.post('http://localhost:9090/login/', body)
    }

    register = (username, password) => {
        let body = { username, password }
        return axios.post('http://localhost:9090/register/', body)
    }
}