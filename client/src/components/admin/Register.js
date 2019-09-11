import React, { Component } from "react";
import {
  Paper,
  InputLabel,
  Button,
  Input,
  FormControl,
  Typography,
  LinearProgress
} from "@material-ui/core";
import apiRequest, {handleErrors} from "../../apiRequest";
import apiUrl from "../../apiUrl";
import { emailRegex, passwordRegex } from "../validationRegex";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      secondName: "",
      email: "",
      password: "",
      firstNameError: false,
      secondNameError: false,
      emailError: false,
      passwordError: false,
      hideProgress: true,
      emailExists: false
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleSecondNameChange = this.handleSecondNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.registerSubmit = this.registerSubmit.bind(this);
  }

  handleFirstNameChange(e) {
    this.setState({
      firstName: e.target.value,
      firstNameError: false
    });
  }
  handleSecondNameChange(e) {
    this.setState({
      secondName: e.target.value,
      secondNameError: false
    });
  }
  handleEmailChange(e) {
    this.setState({
      email: e.target.value,
      emailExists: false,
      emailError: false
    });
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value, passwordError: false });
  }
  registerSubmit(e) {
    e.preventDefault();
    if (this.state.firstName === "") {
      this.setState({
        firstNameError: true
      });
    }
    if (this.state.secondName === "") {
      this.setState({
        secondNameError: true
      });
    }
    if (this.state.email === "") {
      this.setState({
        emailError: true
      });
      return
    }
    if (this.state.password === "") {
      this.setState({
        passwordError: true
      });
      return
    }
    if (!emailRegex.test(this.state.email) && this.state.email !== "") {
      this.setState({
        emailError: true
      });
      return
    }
    if (!passwordRegex.test(this.state.password) && this.state.password !== "") {
      this.setState({
        passwordError: true
      });
      return
    }
    this.setState({
      hideProgress: false
    });
    const data = JSON.stringify({
      firstName: this.state.firstName,
      secondName: this.state.secondName,
      email: this.state.email,
      password: this.state.password,
      role: 2
    });
    apiRequest(apiUrl + "/users/signup", "POST", data).then(handleErrors).then(result => {
      if (result.status === 409) {
        this.setState({
          emailExists: true,
          hideProgress: true
        });
        return;
      }
      if (result.status === 500) {
        this.setState({
          hideProgress: true
        });
        this.props.serverError(true);
        return;
      }
      result
        .json()
        .then(json => {
          this.setState({
            hideProgress: true,
            jwtToken: json.token
          });
          this.props.userLogIn(true, json.token, json.id, json.role);
        })
        .catch(err => {
          console.log(err);
          this.props.serverError(true);
        });
    });
  }

  render() {
    document.title = "Register";
    return (
      <form onSubmit={this.registerSubmit} className="formpaper">
        {this.state.hideProgress ? "" : <LinearProgress />}
        <Paper className="formcontent">
          <div className="formHeading">
            <Typography variant="headline">Register</Typography>
          </div>
          <FormControl
            margin="normal"
            required
            className="firstNameField"
            error={this.state.firstNameError}
          >
            <InputLabel htmlFor="firstName">First Name</InputLabel>
            <Input
              type="text"
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleFirstNameChange}
              autoComplete="name"
              required
            />
          </FormControl>

          <FormControl
            margin="normal"
            required
            className="secondNameField"
            error={this.state.secondNameError}
          >
            <InputLabel htmlFor="secondName">Second Name</InputLabel>
            <Input
              type="text"
              name="secondName"
              value={this.state.secondName}
              onChange={this.handleSecondNameChange}
              autoComplete="name"
              required
            />
          </FormControl>

          <FormControl
            margin="normal"
            required
            fullWidth
            error={this.state.emailError}
          >
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              autoComplete="email"
              required
            />
            {this.state.emailError ? (
              <span style={{ display: "block", color: "red" }}>
                Invalid Email
              </span>
            ) : (
              ""
            )}
            {this.state.emailExists ? (
              <span style={{ display: "block", color: "red" }}>
                Email Already Exists!
              </span>
            ) : (
              ""
            )}
          </FormControl>

          <FormControl
            margin="normal"
            required
            fullWidth
            error={this.state.passwordError}
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              required
            />
            {this.state.passwordError ? (
              <span style={{ display: "block", color: "red" }}>
                Use A Strong Password
              </span>
            ) : (
              ""
            )}
          </FormControl>
          <Button
            className="formSubmit "
            type="submit"
            color="primary"
            variant="raised"
            style={{backgroundColor: '#2196f3'}}
            fullWidth
          >
            Register
          </Button>
        </Paper>
      </form>
    );
  }
}
