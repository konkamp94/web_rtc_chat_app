import React, { useState } from 'react'
import {Container, Form, Row, Col} from 'react-bootstrap'
import UserSearchResult from  '../UserSearchResult/UserSearchResult'

const HomeSearch = (props) => {
    let searchByUsernameInput
    // let user = props.paramsForUserSearchResult.user
    // let notFoundMessage = props.paramsForUserSearchResult.notFoundMessage 
    // let onClickConnect = props.paramsForUserSearchResult.onClickConnect

    return (
        <Container>
            <Row className="form-group align-items-end">
                <Col xs={12} sm={9}>
                        <Form.Control ref={(ref) => {searchByUsernameInput = ref}} type="text" placeholder="Search for your friend" />
                </Col>
                <Col xs={12} sm={3}>
                   <button className="btn btn-primary" style={{width:'100%'}} onClick={() => props.onClickSearch(searchByUsernameInput.value)}> Search </button>
                </Col>
            </Row>
            {/* searchResult */}
            {props.children}
        </Container>
    )

}

export default HomeSearch