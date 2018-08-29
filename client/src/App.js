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
  render() {
    return (
      <div className="App">
        <Router>
            <div>
              <Switch>
                <Route exact path='/' component = {Login} />
                <Route path = '/login' component = {Login} />
                <Route path = '/register' component = {Register} />
              </Switch>
            </div>
        </Router>
      </div>
    );
  }
}

export default App;
