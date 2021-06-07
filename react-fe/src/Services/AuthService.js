import React, { Component } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios'

// development
// const api_url = 'http://localhost:9090'
//  production
const api_url = 'http://ec2-18-219-127-149.us-east-2.compute.amazonaws.com'

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
        return axios.post(`${api_url}/login/`, body)
    }

    register = (username, password) => {
        let body = { username, password }
        return axios.post(`${api_url}/register/`, body)
    }
}