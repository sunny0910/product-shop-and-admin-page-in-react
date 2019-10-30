import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./App.css";
import Login from "./components/admin/Login";
import Register from "./components/admin/Register";
import Products from "./components/products/products";
import AddProduct from "./components/products/addProduct";
import EditProduct from "./components/products/editProduct";
import Users from "./components/users/users";
import EditUser from "./components/users/editUser";
import AddUser from "./components/users/addUser";
import ViewUser from "./components/users/viewUser";
import Header from "./../src/components/header/header";
import Snackbar from "@material-ui/core/Snackbar";
import getDataFromCookie from "./components/getDataFromCookie";
import apiUrl from "./apiUrl";
import apiRequest from "./apiRequest";
import checkIsAdmin from "./components/admin/checkIsAdmin";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: getDataFromCookie("userId") === "" ? false : true,
      userId: getDataFromCookie("userId"),
      userRoleId: getDataFromCookie("userRoleId"),
      jwtToken: getDataFromCookie("token"),
      serverError: false,
      unAuthorised: false,
      productsInCartCount: getDataFromCookie("productsInCartCount"),
      productsInCart: getDataFromCookie("productsInCart"),
      roles: []
    };
  }

  storeCartDataInCookie = () => {
    document.cookie =
      "productsInCart=" + this.state.productsInCart.join(", ") + "; path=/";
    document.cookie =
      "productsInCartCount=" + this.state.productsInCartCount + "; path=/";
  }

  addToCart = (productId) => {
    this.setState(
      prevState => ({
        poductsInCart: prevState.productsInCart.push(productId),
        productsInCartCount: prevState.productsInCartCount + 1
      }),
      this.storeCartDataInCookie
    );
  }

  removeFromCart = (productId) => {
    this.setState(
      prevState => ({
        productsInCart: prevState.productsInCart.filter(id => {
          return id !== productId;
        }),
        productsInCartCount: prevState.productsInCartCount - 1
      }),
      this.storeCartDataInCookie
    );
  }

  componentDidMount = () => {
    apiRequest(apiUrl + "/roles", "GET", "").then(result => {
      if (result.status === 500) {
        this.serverError(true);
        return;
      }
      if (result.status === 401) {
        this.props.unAuthorised(result);
        return;
      }
      result
        .json()
        .then(json => {
          this.setState({
            roles: json.roles
          });
        })
        .catch(err => {
          console.log(err);
          this.serverError(true);
        });
    });
  }

  userLogIn = (loggedIn, token, id, userRoleId) => {
    this.setState({
      userId: id,
      userRoleId: userRoleId,
      loggedIn: loggedIn,
      jwtToken: token
    });
    document.cookie = "token=" + token + "; path=/";
    document.cookie = "userId=" + id + "; path=/";
    document.cookie = "userRoleId=" + userRoleId + "; path=/";
    return true;
  }

  serverError = (value) => {
    this.setState({
      serverError: value
    });
  }

  hideErrorMessage = () => {
    this.setState({
      unAuthorised: false,
      serverError: false
    });
  }

  hideUnathorizedMessage = () => {
    this.setState({ unAuthorised: false });
  }

  unAuthorised = (response) => {
    let loggedIn = this.state.loggedIn;
    response
      .json()
      .then(body => {
        if (body.error.name === "TokenExpiredError") {
          loggedIn = false;
        }
        this.setState({
          unAuthorised: true,
          loggedIn: loggedIn,
          userId: 0,
          userRoleId: 0,
          jwtToken: ""
        });
        document.cookie = "token =; expires = 01-10-1995; path=/;";
        document.cookie = "userId =; expires = 01-10-1995; path=/;";
        document.cookie = "userRoleId =; expires = 01-10-1995; path=/;";
      })
      .catch(err => console.log(err));
  }

  logOut = () => {
    this.setState({
      loggedIn: false,
      userId: 0,
      userRoleId: 0,
      jwtToken: "",
      productsInCart: [],
      productsInCartCount: 0
    });
    document.cookie = "token =; expires = 01-10-1995; path=/;";
    document.cookie = "userId =; expires = 01-10-1995; path=/;";
    document.cookie = "userRoleId =; expires = 01-10-1995; path=/;";
    document.cookie = "productsInCart =; expires = 01-10-1995; path=/;";
    document.cookie = "productsInCartCount =; expires = 01-10-1995; path=/;";
  }

  getUserRole = (id) => {
    if (this.state.roles.length === 0) {
      return;
    }
    let role = this.state.roles.find(role => {
      return role.id === id;
    });
    return role.name;
  }

  render() {
    const loggedIn = this.state.loggedIn;
    const serverErrorMessage = "Unable to connect, Please try again later!";
    const unAuthorisedErrorMessage = this.state.loggedIn
      ? "You Don't have access to the page!"
      : "Your Session Expired!";
    const anchorOrigin = { horizontal: "center", vertical: "top" };

    return (
      <div className="App">
        {this.state.serverError || this.state.unAuthorised ? (
          <Snackbar
            anchorOrigin={anchorOrigin}
            open
            autoHideDuration={2000}
            onClose={this.hideErrorMessage}
            message={
              this.state.serverError
                ? serverErrorMessage
                : unAuthorisedErrorMessage
            }
          />
        ) : (
          ""
        )}
        <Router>
          <div className="content">
            <Header
              loggedIn={this.state.loggedIn}
              admin={checkIsAdmin(this.state.userRoleId)}
              logOut={this.logOut}
              productsInCartCount={this.state.productsInCartCount}
            />
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Products
                    token={this.state.jwtToken}
                    addToCart={this.addToCart}
                    admin={checkIsAdmin(this.state.userRoleId)}
                    removeFromCart={this.removeFromCart}
                    handleCartCounter={this.handleCartCounter}
                    productsInCart={this.state.productsInCart}
                    serverError={this.serverError}
                    hideUnathorizedMessage={this.hideUnathorizedMessage}
                  />
                )}
              />
              <Route
                exact
                path="/products"
                render={props => (
                  <Products
                    token={this.state.jwtToken}
                    addToCart={this.addToCart}
                    admin={checkIsAdmin(this.state.userRoleId)}
                    removeFromCart={this.removeFromCart}
                    handleCartCounter={this.handleCartCounter}
                    productsInCart={this.state.productsInCart}
                    serverError={this.serverError}
                    unAuthorised={this.unAuthorised}
                    {...props}
                    hideUnathorizedMessage={this.hideUnathorizedMessage}
                  />
                )}
              />
              <Route
                exact
                path="/products/add"
                render={(props) =>
                  checkIsAdmin(this.state.userRoleId) ? (
                    <AddProduct
                      admin={checkIsAdmin(this.state.userRoleId)}
                      serverError={this.serverError}
                      unAuthorised={this.unAuthorised}
                      token={this.state.jwtToken}
                      {...props}
                      hideUnathorizedMessage={this.hideUnathorizedMessage}
                    />
                  ) : this.state.loggedIn ? (
                    <Redirect to="/products&unathorize='true'" />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                exact
                path="/products/:id/edit"
                render={(props) =>
                  checkIsAdmin(this.state.userRoleId) ? (
                    <EditProduct
                      admin={checkIsAdmin(this.state.userRoleId)}
                      serverError={this.serverError}
                      unAuthorised={this.unAuthorised}
                      token={this.state.jwtToken}
                      {...props}
                      hideUnathorizedMessage={this.hideUnathorizedMessage}
                    />
                  ) : this.state.loggedIn ? (
                    <Redirect to="/products&unathorize='true'" />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                exact
                path="/users/:id/edit"
                render={props =>
                  checkIsAdmin(this.state.userRoleId) ? (
                    <EditUser
                      getUserRole={this.getUserRole}
                      roles={this.state.roles}
                      {...props}
                      token={this.state.jwtToken}
                      serverError={this.serverError}
                      unAuthorised={this.unAuthorised}
                      hideUnathorizedMessage={this.hideUnathorizedMessage}
                    />
                  ) : this.state.loggedIn ? (
                    <Redirect to="/products&unathorize='true'" />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                exact
                path="/users"
                render={() =>
                  checkIsAdmin(this.state.userRoleId) ? (
                    <Users
                      userId={this.state.userId}
                      getUserRole={this.getUserRole}
                      serverError={this.serverError}
                      token={this.state.jwtToken}
                      unAuthorised={this.unAuthorised}
                      hideUnathorizedMessage={this.hideUnathorizedMessage}
                    />
                  ) : this.state.loggedIn ? (
                    <Redirect to="/products&unathorize='true'" />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                exact
                path="/users/add"
                render={(props) =>
                  checkIsAdmin(this.state.userRoleId) ? (
                    <AddUser
                      getUserRole={this.getUserRole}
                      roles={this.state.roles}
                      {...props}
                      serverError={this.serverError}
                      token={this.state.jwtToken}
                      unAuthorised={this.unAuthorised}
                      hideUnathorizedMessage={this.hideUnathorizedMessage}
                    />
                  ) : this.state.loggedIn ? (
                    <Redirect to="/products&unathorize='true'" />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                exact
                path="/users/:id"
                render={props =>
                  checkIsAdmin(this.state.userRoleId) ? (
                    <ViewUser
                      getUserRole={this.getUserRole}
                      serverError={this.serverError}
                      {...props}
                      token={this.state.jwtToken}
                      unAuthorised={this.unAuthorised}
                      hideUnathorizedMessage={this.hideUnathorizedMessage}
                    />
                  ) : this.state.loggedIn ? (
                    <Redirect to="/products&unathorize='true'" />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                exact
                path="/login"
                render={() =>
                  loggedIn ? (
                    <Redirect to="/products" />
                  ) : (
                    <Login
                      userLogIn={this.userLogIn}
                      serverError={this.serverError}
                    />
                  )
                }
              />
              <Route
                exact
                path="/register"
                render={() =>
                  loggedIn ? (
                    <Redirect to="/products" />
                  ) : (
                    <Register
                      userLogIn={this.userLogIn}
                      serverError={this.serverError}
                      roles={this.state.roles}
                    />
                  )
                }
              />
              <Route
                exact
                path="/logout"
                render={() =>
                  loggedIn ? this.logOut() : <Redirect to="/products" />
                }
              />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
