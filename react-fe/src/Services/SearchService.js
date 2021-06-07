import React, { Component } from 'react';
import axios from 'axios'


// development
// const api_url = 'http://localhost:9090/api'

//  production
const api_url = 'http://ec2-18-219-127-149.us-east-2.compute.amazonaws.com/api'
export default class SearchService extends Component{
    searchByUsername = (username) => {
        return axios.get(`${api_url}/user?username=${username}`)
    } 
}