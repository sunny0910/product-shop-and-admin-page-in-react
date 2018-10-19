import React, {Component} from 'react';
import UserForm from './userForm';

class EditUser extends Component
{
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        document.title = "Edit User";
        return <UserForm
                    id= {this.props.match.params.id}
                    serverError = {this.props.serverError}
                    editPage = {true}
                />
    }
}

export default EditUser