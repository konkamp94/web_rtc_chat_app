import React, { useState } from 'react'
import { Container , Row, Col, ListGroup } from 'react-bootstrap'
import  ConnectionTab from '../ConnectionTab/ConnectionTab'
import { Nav, Tab } from 'react-bootstrap'

const OpenConnectionsTabs = (props) => {

    let openConnections = []
    for(const [key, value] of Object.entries(props.peerConnections)) {
        if(value.peerConnection.connectionState === 'connected') {
            openConnections.push(   
                (<ConnectionTab key={key} name={key} 
                                onClickTab={props.onClickTab} 
                                selectedTab={props.selectedTab}>
                </ConnectionTab>)         
            )
        }
    }
    console.log("openConnections cOMPONENT RENDERED")
    console.log(openConnections)

    return (
    <Tab.Container id="left-tabs-example">
        <p>Open Connections</p>
        { openConnections.map(connectionItem => connectionItem) }
    </Tab.Container>
    )
}

export default OpenConnectionsTabs