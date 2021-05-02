import { React, Component } from 'react'
import './App.css';
import Message from './Message/Message'
import LoginOrRegister from './Login/Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AuthService from './Services/AuthService';
// import AuthService from './Services/AuthService'

class App extends Component{
  
  constructor() {
    super()
    this.authService = new AuthService()
  }

  state = {
    isAuthenticated: false,
    formType: 'login'
  }

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
    .catch(error => console.log(error))
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
    .catch(error => console.log(error))
  }

  toggleFormType = () => {
    let newFormType = this.state.formType === 'login' ? 'register' : 'login'
    this.setState({
      ...this.state,
      formType: newFormType
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
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/">
              <h1>Home</h1>
            </Route>
            <Route exact path="/about">
              <h1>About</h1>
            </Route>
          </Switch>
        </div>
      </Router>
      )
    }

    return dom
  }
}

export default App;
