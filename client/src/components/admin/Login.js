import React, { Component } from "react";
import {
  Paper,
  Avatar,
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
  LinearProgress
} from "@material-ui/core";
import Person from "@material-ui/icons/Person";
import apiUrl from "../../apiUrl";
import apiRequest, {handleErrors} from "../../apiRequest";
import { emailRegex } from "../validationRegex";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      hideProgress: true,
      loginError: false
    };
    this.loginSubmit = this.loginSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value,
      loginError: false
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
      loginError: false
    });
  }

  loginSubmit(event) {
    event.preventDefault();
    if (this.state.email === "" || this.state.password === "" || !emailRegex.test(this.state.email)) {
      this.setState({
        loginError: true,
      });
      return;
    }
    this.setState({
      hideProgress: false
    });
    const data = JSON.stringify({
      email: this.state.email,
      password: this.state.password
    });
    apiRequest(apiUrl + "/users/login", "POST", data).then(handleErrors).then(result => {
      if (result.status === 500) {
        this.props.serverError(true);
        return;
      }
      result
        .json()
        .then(json => {
          this.setState({
            hideProgress: true
          });
          this.props.userLogIn(true, json.token, json.id, json.role);
        })
        .catch(err => {
          console.log(err);
          this.props.serverError(true);
        });
    }).catch(err => {
      this.setState({
        loginError: true
      })
    })
  }

  render() {
    document.title = "Login";
    return (
      <form onSubmit={this.loginSubmit} className="formpaper">
        {this.state.hideProgress ? "" : <LinearProgress />}
        <Paper className="formcontent">
          <Avatar className="avatarIcon">
            <Person />
          </Avatar>
          <div className="formHeading">
            <Typography variant="headline">Login</Typography>
          </div>
          <FormControl
            margin="normal"
            required
            fullWidth
            error={this.state.loginError}
          >
            <InputLabel htmlFor="email">Email: </InputLabel>
            <Input
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              autoComplete="email"
              required
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth error={this.state.loginError}>
            <InputLabel htmlFor="password">Password: </InputLabel>
            <Input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              autoComplete="password"
              required
            />
          </FormControl>
          {this.state.loginError ? (
              <span style={{ display: "block", color: "red" }}>
                Invalid Email or Password
              </span>
            ) : (
              ""
            )}
          <Button
            className="formSubmit"
            type="submit"
            fullWidth
            variant="raised"
            color="primary"
            style={{backgroundColor: '#2196f3'}}
          >
            LogIn
          </Button>
        </Paper>
      </form>
    );
  }
}
export default Login;
