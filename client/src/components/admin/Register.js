import React, {Component} from 'react';
import { Paper, InputLabel, Button, Input, FormControl, Typography, LinearProgress } from '@material-ui/core';
import apiRequest from '../../ApiRequest';
import apiUrl from '../../apiUrl';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            secondName: '',
            email: '',
            password: '',
            firstNameError: false,
            secondNameError: false,
            emailError: false,
            passwordError: false,
            hideProgress : true,
            emailExists : false,
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleSecondNameChange = this.handleSecondNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.registerSubmit = this.registerSubmit.bind(this);
    }

    handleFirstNameChange(e) {
        this.setState({
            firstName : e.target.value,
            firstNameError: false
        });
    }
    handleSecondNameChange(e) {
        this.setState({
            secondName : e.target.value,
            secondNameError: false
        });
    }
    handleEmailChange(e) {
        const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
        if ((!emailRegex.test(e.target.value)) && e.target.value !== '') {
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
            email : e.target.value,
        });
    }
    handlePasswordChange(e) {
        const passwordRegex = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
        if ((!passwordRegex.test(e.target.value)) && e.target.value !== '') {
            this.setState({
                passwordError: true
            });
        } else {
            this.setState({
                passwordError: false
            });
        }
        this.setState(
            {password: e.target.value}
        );
    }
    registerSubmit(e) {
        e.preventDefault();
        if (this.state.firstName === '') {
            this.setState({
                firstNameError: true
            });
        }
        if (this.state.secondName === '') {
            this.setState({
                secondNameError: true
            });
        }
        if (this.state.email === '') {
            this.setState({
                emailError: true
            });
        }
        if (this.state.password === '') {
            this.setState({
                passwordError: true
            });
        }
        if (this.state.firstNameError || this.state.secondNameError || this.state.emailError || this.state.passwordError || this.state.emailExists) {
            return;
        }
        this.setState({
            hideProgress: false
        });
        const data = JSON.stringify({
            firstName: this.state.firstName,
            secondName: this.state.secondName,
            email: this.state.email,
            password: this.state.password
        });
        apiRequest(apiUrl+'/users/signup', 'POST', data)
        .then(result => {
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
            result.json()
            .then( (json) => {
                this.setState({
                    hideProgress: true
                });
                this.props.userLogIn(true);
            })
            .catch((err) => {
                console.log(err);
                this.props.serverError(true);
            })
        })
    }
    render() {
        const progressStyle = this.state.hideProgress ? {display: 'none'} : {};
        const nameErrorStyle = this.state.nameError ? {display : 'block',  color : 'red'} :{display: 'none'};
        const emailErrorStyle = this.state.emailError ? {display : 'block',  color : 'red'} :{display: 'none'};
        const passwordErrorStyle = this.state.passwordError ? {display : 'block',  color : 'red'} :{display: 'none'};
        const emailExistsStyle = this.state.emailExists ? {display: 'block', color: 'red'} : {display: 'none'};
        document.title = "Register";
        return (
            <div>
                <form onSubmit = {this.registerSubmit}>
                    <div className = 'formpaper'>
                        <div className = 'progress' style = {progressStyle}>
                            <LinearProgress/>
                        </div>
                        <Paper className = "innerpaper">
                            <div className = "formcontent">
                                <div className = 'formHeading'>
                                    <Typography variant='headline' >Register</Typography>
                                </div>
                                    <FormControl margin = 'normal' required className="firstNameField" error = {this.state.secondNameError}>
                                        <InputLabel htmlFor = 'firstName'>First Name</InputLabel>
                                        <Input
                                            type='text'
                                            name='firstName'
                                            value = {this.state.firstName}
                                            onChange = {this.handleFirstNameChange}
                                            required/>
                                        <span style={nameErrorStyle}>Invalid Value</span>
                                    </FormControl>

                                    <FormControl margin = 'normal' required className="secondNameField" error = {this.state.secondNameError}>
                                        <InputLabel htmlFor = 'secondName'>Second Name</InputLabel>
                                        <Input
                                            type='text'
                                            name='secondName'
                                            value = {this.state.secondName}
                                            onChange = {this.handleSecondNameChange}
                                            required/>
                                        <span style={nameErrorStyle}>Invalid Value</span>
                                    </FormControl>

                                    <FormControl margin = 'normal' required fullWidth error = {this.state.emailError}>
                                        <InputLabel htmlFor = 'email'>Email</InputLabel>
                                        <Input
                                            type='email'
                                            name='email'
                                            value = {this.state.email}
                                            onChange = {this.handleEmailChange}
                                            required/>
                                        <span style={emailErrorStyle}>Invalid Value</span>
                                        <span style={emailExistsStyle}>Email Already Exists!</span>
                                    </FormControl>

                                    <FormControl margin = 'normal' required fullWidth error = {this.state.passwordError}>
                                        <InputLabel htmlFor = 'password'>Password</InputLabel>
                                        <Input
                                            type='password'
                                            name='password'
                                            value = {this.state.password}
                                            onChange = {this.handlePasswordChange}
                                            required/>
                                        <span style={passwordErrorStyle}>Invalid Value! Strong Password with Uppercase and Lowercase letters, digits and special characters</span>
                                    </FormControl>
                                    <Button className='formSubmit ' type = 'submit' color='primary' variant='raised' fullWidth>Register</Button>
                                </div>
                        </Paper>
                    </div>
                </form>
            </div>
        );
    }
};