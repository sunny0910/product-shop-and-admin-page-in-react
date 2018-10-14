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
    }

    componentDidMount() {
        ApiRequest(ApiUrl+'/users','GET')
        .then((result) => {
            if (result.status === 500) {
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

    render() {
        const users = this.state.users;
        const columns = ["FirstName", "SecondName", "Email", "", "", ""];

        return (
            <div id='users-table'>
                <DataTable data={users} columns={columns} />
            </div>
        );
    }
}

export default Users;