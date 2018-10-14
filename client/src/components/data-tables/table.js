import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import { TableHead, TableBody, TableCell, TableRow, Paper } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Eye from '@material-ui/icons/RemoveRedEye';
import CheckBox from '@material-ui/icons/CheckBox';
import {Link} from 'react-router-dom';

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

    checkboxOnChange(e) {
        console.log(e.target.key);
    }

    mainCheckboxOnChange(e) {
        this.setState((state) => ({
            mainCheckBoxSelected: !state.mainCheckBoxSelected,
            mainCheckBoxColor: (state.mainCheckBoxSelected) ? "inherit": "secondary"
        }));
    }

    handleClick(e, id) {
        let checked = false;
        let newSelected = this.state.selected.slice(0);
        if (this.state.selected.indexOf(id) === -1) {
            newSelected.push(id);
            checked = true
        } else {
            newSelected.pop(id);
        }
        console.log(this.state);
        this.setState(prevState => ({
            selected: newSelected,
            selectedCount: ((checked)?prevState.selectedCount+1:prevState.selectedCount-1)
        }));
        console.log(this.state);
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
                <Table padding='checkbox'>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <CheckBox checked = {this.state.mainCheckBoxSelected} color={this.state.mainCheckBoxColor} value="main" onClick={this.mainCheckboxOnChange}/>
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
                                        <CheckBox selected={isSelected} onClick={event => this.handleClick(event,row._id) } color={(isSelected) ? "secondary": "inherit"} />
                                    </TableCell>
                                    <TableCell>{row.firstName}</TableCell>
                                    <TableCell>{row.secondName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>
                                        <Link to={row.request.edit}><Edit/></Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={row.request.view}><Eye/></Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={row.request.view}><Delete/></Link>
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