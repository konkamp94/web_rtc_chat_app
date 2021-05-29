import { React } from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import Message from '../Message/Message'
import '../ChatContainer/ChatContainer.css'
const ChatContainer = (props) => {

    let contactName = props.contactName
    let myUsername = props.myUsername
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
        if(messagesList[i].owner === myUsername) {
            messages.push(<Message
                                key={i} 
                                isMyMessage={true}
                                sender={messagesList[i].owner}
                                message={messagesList[i].text}
                                datetime={messagesList[i].datetime}
                        ></Message>)
        } else {
            console.log('not me')
            messages.push(<Message
                key={i} 
                isMyMessage={false}
                sender={messagesList[i].owner}
                message={messagesList[i].text}
                datetime={messagesList[i].datetime}
        ></Message>)
        }
    }

    let messageInput
    return (
        <Container fluid>
                <header className="msger-header">
                    <div className="msger-header-title">
                        <i className="fas fa-comment"></i> {contactName}
                    </div>
                </header>

                <Row>
                   
                        <Col xs={12}>
                            <div style={{height:'450px', overflowY:'auto'}}>
                                {/* messages array */}
                                {/* list of messages */}
                                {messages}
                            </div>
                        </Col>
                       
                        <Col xs={9} style={{marginTop:'8px'}}>
                            <input className="form-control" ref={(ref) => {messageInput = ref}} type="text" placeholder="new message" style={{width:'100%'}}></input>
                        </Col>
                        <Col xs={3} style={{marginTop:'8px'}}>
                            <button className="btn btn-primary" onClick={() => { 
                                props.onClickSend(messageInput.value) 
                                messageInput.value = ''
                                }} style={{width:'100%'}}>Send</button>
                        </Col>
                </Row>
        </Container>
    )
}

export default ChatContainer