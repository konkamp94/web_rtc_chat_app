import { React } from 'react'
import {Container, Row, Col} from 'react-bootstrap'

const ChatContainer = (props) => {

    let contactName = props.contactName
    if(!contactName) {
        return (
            <Container fluid>
                <p> Select a contact from the tabs! </p>
            </Container>
        )
    }

    return (
        <Container fluid>
            <p> {contactName} </p>
            <Row>
                <Col xs={12}>
                    <div style={{height:'300px'}}>
                        {/* messages array */}
                        {/* list of messages */}
                    </div>
                </Col>
                <Col xs={9}>
                    <input type="text" placeholder="new message" style={{width:'100%'}}></input>
                </Col>
                <Col xs={3}>
                    <button style={{width:'100%'}}>Send</button>
                </Col>
            </Row>
        </Container>
    )
}

export default ChatContainer