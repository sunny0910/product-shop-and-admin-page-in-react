import React, {Component} from 'react';
import ApiUrl from '../../apiUrl';
import ApiRequest from '../../ApiRequest';
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
        ApiRequest(ApiUrl+'/users','GET', '', this.props.token)
        .then((result) => {
            if (result.status === 500) {
                this.props.serverError(true);
                return;
            }
            if (result.status === 401) {
                this.props.serverError(true);
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

    updateUserList(id) {
        let users = this.state.users.splice(0);
        users = users.filter((user) => { return user._id !== id});
        this.setState({users: users});
    }

    render() {
        const users = this.state.users;
        const columns = ["FirstName", "SecondName", "Email", "", "", ""];
        document.title = "Users";
        return (
            <div id='users-table'>
                <DataTable token={this.props.token} data={users} columns={columns} updateUserList={this.updateUserList} />
            </div>
        );
    }
}

export default Users;