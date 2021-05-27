import { React } from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import Message from '../Message/Message'

const ChatContainer = (props) => {

    let contactName = props.contactName
    let messagesList = props.messagesList
    console.log(messagesList)
    if(!contactName) {
        return (
            <Container fluid>
                <p> Select a contact from the tabs or go to home to search for a friend! </p>
            </Container>
        )
    }

    let messages = []
    for(let i=0; i<messagesList.length;i++) {
        messages.push(<Message
                               key={i} 
                               sender={messagesList[i].owner}
                               message={messagesList[i].text}
                               datetime={messagesList[i].datetime}
                      ></Message>)
    }

    let messageInput
    return (
        <Container fluid>
            <p> {contactName} </p>
            <Row>
                <Col xs={12}>
                    <div style={{height:'300px'}}>
                        {/* messages array */}
                        {/* list of messages */}
                        {messages}
                    </div>
                </Col>
                <Col xs={9}>
                    <input ref={(ref) => {messageInput = ref}} type="text" placeholder="new message" style={{width:'100%'}}></input>
                </Col>
                <Col xs={3}>
                    <button onClick={() => props.onClickSend(messageInput.value)} style={{width:'100%'}}>Send</button>
                </Col>
            </Row>
        </Container>
    )
}

export default ChatContainer