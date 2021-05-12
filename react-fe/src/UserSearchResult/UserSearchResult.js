import { React, Component, useState, Profiler } from 'react'
import { Container, Button, Form, Row, Card, Col } from 'react-bootstrap';
import './UserSearchResult.css';

const UserSearchResult = (props) => {

    let template = null
    
    if(props.notFoundMessage && props.user === null) {
        template = (<h1> user not found </h1>)
    } else if (!props.notFoundMessage && props.user) {
        let connectionStatusIcon
        if(props.user.isOnline) {
            connectionStatusIcon = <span className="online-dot" ></span>
        } else {
            connectionStatusIcon = <span className="offline-dot" ></span>
        }

        template = (
            <Container>
                <Row>
                    <Col xs={{span: 12}} sm={{span: 10, offset:1}}>
                    <Card>
                        {/* If we add an image for the user*/}
                        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                            <Card.Body>
                                <Card.Title>
                                    <span style={{marginRight: '4px'}}>{props.user.username}</span>
                                    {connectionStatusIcon}
                                </Card.Title>
                                <Card.Text>
                                    {props.user.description}
                                </Card.Text>
                                <Button variant="primary">Connect</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    } 

    return template
}

export default UserSearchResult