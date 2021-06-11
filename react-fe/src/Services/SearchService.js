import React, { Component } from 'react';
import axios from 'axios'

// development
const api_url = process.env.REACT_APP_API_URL ?? 'http://localhost:9090/api'

export default class SearchService extends Component{
    searchByUsername = (username) => {
        return axios.get(`${api_url}/user?username=${username}`)
    } 
}