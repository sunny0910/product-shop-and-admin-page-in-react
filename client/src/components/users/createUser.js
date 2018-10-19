import React, { Component } from "react";
import UserForm from "./userForm";

class CreateUser extends Component
{
    render() {
        document.title = "Create User";
        return (
            <UserForm 
                serverError = {this.props.serverError}
            />
        );
    }
}

export default CreateUser;