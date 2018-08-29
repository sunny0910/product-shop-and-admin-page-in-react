import React, {Component} from 'react';
import { Paper, Avatar, FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import Person from '@material-ui/icons/Person';

class Login extends Component
{
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};

        this.loginSubmit = this.loginSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleUsernameChange(e) {
        this.setState(
            {username : e.target.value}
        );
    }

    handlePasswordChange(e) {
        this.setState(
            {password: e.target.value}
        );
    }

    loginSubmit(event) {
        event.preventDefault();
        console.log(this.state);
    }

    render() {
        return (
            <div className = 'login'>
                <form onSubmit= {this.loginSubmit}>
                <Paper className = "entrypaper">
                    <Avatar>
                        <Person/>
                    </Avatar>
                    <Typography variant='headline'>Sign In</Typography>
                    <FormControl margin = 'normal' required fullWidth>
                        <InputLabel htmlFor = 'username'>UserName: </InputLabel>
                        <Input 
                            type='text'
                            name='username'
                            value={this.state.username}
                            onChange = {this.handleUsernameChange}
                            autoComplete = 'email'
                        />
                    </FormControl>
                    <FormControl margin = 'normal' required fullWidth>
                        <InputLabel htmlFor = 'password'>Password: </InputLabel>
                        <Input
                            type = 'password'
                            name = 'password'
                            value = {this.state.password}
                            onChange = {this.handleUsernameChange}
                            autoComplete = 'password'
                        />
                    </FormControl>
                    <Button type='submit' fullWidth variant='raised' color='primary'>Sign In</Button>
                </Paper>
                </form>
            </div>
        );
    }
}
export default Login;
