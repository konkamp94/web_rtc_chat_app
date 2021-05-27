import React from 'react'

const Message = (props) => {
    let sender = props.sender
    let message = props.message
    let datetime = props.datetime
    console.log(datetime)
    return (
        <div>
            <span>{sender}</span>
            <br></br>
            <span>--------------</span>
            <br></br>
            <span>{message}</span>
            <br></br>
            <span style={{textAlign:'right'}}>{datetime}</span>
            <span>--------------</span>
        </div>
    );
}

export default Message