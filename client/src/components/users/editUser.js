import React, {Component} from 'react';
import {Paper, Typography, FormControl, InputLabel, Input, Button, Snackbar} from '@material-ui/core'
import apiUrl from '../../apiUrl';
import apiRequest from '../../ApiRequest';

class EditUser extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            firstName: '',
            secondName: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstNameError: false,
            secondNameError: false,
            paswordError: false,
            confirmPasswordError: false,
            userUpdated: false
        }
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleSecondNameChange = this.handleSecondNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideUpdatedMessage = this.hideUpdatedMessage.bind(this);
    }

    componentDidMount() {
        apiRequest(apiUrl+'/users/'+this.state.id, 'GET')
        .then((result) => {
            if (result.status === 500) {
                this.props.serverError(true);
                return
            }
            result.json()
            .then(json => {
                this.setState({
                    firstName: json.firstName,
                    secondName: json.secondName,
                    email: json.email
                });
            })
            .catch((err) => {
                console.log(err);
                this.props.serverError(true);
            })
        })
        .catch((err) => {
            this.props.serverError(true);
        })
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

    handleConfirmPasswordChange(e) {
        const passwordRegex = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
        if ((!passwordRegex.test(e.target.value)) && e.target.value !== '') {
            this.setState({
                confirmPasswordError: true
            });
        } else {
            this.setState({
                confirmPasswordError: false
            });
        }
        this.setState(
            {confirmPassword: e.target.value}
        );
    }

    handleSubmit(e) {
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
        if (this.state.password !== '' || this.state.confirmPassword !== '') {
            if (this.state.password !== this.state.confirmPassword) {
                this.setState({
                    confirmpasswordError: true 
                });
            }
        }
        if (this.state.firstNameError || this.state.secondNameError || this.state.passwordError || this.state.confirmPasswordError) {
            return;
        }
        this.setState({
            hideProgress: false
        });
        let data = {
            firstName: this.state.firstName,
            secondName: this.state.secondName,
            email: this.state.email,
        };
        if (!(this.state.paswordError || this.state.confirmPasswordError)) {
            data.password = this.state.paswordError;
        }
        data = JSON.stringify(data);
        apiRequest(apiUrl+'/users/'+this.state.id, 'PATCH', data)
        .then(result => {
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
                    userUpdated: true
                })
            })
            .catch((err) => {
                console.log(err);
                this.props.serverError(true);
            })
        })
    }

    hideUpdatedMessage() {
        this.setState({
            userUpdated: false
        });
    }

    render() {
        const firstErrorStyle = this.state.firstError ? {display : 'block',  color : 'red'} :{display: 'none'};
        const secondErrorStyle = this.state.secondError ? {display : 'block',  color : 'red'} :{display: 'none'};
        const passwordErrorStyle = this.state.passwordError ? {display : 'block',  color : 'red'} :{display: 'none'};
        const confirmPasswordErrorStyle = this.state.confirmPasswordError ? {display : 'block',  color : 'red'} :{display: 'none'};
        const anchorOrigin = {horizontal: "center", vertical: "Bottom"};
        const message = (this.state.userUpdated)?<Snackbar anchorOrigin={anchorOrigin} open onClose={this.hideUpdatedMessage} autoHideDuration='15000' message='User Updated!'/>:'';
        return (
            <div className = 'editpaper'>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <Paper>
                        {message}
                            <div className='formcontent'>
                                <div className = 'formHeading'>
                                    <Typography variant='headline' >Edit User</Typography>
                                </div>
                                <FormControl className="firstNameField" margin = 'normal' error={this.state.firstNameError} required >
                                    <InputLabel htmlFor = 'firstName'>First Name: </InputLabel>
                                    <Input
                                        type='text'
                                        name='firstName'
                                        value={this.state.firstName}
                                        onChange = {this.handleFirstNameChange}
                                        autoComplete = 'name'
                                        required
                                    />
                                    <span style={firstErrorStyle}>Invalid Value</span>
                                </FormControl>
                                <FormControl className="secondNameField" margin = 'normal' error={this.state.secondNameError} required >
                                    <InputLabel htmlFor = 'secondName'>Second Name: </InputLabel>
                                    <Input
                                        type='text'
                                        name='secondName'
                                        value={this.state.secondName}
                                        onChange = {this.handleSecondNameChange}
                                        autoComplete = 'name'
                                        required
                                    />
                                    <span style={secondErrorStyle}>Invalid Value</span>
                                </FormControl>
                                <FormControl margin = 'normal' required fullWidth disabled>
                                    <InputLabel htmlFor = 'email'>Email: </InputLabel>
                                    <Input
                                        type='text'
                                        name='email'
                                        value={this.state.email}
                                        autoComplete = 'email'
                                        required
                                    />
                                </FormControl>
                                <FormControl margin = 'normal' fullWidth error={this.state.passwordError}>
                                    <InputLabel htmlFor = 'password'>Password: </InputLabel>
                                    <Input
                                        type = 'password'
                                        name = 'password'
                                        value = {this.state.password}
                                        onChange = {this.handlePasswordChange}
                                        autoComplete = 'password'
                                    />
                                    <span style={passwordErrorStyle}>Invalid Value</span>
                                </FormControl>
                                <FormControl margin = 'normal' fullWidth error={this.state.confirmPasswordError}>
                                    <InputLabel htmlFor = 'confirmpassword'>Confirm Password: </InputLabel>
                                    <Input
                                        type = 'password'
                                        name = 'confirmpassword'
                                        value = {this.state.confirmpassword}
                                        onChange = {this.handleConfirmPasswordChange}
                                        autoComplete = 'password'
                                    />
                                    <span style={confirmPasswordErrorStyle}>Invalid Value</span>
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

export default EditUser