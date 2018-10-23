import apiRequest from '../../apiRequest';
import apiUrl from '../../apiUrl';

const getUserRole = (id) => {
    let roles;
    apiRequest(apiUrl+'/roles','GET', '')
        .then((result) => {
            result.json()
            .then((json) => {
                roles = json.roles;
                roles.forEach((role) => {
                    if (role.id === id) {
                        return role.name;
                    }
                });
                return 'as';
            })
            .catch((err) => {
                console.log(err);
            })
        })
}
export default getUserRole;