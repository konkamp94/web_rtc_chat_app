import React, { useState } from 'react'
import { Container , Row, Col, ListGroup } from 'react-bootstrap'
import { Nav, Tab } from 'react-bootstrap'

const OpenConnectionsTabs = (props) => {

    let openConnections = []
    for(const [key, value] of Object.entries(props.peerConnections)) {
        if(value.peerConnection.connectionState === 'connected') {
            openConnections.push(            
                (<Nav.Item key={key}>
                    <Nav.Link eventKey={key}>{key}</Nav.Link>
                </Nav.Item>)
            )
        }
    }
    console.log("openConnections cOMPONENT RENDERED")
    console.log(openConnections)

    return (
    <Tab.Container id="left-tabs-example">
        <h5>Open Connections</h5>

        <Nav variant="pills" className="flex-column">
            { openConnections.map(connectionItem => connectionItem) }
        </Nav>
    </Tab.Container>
    )
}

export default OpenConnectionsTabs