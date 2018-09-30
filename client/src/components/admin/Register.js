import React, {Component} from 'react';
import { Paper, InputLabel, Button, Input, FormControl, Typography, LinearProgress } from '@material-ui/core';
import apiRequest from '../../ApiRequest';
import apiUrl from '../../apiUrl';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            nameError: false,
            emailError: false,
            passwordError: false,
            hideProgress : true,
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.registerSubmit = this.registerSubmit.bind(this);
    }

    handleNameChange(e) {
        this.setState({
            name : e.target.value,
            nameError: false
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
                emailError: false
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
        if (this.state.name === '') {
            this.setState({
                nameError: true
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
        if (this.state.nameError || this.state.emailError || this.state.passwordError) {
            return;
        }
        this.setState({
            hideProgress: false
        });
        const data = JSON.stringify({
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        });
        apiRequest(apiUrl+'/users/signup', 'POST', data)
        .then(result => {
            result.json()
            .then( (json) => {
                console.log(json);
                this.setState({
                    hideProgress: true
                });
            }
            );
        })
    }
    render() {
        const progressStyle = this.state.hideProgress ? {display: 'none'} : {};
        const nameErrorStyle = this.state.nameError ? {display : 'block',  color : 'red'} :{display: 'none'};
        const emailErrorStyle = this.state.emailError ? {display : 'block',  color : 'red'} :{display: 'none'};
        const passwordErrorStyle = this.state.passwordError ? {display : 'block',  color : 'red'} :{display: 'none'};
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
                                    <FormControl margin = 'normal' required fullWidth>
                                        <InputLabel htmlFor = 'name'>Name</InputLabel>
                                        <Input
                                            type='text'
                                            name='name'
                                            value = {this.state.name}
                                            onChange = {this.handleNameChange}
                                            required/>
                                        <span style={nameErrorStyle}>Invalid Value</span>
                                    </FormControl>

                                    <FormControl margin = 'normal' required fullWidth>
                                        <InputLabel htmlFor = 'email'>Email</InputLabel>
                                        <Input
                                            type='email'
                                            name='email'
                                            value = {this.state.email}
                                            onChange = {this.handleEmailChange}
                                            required/>
                                        <span style={emailErrorStyle}>Invalid Value</span>
                                    </FormControl>

                                    <FormControl margin = 'normal' required fullWidth>
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