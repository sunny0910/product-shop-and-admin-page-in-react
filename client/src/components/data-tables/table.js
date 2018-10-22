import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import { TableHead, TableBody, TableCell, TableRow, Paper, IconButton, Tooltip, CircularProgress, LinearProgress, Snackbar } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Eye from '@material-ui/icons/RemoveRedEye';
import CheckBox from '@material-ui/icons/CheckBox';
import {Link} from 'react-router-dom';
import TableToolBar from './tableToolBar';
import apiRequest from '../../ApiRequest';
import apiUrl from '../../apiUrl';

class DataTable extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            spinnerLoading: true,
            linearLoading: false,
            selected: [],
            selectedCount: 0,
            mainCheckBoxSelected: false,
            mainCheckBoxColor: 'inherit',
            deleteNotification: false
        }
        this.checkboxOnChange = this.checkboxOnChange.bind(this);
        this.mainCheckboxOnChange = this.mainCheckboxOnChange.bind(this);
        this.hideDeleteNotification = this.hideDeleteNotification.bind(this);
        this.deleteMultipleRows = this.deleteMultipleRows.bind(this);
    }

    mainCheckboxOnChange(e) {
        this.setState((state, props) => ({
            selected: (state.mainCheckBoxSelected)? [] : props.data.map(row => row.id),
            selectedCount: (state.mainCheckBoxSelected)? 0: props.data.length,
            mainCheckBoxSelected: !state.mainCheckBoxSelected,
            mainCheckBoxColor: (state.mainCheckBoxSelected) ? "inherit": "secondary"
        }));
    }

    checkboxOnChange(e, id) {
        let mainCheckBoxColor, mainCheckBoxSelected;
        
        let newSelectedArray = this.state.selected.slice(0);
        let checkboxAlreadySelected = this.state.selected.includes(id);

        (checkboxAlreadySelected)?newSelectedArray.pop(id):newSelectedArray.push(id)

        if (newSelectedArray.length === this.props.data.length) {
            mainCheckBoxSelected = true;
            mainCheckBoxColor = "secondary";
        } else {
            mainCheckBoxSelected = false;
            mainCheckBoxColor = "inherit";
        }
        this.setState(prevState => ({
            selected: newSelectedArray,
            selectedCount: ((checkboxAlreadySelected)?prevState.selectedCount-1:prevState.selectedCount+1),
            mainCheckBoxColor: mainCheckBoxColor,
            mainCheckBoxSelected: mainCheckBoxSelected
        }));
    }

    isSelected(id) {
        if (this.state.selected.indexOf(id) === -1) {
            return false;
        }
        return true;
    }

    deleteRow(id) {
        this.setState({linearLoading: true});
        apiRequest(apiUrl+'/users/'+id, 'DELETE', '', this.props.token)
            .then((result) => {
                if (result.status === 500) {
                    this.props.serverError(true);
                    return
                }
                result.json()
                .then((res) => {
                    setTimeout((id) => this.setState({linearLoading: false, deleteNotification: true}, () => this.props.updateUserList(id) ), 500, res.id);
                })
                .catch((err) => {
                    console.log(err);
                    this.props.serverError(true);
                })
            })
            .catch((err) => {
                this.props.serverError(true);
            })
    }

    deleteMultipleRows() {
        this.setState({linearLoading: true});
        let data = JSON.stringify(this.state.selected);
        apiRequest(apiUrl+'/users', 'DELETE', data, this.props.token)
            .then((result) => {
                if (result.status === 500) {
                    this.props.serverError(true);
                    return
                }
                result.json()
                .then((res) => {
                    setTimeout((ids) => this.setState({linearLoading: false, deleteNotification: true}, () => this.props.updateUserList(ids) ), 500, res.ids);
                })
                .catch((err) => {
                    console.log(err);
                    this.props.serverError(true);
                })
            })
            .catch((err) => {
                this.props.serverError(true);
            })
    }

    hideDeleteNotification() {
        this.setState({
            deleteNotification: false
        });
    }

    render() {
        setTimeout(() => {
            this.setState({spinnerLoading: false});
        }, 500);
        const anchorOrigin = {horizontal: "center", vertical: "bottom"};
        const message = (this.state.deleteNotification)?<Snackbar autoHideDuration={1500} anchorOrigin={anchorOrigin} open onClose={this.hideDeleteNotification} message="User Deleted!"/>:'';
        return (
            <React.Fragment>
                <Paper className="data-table">
                {message}
                {(this.state.linearLoading) ? <LinearProgress color="secondary"/>:''}
                <TableToolBar selectedCount={this.state.selectedCount} deleteMultipleRows = {this.deleteMultipleRows} hideDeleteNotification = {this.hideDeleteNotification}/>
                {this.state.spinnerLoading ?
                    <CircularProgress color="primary" variant="indeterminate" className="loader"/> :
                        (<Table padding='checkbox'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <CheckBox checked = {true} color={this.state.mainCheckBoxColor} value="main" onClick={this.mainCheckboxOnChange}/>
                                    </TableCell>
                                    {this.props.columns.map((column, index) => {
                                        return (
                                            <TableCell key= {index} >{column}</TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.data.map((row, index) => {
                                    const isSelected = this.isSelected(row.id);
                                    return (
                                        <TableRow key={index} hover selected={isSelected} >
                                            <TableCell>
                                                <CheckBox selected={isSelected} onClick={event => this.checkboxOnChange(event,row.id) } color={(isSelected) ? "secondary": "inherit"} />
                                            </TableCell>
                                            <TableCell>{row.firstName}</TableCell>
                                            <TableCell>{row.secondName}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>
                                                <Link to={row.url.view} className="actions">
                                                    <Tooltip title="View" >
                                                        <IconButton aria-label="View">
                                                            <Eye/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={row.url.edit} className="actions">
                                                    <Tooltip title="Edit" >
                                                        <IconButton aria-label="Edit">
                                                            <Edit/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Delete" >
                                                    <IconButton aria-label="Delete" onClick= {() => this.deleteRow(row.id)}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                    </Table>)
                }
            </Paper>
            </React.Fragment>
        );
    }
}

export default DataTable;