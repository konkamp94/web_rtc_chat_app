import React, { useState } from 'react'
import { Container , Row, Col, ListGroup } from 'react-bootstrap'
import { Nav, Tab } from 'react-bootstrap'

const OpenConnectionsTabs = () => {
    return (
    <Tab.Container id="left-tabs-example">
        <h5>Open Connections</h5>
        <Nav variant="pills" className="flex-column">
            <Nav.Item>
                <Nav.Link eventKey="first">Tab 1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="second">Tab 2</Nav.Link>
            </Nav.Item>
      </Nav>
    </Tab.Container>
    )
}

export default OpenConnectionsTabs