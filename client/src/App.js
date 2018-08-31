import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import './App.css';
import Login from './components/admin/Login';
import Register from './components/admin/Register';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
            <div>
              <Switch>
                <Route exact path='/' component = {Login} loggedIn = {this.state.loggedIn} />
                <Route exact path = '/login' component = {Login} loggedIn = {this.state.loggedIn} />
                <Route exact path = '/register' component = {Register} loggedIn = {this.state.loggedIn} />
              </Switch>
            </div>
        </Router>
      </div>
    );
  }
}

export default App;
