import React from 'react'

const message = (props) => {
    return (
        <div>
            <p>Hi {props.name}</p>
            {props.children}
        </div>
    );
}

export default message