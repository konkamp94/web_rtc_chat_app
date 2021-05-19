import { React, Component } from 'react'
import './App.css';
import Message from './Chat/Message/Message'
import LoginOrRegister from './Login/Login'
import HomeSearch from './HomeSearch/HomeSearch'
import UserSearchResult from './UserSearchResult/UserSearchResult'
import OpenConnectionsTabs from './OpenConnectionTabs/OpenConnectionTabs'
import ChatContainer from './Chat/ChatContainer/ChatContainer'
import {
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import { Navbar, Nav, NavDropdown} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { Row, Col} from 'react-bootstrap'
import AuthService from './Services/AuthService';
import SearchService from './Services/SearchService';
import SignalingService from './Services/SignalingService';
import CustomRTCPeerConnection from './Utils/CustomRTCPeerConnection'
import HandleConnectionsService from './Services/HandleConnectionsService';
import message from './Chat/Message/Message';


class App extends Component{
  
  constructor() {
    super();
    
    this.authService = new AuthService();
    this.searchService = new SearchService();
    this.handleConnectionsService = new HandleConnectionsService();
    this.signalingService = null;
    this.serverConnection = null;
    this.state = {
      //for routing
      redirect: null,

      isAuthenticated: window.localStorage.getItem('accessToken') ? true : false,
  
      //variable for the state of LoginOrRegisterComponent
      formType: 'login',
  
      //found user
      foundUser: null,
      notFoundMessage: false,
  
      //web_rtc_connections
      serverConnectionIsOpen: false,
      peerConnections: {},
      dataChannels: {},

      //signal for openConnections re-render
      newEstablishedConnection: null,
      //selectedTab
      selectedTabContactName: null

    };

    this.openSignalingWebsocketConnection()

  }

  openSignalingWebsocketConnection = () => {
    if(this.state.isAuthenticated) {
      //open the signaling websocket connection
      this.serverConnection = new WebSocket('ws://localhost:9090/signaling');
      this.signalingService = new SignalingService(this.serverConnection);

      this.serverConnection.onopen = (event) => {
        // change the serverConnectionState to open and authenticate websocket connection to proceed to signaling
        this.setState({
          ...this.state,
          serverConnectionIsOpen: true
        })

        const accessToken = window.localStorage.getItem('accessToken')
        const myUsername = this.authService.getDecodedJwt(accessToken).username

        this.signalingService.sendAuthenticationMessage(accessToken, this.authService.getDecodedJwt(accessToken).username)


        // listen messages from signaling server
        this.serverConnection.onmessage = (messageEvent) => {
          
          const message = JSON.parse(messageEvent.data);
          console.log(message)
          console.log(this.state.peerConnections);
          if(!this.state.peerConnections[message.from]) {
            console.log('creating connection to receiver')
            let newPeerConnections = {...this.state.peerConnections}
            newPeerConnections[message.from] = new CustomRTCPeerConnection(myUsername, message.from);
            console.log(newPeerConnections)
            this.setState({
              ...this.state,
              peerConnections: { ...newPeerConnections }
            }, () => {
              console.log(this.state.peerConnections)
              this.state.peerConnections[message.from].peerConnection.onicecandidate = (event) => {
                if(event.candidate) {
                  this.signalingService.sendCandidate(event.candidate, myUsername, message.from)
                }
              };  
        
              this.state.peerConnections[message.from].peerConnection.ondatachannel = (event) => {
                this.state.dataChannels[message.from] = event.channel;
      
                this.state.dataChannels[message.from].onmessage = (message) => {
                  console.log(message)
                }
                
                this.state.dataChannels[message.from].onopen = () => {
                  // document.getElementById('send').addEventListener('click', () => {
                  //   this.state.dataChannels[message.from].send({ message:  document.getElementById('send-message-input').value })
                  // })
                }
              }
      
              this.state.peerConnections[message.from].peerConnection.onconnectionstatechange = (event) => {
                console.log(this.state.peerConnections[message.from].peerConnection.connectionState)
                if (this.state.peerConnections[message.from].peerConnection.connectionState === 'connected') {
                    console.log('PeersConnected')
                    // to re-render openConnections component
                    this.setState({
                      ...this.state,
                      newEstablishedConnection: this.state.peerConnections[message.from]
                    });
                } else if(this.state.peerConnections[message.from].peerConnection.connectionState === 'disconnected') {
                  this.state.peerConnections[message.from].peerConnection.close();
  
                  let newPeerConnections = { ...this.state.peerConnections };
                  let newDataChannels = { ...this.state.dataChannels };

                  delete newPeerConnections[message.from];
                  if(this.state.dataChannels[message.from]) {
                    delete newDataChannels[message.from];
                  }
  
                  this.setState({
                    ...this.state,
                    peerConnections: newPeerConnections,
                    dataChannels: newDataChannels
                  });
                }
              }
            })
    
          }
    
          if(message.data.type === 'offer') {
            console.log('receive Offer ' + message.data)
            this.state.peerConnections[message.from].receiveOfferAndCreateAnswer(message)
                .then(answer => {
                  this.signalingService.sendOfferOrAnswer(answer, myUsername, message.from)
                });
          }
          else if(message.data.type === 'answer') {
            console.log('receive Answer ' + message.data)
            this.state.peerConnections[message.from].receiveAnswer(message);
          }
          else if(message.data.type === 'candidate') {
            console.log('receive candidate')
            this.state.peerConnections[message.from].receiveIceCandidate(message);
          } else if(message.data.type === 'authentication error') {
            this.setState({
              ...this.state,
              isAuthenticated: false
            })
            window.localStorage.removeItem('accessToken')
            // TODO refresh token
            console.log(message)
          }
    
    
        }

      }
    }
  }

  onClickConnect() {
    // take the username that you found from your search
    console.log(this.onClickConnect)
    const contactUsername = this.state.foundUser.username
    const accessToken = window.localStorage.getItem('accessToken')
    const myUsername = this.authService.getDecodedJwt(accessToken).username

    // check if the signaling ws connection is open
    if(this.state.serverConnectionIsOpen) {

      // check if the peerConnection dont exist with this contact
      if(!this.state.peerConnections[contactUsername]) {
          // create peerConnection if not exists with the contact
          let newPeerConnections = {...this.state.peerConnections }
          newPeerConnections[contactUsername] = new CustomRTCPeerConnection(myUsername, contactUsername);

          // first change state with the new PeerConnection then create the dataChannel and then add the listeners
          // and sends the offer
          this.setState({
            ...this.state,
            peerConnections: {...newPeerConnections}
            }, 

            //callback after peerConnections state changed
            () => {
              
              // create a dataChannel for the connection and saves it to the state
              let newDataChannel = this.state.peerConnections[contactUsername]
              .peerConnection.createDataChannel('chat-messages')
              let newDataChannels = {...this.state.dataChannels}
              newDataChannels[contactUsername] = this.state.peerConnections[contactUsername]
                                                 .peerConnection.createDataChannel('chat-messages')

              this.setState({
                ...this.state,
                dataChannels: {...newDataChannels}
              }, 
              // peerconnection and dataChannel listeners
              () => {
                // create a iceCandidate event listener for the connection
                this.state.peerConnections[contactUsername].peerConnection.onicecandidate = (event) => {
                  if(event.candidate) {
                    this.signalingService.sendCandidate(event.candidate, myUsername, contactUsername)
                  }
                }
                
                this.state.peerConnections[contactUsername].peerConnection.onconnectionstatechange = (event) => {
                console.log(this.state.peerConnections[contactUsername].peerConnection.connectionState)

                if (this.state.peerConnections[contactUsername].peerConnection.connectionState === 'connected') {
                    // this.setState({ ...this.state, redirect: "/chat" });
                    console.log('PeersConnected')

                    this.state.dataChannels[contactUsername].onopen = () => {
                      console.log('ChatOpened')
                      // theres no need for that because openConnection will be re-render after routing ! 
                      this.setState({
                        ...this.state,
                        newEstablishedConnection: this.state.peerConnections[contactUsername]
                      });

                      this.props.history.push('/chat')
                      // document.getElementById('send').addEventListener('click', () => {
                      //   this.state.dataChannels[contactUsername].send({ message:  document.getElementById('send-message-input').value })
                      // })
                      this.state.dataChannels[contactUsername].onmessage = (message) => {
                        // createElement('messages','PARAGRAPH',message.data)
                        console.log(message)
                      }
                    }
                } else if(this.state.peerConnections[contactUsername].peerConnection.connectionState === 'failed') {
                    this.state.peerConnections[contactUsername].peerConnection.restartIce();
                    this.state.peerConnections[contactUsername].createOffer()
                    .then(offer => {
                      this.signalingService.sendOfferOrAnswer(offer, myUsername, contactUsername)
                    })
                } else if(this.state.peerConnections[contactUsername].peerConnection.connectionState === 'disconnected') {
                  this.state.peerConnections[contactUsername].peerConnection.close();
                  let newPeerConnections = this.state.peerConnections;
                  let newDataChannels = this.state.dataChannels;
                  delete newPeerConnections[contactUsername];
                  delete newDataChannels[contactUsername];
                  this.setState({
                    ...this.state,
                    peerConnections: newPeerConnections,
                    dataChannels: newDataChannels
                  });
                }
              }
            
            //send the offer
            this.state.peerConnections[contactUsername].createOffer()
              .then(offer => {
                this.signalingService.sendOfferOrAnswer(offer, myUsername, contactUsername)
              })
            })
        });
        
      } else {
        console.log('connection exists')
      }

    } else {
      console.log('No websocket connection')
    }
  }

  //openConnectionsTabsComponent 
  onClickTab = (event) => {
    let selectedTabContactName = event.target.innerText
    if(this.state.selectedTabContactName !== selectedTabContactName){
      this.setState({
        ...this.state,
        selectedTabContactName: selectedTabContactName
      });
    }

  }


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
      this.openSignalingWebsocketConnection()
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
      <div>
       {/* simple bs */}
        <Navbar bg="light" expand="md">
          <Navbar.Brand>WebRTC Chat</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/chat">
                <Nav.Link>Chat</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
          <Row style={{marginTop: '16px'}}>
            <Col sm={3} md={2}>
              <OpenConnectionsTabs peerConnections={this.state.peerConnections} 
                                   newEstablishedConnection={this.state.newEstablishedConnection}
                                   onClickTab={this.onClickTab.bind(this)}
                                   selectedTab={this.state.selectedTabContactName}
                                   >
              </OpenConnectionsTabs>
            </Col>
            <Col sm={9} md={10}>
              <Switch>
                <Route exact path="/">
                  <HomeSearch onClickSearch={this.onClickSearch}>
                    <UserSearchResult user={this.state.foundUser} 
                                      notFoundMessage={this.state.notFoundMessage} 
                                      onClickConnect={this.onClickConnect.bind(this)}> 
                    </UserSearchResult> 
                  </HomeSearch>
                </Route>
                <Route path="/chat">
                  <ChatContainer contactName={this.state.selectedTabContactName}>

                  </ChatContainer>
                </Route>
                
              </Switch>
            </Col>
          </Row>
        </div>
      )
    }

    return dom
  }
}

export default withRouter(App);
