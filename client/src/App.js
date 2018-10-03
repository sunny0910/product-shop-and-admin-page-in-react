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
      loggedIn: false,
      serverError: false
    }
    this.loggedIn = this.loggedIn.bind(this);
    this.serverError = this.serverError.bind(this);
  }

  loggedIn(value) {
    this.setState({
      loggedIn: value
    });
  }

  serverError(value) {
    this.setState({
      serverError: value
    });
  }

  render() {
    const serverErrorStyle = this.state.serverError ? {display: 'block'} : {display: 'none'};
    return (
      <div className="App">
      <div className ="serverError" style = {serverErrorStyle}>
        <p> Unable to connect, Please try again later! </p>
      </div>
        <Router>
            <div>
              <Switch>
                <Route 
                  exact path='/'
                  render = {() => <Login loggedIn = {this.loggedIn} serverError = {this.serverError} />}
                />
                <Route 
                  exact path = '/login'
                  render = {() => <Login loggedIn = {this.loggedIn} serverError = {this.serverError} />}
                />
                <Route
                  exact path = '/register'
                  render = {() => <Register loggedIn = {this.loggedIn} serverError = {this.serverError} />}
                />
              </Switch>
            </div>
        </Router>
      </div>
    );
  }
}

export default App;
