import React, {Component} from 'react';
import ApiUrl from '../../apiUrl';
import ApiRequest from '../../ApiRequest';

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
            result.json()
            .then((json) => {
                this.setState({
                    users: json.allUsers,
                    count: json.count
                });
            })
        })
    }

    render() {
        const users = this.state.users;
        const allUsers = users.map((user) => 
            <div className = 'users-listing-single-user' key={user._id}>
                <div className='user-email'>
                    <p>{user.email}</p>
                </div>
                <div className='link' >
                    <a href = {user.request.url} >Link</a>
                </div>
            </div>
        );

        return (
            <div className='users'>
            {allUsers}
            </div>
        );
    }
}

export default Users;