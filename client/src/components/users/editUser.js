import React, {Component} from 'react';
import UserForm from './userForm';

class EditUser extends Component
{
    render() {
        document.title = "Edit User";
        return <UserForm
                    id= {this.props.match.params.id}
                    serverError = {this.props.serverError}
                    editPage = {true}
                    token = {this.props.token}
                />
    }
}

export default EditUser