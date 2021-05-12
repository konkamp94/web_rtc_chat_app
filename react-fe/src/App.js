import { React, Component } from 'react'
import './App.css';
import Message from './Message/Message'
import LoginOrRegister from './Login/Login'
import HomeSearch from './HomeSearch/HomeSearch'
import OpenConnectionsTabs from './OpenConnectionTabs/OpenConnectionTabs'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Navbar, Nav, NavDropdown} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { Container , Row, Col, ListGroup } from 'react-bootstrap'
import AuthService from './Services/AuthService';
import SearchService from './Services/SearchService';
import HandleConnectionsService from './Services/HandleConnectionsService';


class App extends Component{
  
  constructor() {
    super();
    this.authService = new AuthService();
    this.searchService = new SearchService();
    this.HandleConnectionsService = new HandleConnectionsService();
  }

  state = {
    isAuthenticated: window.localStorage.getItem('accessToken') ? true : false,

    //variable for the state of LoginOrRegisterComponent
    formType: 'login',

    //found user
    foundUser: null,
    notFoundMessage: false
  };

  // LoginOrRegister component
  onClickLogin = (username, password) => {
    this.authService.login(username, password)
    .then(res => {
      window.localStorage.setItem('accessToken', res.data.accessToken)
      window.localStorage.setItem('refreshToken', res.data.refreshToken)
      this.setState({
          ...this.state,
          isAuthenticated: true
        }
      )
    })
    .catch(error => console.log(error.response.message))
  }

  onClickRegister = (username, password) => {
    this.authService.register(username, password)
    .then(res => { 
      this.setState({
        ...this.state,
        formType: 'login'
      })
      console.log(res) 
    })
    .catch(error => console.log(error.response.data.message))
  }

  toggleFormType = () => {
    let newFormType = this.state.formType === 'login' ? 'register' : 'login'
    this.setState({
      ...this.state,
      formType: newFormType
    })
  }

  // HomeSearch component
  onClickSearch = (username) => {
    this.searchService.searchByUsername(username)
      .then((res) => {
        console.log(res)
        if(res.status === 200) {
          this.setState({
            ...this.state,
            foundUser: {
              username: res.data.username,
              description: res.data.description,
              isOnline: res.data.isOnline
            },
            notFoundMessage: false
          });
        }
      })
      .catch(error => {
        if(error.response.status === 404) {
            this.setState({
              ...this.state,
              foundUser: null,
              notFoundMessage : true
            });
        }
      })
  }

  render(){

    let dom = <LoginOrRegister formType={this.state.formType}
                               toggleFormType={this.toggleFormType} 
                               onClickLogin={this.onClickLogin} 
                               onClickRegister={this.onClickRegister}/>

    if(this.state.isAuthenticated) {
      dom = 
      (
      <Router>

       {/* simple bs */}
      <Navbar bg="light" expand="md">
        <Navbar.Brand>WebRTC Chat</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
        <Row style={{marginTop: '16px'}}>
          <Col sm={2}>
            <OpenConnectionsTabs></OpenConnectionsTabs>
          </Col>
          <Col sm={10}>
            <Switch>
              <Route exact path="/">
                <HomeSearch onClickSearch={this.onClickSearch}
                            paramsForUserSearchResult={{ user: this.state.foundUser, notFoundMessage: this.state.notFoundMessage }}
                > 
                </HomeSearch>
              </Route>
              <Route exact path="/about">
                <h1>About</h1>
              </Route>
            </Switch>
          </Col>
        </Row>
      </Router>
      )
    }

    return dom
  }
}

export default App;
