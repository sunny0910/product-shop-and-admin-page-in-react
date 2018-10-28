import React, { Component } from "react";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Button,
  Snackbar,
  CircularProgress,
  LinearProgress,
  Select,
  MenuItem
} from "@material-ui/core";
import apiUrl from "../../apiUrl";
import apiRequest from "../../apiRequest";
import { emailRegex, passwordRegex } from "../validationRegex";

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      secondName: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
      firstNameError: false,
      secondNameError: false,
      emailError: false,
      emailExists: false,
      roleError: false,
      paswordError: false,
      confirmPasswordError: false,
      sucessNotification: false,
      spinnerLoading: true,
      linearLoading: false
    };
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleSecondNameChange = this.handleSecondNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(
      this
    );
    this.hideUpdatedMessage = this.hideUpdatedMessage.bind(this);
    this.errorMessageStyle = this.errorMessageStyle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkBothPasswords = this.checkBothPasswords.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
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
    if (!emailRegex.test(e.target.value) && e.target.value !== "") {
      this.setState({
        emailError: true
      });
    } else {
      this.setState({
        emailError: false,
        emailExists: false
      });
    }
    this.setState({
      email: e.target.value
    });
  }

  checkBothPasswords() {
    if (this.state.password !== "" && this.state.confirmPassword !== "") {
      if (this.state.password !== this.state.confirmPassword) {
        this.setState({
          confirmPasswordError: true
        });
      } else {
        this.setState({
          confirmPasswordError: false
        });
      }
      return;
    }
  }

  handlePasswordChange(e) {
    if (!passwordRegex.test(e.target.value) && e.target.value !== "") {
      this.setState({
        passwordError: true
      });
    } else {
      this.setState({
        passwordError: false
      });
    }
    this.setState({ password: e.target.value }, () =>
      this.checkBothPasswords()
    );
  }

  handleConfirmPasswordChange(e) {
    if (!passwordRegex.test(e.target.value) && e.target.value !== "") {
      this.setState({
        confirmPasswordError: true
      });
    } else {
      this.setState({
        confirmPasswordError: false
      });
    }
    this.setState({ confirmPassword: e.target.value }, () =>
      this.checkBothPasswords()
    );
  }

  hideUpdatedMessage() {
    this.setState({
      sucessNotification: false
    });
  }

  errorMessageStyle(field) {
    return field ? { display: "block", color: "red" } : { display: "none" };
  }

  componentDidMount() {
    if (!this.props.editPage) {
      this.setState({ spinnerLoading: false });
      return;
    }
    setTimeout(() => {
      apiRequest(
        apiUrl + "/users/" + this.props.id,
        "GET",
        "",
        this.props.token
      )
        .then(result => {
          if (result.status === 500) {
            this.props.serverError(true);
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
                firstName: json.firstName,
                secondName: json.secondName,
                email: json.email,
                role: json.role,
                spinnerLoading: false
              });
            })
            .catch(err => {
              console.log(err);
              this.props.serverError(true);
            });
        })
        .catch(err => {
          this.props.serverError(true);
        });
    }, 500);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.firstName === "") {
      this.setState({
        firstNameError: true
      });
      return;
    }
    if (this.state.secondName === "") {
      this.setState({
        secondNameError: true
      });
      return;
    }
    if (this.state.role === "") {
      this.setState({
        roleError: true
      });
      return;
    }
    this.checkBothPasswords();
    if (
      this.state.firstNameError ||
      this.state.secondNameError ||
      this.state.passwordError ||
      this.state.confirmPasswordError
    ) {
      return;
    }
    this.setState({ linearLoading: true });
    let data = {
      firstName: this.state.firstName,
      secondName: this.state.secondName,
      role: this.state.role
    };
    let method = "PATCH";
    let urlPath = this.props.id;
    if (!this.props.editPage) {
      data.email = this.state.email;
      method = "POST";
      urlPath = "signup";
    }
    if (
      !(this.state.paswordError || this.state.confirmPasswordError) &&
      this.state.password !== ""
    ) {
      data.password = this.state.password;
    }
    data = JSON.stringify(data);
    apiRequest(
      apiUrl + "/users/" + urlPath,
      method,
      data,
      this.props.token
    ).then(result => {
      if (result.status === 500) {
        this.props.serverError(true);
        return;
      }
      if (result.status === 409) {
        this.setState({
          emailExists: true
        });
        return;
      }
      result
        .json()
        .then(json => {
          setTimeout(() => {
            this.setState({
              sucessNotification: true,
              linearLoading: false
            });
          }, 500);
        })
        .catch(err => {
          console.log(err);
          this.props.serverError(true);
        });
    });
  }

  handleRoleChange(e) {
    let roleError = false;
    if (e.target.value === "") {
      roleError = true;
    }
    this.setState({
      role: e.target.value,
      roleError: roleError
    });
  }

  render() {
    const anchorOrigin = { horizontal: "center", vertical: "bottom" };
    const buttonText = this.props.editPage ? "Update User" : "Add User";
    return (
      <div className="editpaper">
        <Paper>
          <form onSubmit={this.handleSubmit}>
            {this.state.sucessNotification ? (
              <Snackbar
                autoHideDuration={1500}
                anchorOrigin={anchorOrigin}
                open
                onClose={this.hideUpdatedMessage}
                message={this.props.editPage ? "User Updated!" : "User Added!"}
              />
            ) : (
              ""
            )}
            {this.state.linearLoading ? <LinearProgress color="primary" /> : ""}
            <div className="formcontent">
              <div className="formHeading">
                {this.props.editPage ? (
                  <Typography variant="headline">Edit User</Typography>
                ) : (
                  <Typography variant="headline"> Add User</Typography>
                )}
              </div>
              {this.state.spinnerLoading ? (
                <CircularProgress
                  color="primary"
                  variant="indeterminate"
                  className="userForm"
                />
              ) : (
                <React.Fragment>
                  <FormControl
                    className="firstNameField"
                    margin="normal"
                    error={this.state.firstNameError}
                    required
                  >
                    <InputLabel htmlFor="firstName">First Name: </InputLabel>
                    <Input
                      type="text"
                      name="firstName"
                      value={this.state.firstName}
                      onChange={this.handleFirstNameChange}
                      autoComplete="name"
                      required
                    />
                    {this.state.firstNameError ? (
                      <span style={{ display: "block", color: "red" }}>
                        Invalid Value
                      </span>
                    ) : (
                      ""
                    )}
                  </FormControl>
                  <FormControl
                    className="secondNameField"
                    margin="normal"
                    error={this.state.secondNameError}
                    required
                  >
                    <InputLabel htmlFor="secondName">Second Name: </InputLabel>
                    <Input
                      type="text"
                      name="secondName"
                      value={this.state.secondName}
                      onChange={this.handleSecondNameChange}
                      autoComplete="name"
                      required
                    />
                    {this.state.secondNameError ? (
                      <span style={{ display: "block", color: "red" }}>
                        Invalid Value
                      </span>
                    ) : (
                      ""
                    )}
                  </FormControl>
                  <FormControl
                    margin="normal"
                    className="firstNameField"
                    required
                    disabled={this.props.editPage ? true : false}
                    error={this.state.emailError || this.state.emailExists}
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
                    {this.state.emailError ? (
                      <span style={{ display: "block", color: "red" }}>
                        Invalid Value
                      </span>
                    ) : (
                      ""
                    )}
                    {this.state.emailExists ? (
                      <span style={{ display: "block", color: "red" }}>
                        Invalid Value
                      </span>
                    ) : (
                      ""
                    )}
                  </FormControl>
                  <FormControl
                    margin="normal"
                    className="secondNameField"
                    required
                    error={this.state.roleError}
                  >
                    <InputLabel htmlFor="role">Role: </InputLabel>
                    <Select
                      type="text"
                      name="role"
                      value={this.state.role}
                      onChange={this.handleRoleChange}
                      required
                    >
                      {this.props.roles.map(role => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    margin="normal"
                    fullWidth
                    error={this.state.passwordError}
                  >
                    <InputLabel htmlFor="password">Password: </InputLabel>
                    <Input
                      type="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                      autoComplete="password"
                    />
                    {this.state.passwordError ? (
                      <span style={{ display: "block", color: "red" }}>
                        Invalid Value
                      </span>
                    ) : (
                      ""
                    )}
                  </FormControl>
                  <FormControl
                    margin="normal"
                    fullWidth
                    error={this.state.confirmPasswordError}
                  >
                    <InputLabel htmlFor="confirmpassword">
                      Confirm Password:{" "}
                    </InputLabel>
                    <Input
                      type="password"
                      name="confirmpassword"
                      value={this.state.confirmpassword}
                      onChange={this.handleConfirmPasswordChange}
                      autoComplete="password"
                    />
                    {this.state.confirmPasswordError ? (
                      <span style={{ display: "block", color: "red" }}>
                        Invalid Value
                      </span>
                    ) : (
                      ""
                    )}
                  </FormControl>
                  <Button
                    className="formSubmit"
                    type="submit"
                    fullWidth
                    variant="raised"
                    color="primary"
                  >
                    {buttonText}
                  </Button>
                </React.Fragment>
              )}
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

export default UserForm;
