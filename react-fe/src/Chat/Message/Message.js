import React from 'react'
import './Message.css'
const Message = (props) => {

    let sender = props.sender
    let message = props.message
    let datetime = props.datetime
    let isMyMessage = props.isMyMessage
    
    let classesForMessageOwner = []
    if(isMyMessage) {
        sender = 'Me'
        classesForMessageOwner.push('msg')
        classesForMessageOwner.push('right-msg')
    } else {
        classesForMessageOwner.push('msg')
        classesForMessageOwner.push('left-msg')
    }
    console.log(classesForMessageOwner)
    return (
        <div className={classesForMessageOwner.join(' ')}>
            <div className="msg-bubble">
            <div className="msg-info">
                <div className="msg-info-name">{sender}</div>
                <div className="msg-info-time"></div>
            </div>
            <div className="msg-text" style={{overflowWrap: 'break-word'}}>
                {message}
            </div>
            </div>
        </div>
    );
}

export default Message