import React, {Component} from 'react';
import {Paper, Typography, CircularProgress, Grid} from '@material-ui/core';
import apiUrl from '../../apiUrl';
import apiRequest from '../../apiRequest';

class ViewUser extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            secondName: '',
            email: '',
            roles: '',
            spinnerLoading: true
        }
    }

    componentDidMount = () => {
        setTimeout(() => {
            apiRequest(apiUrl+'/users/'+this.props.match.params.id, 'GET', '', this.props.token)
            .then((result) => {
                if (result.status === 500) {
                    this.props.serverError(true);
                    return
                }
                result.json()
                .then(json => {
                    if (result.status === 500) {
                        this.props.serverError(true);
                        return;
                    }
                    if (result.status === 401) {
                        this.props.unAuthorised(result);
                        return;
                    }
                    this.setState({
                        firstName: json.firstName,
                        secondName: json.secondName,
                        email: json.email,
                        role: json.role,
                        spinnerLoading: false
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.props.serverError(true);
                })
            })
            .catch((err) => {
                this.props.serverError(true);
            })
        }, 500);
    }

    render() {
        return (
            <React.Fragment>
                <Paper className="formpaper">
                    <Grid container spacing={24}>
                        {(this.state.spinnerLoading) ? 
                            <CircularProgress color="primary" variant="indeterminate" className="loader"/>:
                            <React.Fragment>
                                <Grid item xs={3}>
                                    <Typography align="left" variant="body2" ><b>First Name: </b></Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography>{this.state.firstName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                <Typography align="left" variant="body2" ><b>Second Name: </b></Typography>
                                </Grid>
                                <Grid item xs={9}>
                                <Typography>{this.state.secondName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                <Typography align="left" variant="body2" ><b>Email: </b></Typography>
                                </Grid>
                                <Grid item xs={9}>
                                <Typography>{this.state.email}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                <Typography align="left" variant="body2" ><b>Role: </b></Typography>
                                </Grid>
                                <Grid item xs={9}>
                                <Typography>{this.props.getUserRole(this.state.role)}</Typography>
                                </Grid>
                            </React.Fragment>
                        }
                    </Grid>
                </Paper>
            </React.Fragment>
        );
    }
}

export default ViewUser;