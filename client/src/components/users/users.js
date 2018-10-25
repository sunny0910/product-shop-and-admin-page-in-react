import React, {Component} from 'react';
import apiUrl from '../../apiUrl';
import apiRequest from '../../apiRequest';
import DataTable from '../data-tables/table';

class Users extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            users : [],
            count: 0
        };
        this.updateUserList = this.updateUserList.bind(this);
    }

    componentDidMount() {
        apiRequest(apiUrl+'/users','GET', '', this.props.token)
        .then((result) => {
            if (result.status === 500) {
                this.props.serverError(true);
                return;
            }
            if (result.status === 401) {
                this.props.unAuthorised(result);
                return;
            }
            result.json()
            .then((json) => {
                this.setState({
                    users: json.allUsers,
                    count: json.count
                });
            })
            .catch((err) => {
                console.log(err);
                this.props.serverError(true);
            })
        })
    }

    updateUserList(userId) {
        let users = this.state.users.slice(0);
        if (typeof(userId) === "object") {
            users = users.filter((user) => { return !userId.includes(user.id)});
        } else {
            users = users.filter((user) => { return user.id !== userId});
        }
        this.setState({users: users});
    }

    render() {
        const users = this.state.users;
        const columns = ["FirstName", "SecondName", "Email", "Role", "", "", ""];
        document.title = "Users";
        return (
            <div id='users-table'>
                <DataTable token={this.props.token} userId={this.props.userId} users={users} getUserRole = {this.props.getUserRole} columns={columns} updateUserList={this.updateUserList} />
            </div>
        );
    }
}

export default Users;