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
import AddUser from './components/users/addUser';
import ViewUser from "./components/users/viewUser";
import Header from './../src/components/header/header';
import Snackbar from '@material-ui/core/Snackbar';
import getToken from './components/getTokenFromCookie';

class App extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: (getToken() === '')?false:true,
      jwtToken: getToken(),
      serverError: false,
      unAuthorised: false,
      productsInCart: 0
    }
    this.userLogIn = this.userLogIn.bind(this);
    this.serverError = this.serverError.bind(this);
    this.hideErrorMessage = this.hideErrorMessage.bind(this);
    this.unAuthorised = this.unAuthorised.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  userLogIn(value, token) {
    this.setState({
      loggedIn: value,
      jwtToken: token
    });
    return true;
  }

  serverError(value) {
    this.setState({
      serverError: value
    });
  }

  hideErrorMessage() {
    this.setState({
      unAuthorised: false,
      serverError: false
    })
  }
  
  unAuthorised(response) {
    let loggedIn = this.state.loggedIn;
    response.json()
    .then((body) => {
      if (body.error.name === "TokenExpiredError") {
          loggedIn = false;
      }
      this.setState({
        unAuthorised: true,
        loggedIn: loggedIn
      });
    })
    .catch((err) => console.log(err) )
  }

  logOut() {
    this.setState({
      loggedIn: false
    });
    document.cookie = "token =; expires = 01-10-1995; path=/;"
  }

  render() {
    const loggedIn = this.state.loggedIn;
    const serverErrorMessage = "Unable to connect, Please try again later!";
    const unAuthorisedErrorMessage = (this.state.loggedIn) ? "You Don't have access to the page!": "Your Session Expired!";
    const anchorOrigin = {horizontal: "center", vertical: "top"};
    return (
      <div className="App">
      {(this.state.serverError || this.state.unAuthorised)?<Snackbar anchorOrigin={anchorOrigin} open autoHideDuration={2000} onClose={this.hideErrorMessage} message={this.props.serverError ? serverErrorMessage : unAuthorisedErrorMessage}/>:''}
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
                  render = {(props) => (loggedIn) ? (<EditUser serverError={this.serverError} {...props} token = {this.state.jwtToken} unAuthorised = {this.unAuthorised} />) : (<Redirect to="/login" />) }
                  // render = {(props) => (<EditUser serverError={this.serverError} {...props} />) }
                />
                <Route
                  exact path="/users"
                  render = {() => (loggedIn) ? (<Users serverError={this.serverError} token = {this.state.jwtToken} unAuthorised = {this.unAuthorised} />) : (<Redirect to="/login" />) }
                  // render = {() => (<Users serverError={this.serverError}/>)}
                />
                <Route
                  exact path="/users/add"
                  render = {() => (loggedIn) ? (<AddUser serverError={this.serverError} token = {this.state.jwtToken} unAuthorised = {this.unAuthorised} />) : (<Redirect to="/login" />) }
                  // render = {() => (<AddUser serverError={this.serverError}/>)}
                />
                <Route
                  exact path="/users/:id"
                  render = {(props) => (loggedIn) ? (<ViewUser serverError={this.serverError} {...props} token = {this.state.jwtToken} unAuthorised = {this.unAuthorised} />) : (<Redirect to="/login" />) }
                  // render = {(props) => (<ViewUser serverError={this.serverError} {...props}/>)}
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
                />
              </Switch>
            </div>
        </Router>
      </div>
    );
  }
}

export default App;
