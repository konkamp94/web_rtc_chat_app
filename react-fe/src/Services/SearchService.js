import React, { Component } from 'react';
import axios from 'axios'

export default class SearchService extends Component{
    searchByUsername = (username) => {
        return axios.get(`http://localhost:9090/user?username=${username}`)
    } 
}