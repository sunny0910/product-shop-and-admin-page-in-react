import React, {Component} from 'react';

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
        let ret= (
            <div>
                <form onSubmit = {this.registerSubmit}>
                    <label>
                        Name:
                    </label>
                    <input type='text' value = {this.state.name} onChange = {this.handleNameChange}/>
                    <label>
                        Email:
                        <input type= 'email' value= {this.state.email} onChange = {this.handleEmailChange} />
                    </label>
                    <label>
                        Password:
                        <input type= 'password' value= {this.state.password} onChange = {this.handlePasswordChange} />
                    </label>
                    <input type='submit'/>
                </form>
            </div>
        );
        return ret;
    }
};