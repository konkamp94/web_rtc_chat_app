import { React, Component, useState } from 'react'
import axios from 'axios'
import { Container, Button, Form, Row, Card, Col } from 'react-bootstrap';
import { message } from './Login.css'
const LoginOrRegister = (props) => {

    let usernameInput;
    let passwordInput;
    let button;
    let message;

    if(props.formType === 'login') {
        button = <Button onClick={() => props.onClickLogin(usernameInput.value, passwordInput.value)} variant="primary">
            Login
        </Button>
        message ='not register?'
    } else if(props.formType === 'register') {
        button = <Button onClick={() => props.onClickRegister(usernameInput.value, passwordInput.value)} variant="primary">
            Register
        </Button>
        message= 'already registered?'
    }

    return (
        <Container>
                <h1 style={{textAlign: 'center'}}>WebRTC Application</h1>
                <Row className="justify-content-center">
                    <Col className="align-self-center" sm={6}>
                        <Card>
                        <Card.Body>
                            <Form>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control ref={(ref) => {usernameInput = ref}} type="text" placeholder="Username" />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control ref={(ref) => {passwordInput = ref}} type="password" placeholder="Password" />
                            </Form.Group>
                            {button}
                            </Form>
                        </Card.Body>
                        </Card>
                        <p onClick={() => props.toggleFormType()} className='message'>
                            {message}
                        </p>
                    </Col>
                </Row>
        </Container>
    );

}

export default LoginOrRegister