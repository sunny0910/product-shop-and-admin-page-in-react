import React, { Component } from "react";
import UserForm from "./userForm";

class AddUser extends Component
{
    render() {
        document.title = "Add User";
        return (
            <UserForm 
                serverError = {this.props.serverError}
                token = {this.props.token}
            />
        );
    }
}

export default AddUser;