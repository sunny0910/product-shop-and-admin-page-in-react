import React, {Component} from 'react';
import { Paper, InputLabel, Button, Input, FormControl, Typography } from '@material-ui/core';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: ''
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.registerSubmit = this.registerSubmit.bind(this);
    }

    handleEmailChange(e) {
        this.setState(
            {email : e.target.value}
        );
    }
    handleNameChange(e) {
        this.setState(
            {name : e.target.value}
        );
    }
    handlePasswordChange(e) {
        this.setState(
            {password: e.target.value}
        );
    }
    registerSubmit(e) {
        e.preventDefault();
        console.log(this.state);
    }
    render() {
        return (
            <div>
                <form onSubmit = {this.registerSubmit}>
                    <Paper className = "entrypaper">
                    <Typography variant='headline'>Register</Typography>
                        <FormControl margin = 'normal' required fullWidth>
                            <InputLabel htmlFor = 'name'>Name</InputLabel>
                            <Input
                                type='text'
                                name='name'
                                value = {this.state.name}
                                onChange = {this.handleNameChange} />
                        </FormControl>
                            
                        <FormControl margin = 'normal' required fullWidth>
                            <InputLabel htmlFor = 'email'>Email</InputLabel>
                            <Input
                                type='email'
                                name='email'
                                value = {this.state.email}
                                onChange = {this.handleEmailChange} />
                        </FormControl>
                        
                        <FormControl margin = 'normal' required fullWidth>
                            <InputLabel htmlFor = 'password'>Password</InputLabel>
                            <Input
                                type='password'
                                name='password'
                                value = {this.state.password}
                                onChange = {this.handlePasswordChange} />
                        </FormControl>
                        
                        <Button type = 'submit' color='primary' variant='raised' fullWidth>Register</Button>
                    </Paper>
                </form>
            </div>
        );
    }
};