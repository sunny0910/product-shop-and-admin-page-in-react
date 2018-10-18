import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import { TableHead, TableBody, TableCell, TableRow, Paper, IconButton, Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Eye from '@material-ui/icons/RemoveRedEye';
import CheckBox from '@material-ui/icons/CheckBox';
import {Link} from 'react-router-dom';
import TableToolBar from './tableToolBar';

class DataTable extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            selectedCount: 0,
            mainCheckBoxSelected: false,
            mainCheckBoxColor: 'inherit'
        }
        this.checkboxOnChange = this.checkboxOnChange.bind(this);
        this.mainCheckboxOnChange = this.mainCheckboxOnChange.bind(this);
    }

    mainCheckboxOnChange(e) {
        
        this.setState((state, props) => ({
            selected: (state.mainCheckBoxSelected)? [] : props.data.map(row => row._id),
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

    render() {
        
        return (
            <Paper className="data-table">
            <TableToolBar selectedCount={this.state.selectedCount}/>
                <Table padding='checkbox'>
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
                            const isSelected = this.isSelected(row._id);
                            return (
                                <TableRow key={index} hover selected={isSelected} >
                                    <TableCell>
                                        <CheckBox selected={isSelected} onClick={event => this.checkboxOnChange(event,row._id) } color={(isSelected) ? "secondary": "inherit"} />
                                    </TableCell>
                                    <TableCell>{row.firstName}</TableCell>
                                    <TableCell>{row.secondName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
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
                                        <Link to={row.url.view} className="actions">
                                            <Tooltip title="View" >
                                                <IconButton aria-label="View">
                                                    <Eye/>
                                                </IconButton>
                                            </Tooltip>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={row.url.delete} className="actions">
                                            <Tooltip title="Delete" >
                                                <IconButton aria-label="Delete">
                                                    <Delete/>
                                                </IconButton>
                                            </Tooltip>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default DataTable;