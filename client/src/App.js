import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.css';
import Login from './components/admin/Login';
import Register from './components/admin/Register';
import Products from './components/products/products';
import Users from './components/users/users';
import EditUser from './components/users/editUser';
import CreateUser from './components/users/createUser';
import Header from './../src/components/header/header';

class App extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      serverError: false,
      productsInCart: 0
    }
    this.userLogIn = this.userLogIn.bind(this);
    this.serverError = this.serverError.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  userLogIn(value) {
    this.setState({
      loggedIn: value
    });
    return true;
  }

  serverError(value) {
    this.setState({
      serverError: value
    });
  }

  logOut() {
    this.setState({
      loggedIn: false
    });
  }

  render() {
    const loggedIn = this.state.loggedIn;
    const serverErrorStyle = this.state.serverError ? {display: 'block'} : {display: 'none'};
    return (
      <div className="App">
        <div className ="serverError" style = {serverErrorStyle}>
          <p> Unable to connect, Please try again later! </p>
        </div>
        <Router>
            <div className='content'>
              <Header loggedIn = {this.state.loggedIn} logOut={this.logOut} productsInCart={this.state.productsInCart}/>
              <Switch>
                <Route 
                  exact path="/"
                  render = {() => (<Products serverError={this.serverError} />) }
                />
                <Route 
                  exact path="/products"
                  render = {() => (<Products serverError={this.serverError} />) }
                />
                <Route 
                  exact path="/users/:id/edit"
                  // render = {() => (loggedIn) ? (<EditUser/>) : (<Redirect to="/login" />) }
                  render = {(props) => (<EditUser serverError={this.serverError} {...props} />) }
                />
                <Route
                  exact path="/users"
                  // render = {() => (loggedIn) ? (<Users/>) : (<Redirect to="/login" />) }
                  render = {() => (<Users serverError={this.serverError}/>)}
                />
                <Route
                  exact path="/users/add"
                  //render = {() => (loggedIn) ? (<CreateUser/>) : (<Redirect to="/login" />) }
                  render = {() => (<CreateUser serverError={this.serverError}/>)}
                />
                <Route 
                  exact path = "/login"
                  render = {() => (loggedIn) ? (<Redirect to='/products'/>) : (<Login userLogIn = {this.userLogIn} serverError = {this.serverError} />) }
                />
                <Route
                  exact path = "/register"
                  render = {() => (loggedIn) ? (<Redirect to='/products'/>) : (<Register userLogIn = {this.userLogIn} serverError = {this.serverError} />) }
                />
                <Route
                  exact path = "/logout"
                  render = {() => (loggedIn) ? (this.logOut()) : (<Redirect to='/products'/>) }
                  // Component = {Products}
                />
              </Switch>
            </div>
        </Router>
      </div>
    );
  }
}

export default App;
