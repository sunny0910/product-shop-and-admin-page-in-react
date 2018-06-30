import React, {Component} from 'react';

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
        let ret = (
            <div className = 'login'>
                <form onSubmit= {this.loginSubmit}>
                    <label>
                        UserName:
                    </label>
                        <input type='text' name='username' value={this.state.username} onChange={this.handleUsernameChange}/>
                    <label>
                        Password:
                    </label>
                        <input type='password' name='password' value={this.state.password} onChange={this.handlePasswordChange}/>
                    <input type='submit'/>
                </form>
            </div>
        );
        return ret;
    }
}
export default Login;
