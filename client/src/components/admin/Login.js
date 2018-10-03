import React, {Component} from 'react';
import { Paper, Avatar, FormControl, InputLabel, Input, Button, Typography, LinearProgress } from '@material-ui/core';
import Person from '@material-ui/icons/Person';
import apiUrl from '../../apiUrl';
import apiRequest from '../../ApiRequest';

class Login extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            hideProgress: true,
            emailError: false,
            passwordError: false
        };
        this.loginSubmit = this.loginSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
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
            email : e.target.value
        });
    }

    handlePasswordChange(e) {
        if (this.state.password !== '') {
            this.setState({
                passwordError: false
            });
        }
        this.setState({
            password: e.target.value
        });
    }

    loginSubmit(event) {
        event.preventDefault();
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
        if (this.state.emailError || this.state.passwordError) {
            return;
        }
        this.setState({
            hideProgress: false
        });
        const data = JSON.stringify({
            "email": this.state.email,
            "password": this.state.password
        });
        apiRequest(apiUrl+'/users/login', 'POST', data)
        .then(result => {
            if (result.status === 500) {
                this.props.serverError(true);
                return;
            }
            result.json()
            .then( (json) => {
                this.setState({
                    hideProgress: true
                });
                this.props.loggedIn(true);
            }
            );
        })
    }

    render() {
        const progressStyle = this.state.hideProgress ? {display: 'none'} : {};
        const emailErrorStyle = this.state.emailError ? {display : 'block',  color : 'red'} :{display: 'none'};
        return (
            <div className = 'login'>
                <form onSubmit= {this.loginSubmit}>
                    <div className = 'formpaper'>
                        <div className = 'progress' style = {progressStyle}>
                            <LinearProgress/>
                        </div>
                        <Paper className = "innerpaper" >
                            <div className = "formcontent">
                                <Avatar className='avatarIcon'>
                                    <Person/>
                                </Avatar>
                                <div className = 'formHeading'>
                                    <Typography variant='headline' >Sign In</Typography>
                                </div>
                                <FormControl className="fields" margin = 'normal' required fullWidth>
                                    <InputLabel htmlFor = 'email'>Email: </InputLabel>
                                    <Input
                                        type='text'
                                        name='email'
                                        value={this.state.email}
                                        onChange = {this.handleEmailChange}
                                        autoComplete = 'email'
                                        required
                                    />
                                    <span style={emailErrorStyle}>Invalid Value</span>
                                </FormControl>
                                <FormControl className="fields" margin = 'normal' required fullWidth>
                                    <InputLabel htmlFor = 'password'>Password: </InputLabel>
                                    <Input
                                        type = 'password'
                                        name = 'password'
                                        value = {this.state.password}
                                        onChange = {this.handlePasswordChange}
                                        autoComplete = 'password'
                                        required
                                    />
                                </FormControl>
                                <Button className='formSubmit' type='submit' fullWidth variant='raised' color='primary'>Sign In</Button>
                            </div>
                        </Paper>
                    </div>
                </form>
            </div>
        );
    }
}
export default Login;
