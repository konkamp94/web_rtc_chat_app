import { React, Component } from 'react'
import './App.css';
import Message from './Message/Message'
import Login from './Login/Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends Component{
  
  state = {
    isAuthenticated: false
  }

  render(){

    let dom = <Login/>

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
