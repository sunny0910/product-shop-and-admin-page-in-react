import {Component} from 'react';
import Table from '@material-ui/core/Table';
import { TableHead, TableBody, TableCell } from '@material-ui/core';

class DataTable extends Component
{
    render() {
        return (
            <Table className="table">
                <TableHead>
                    <TableCell>Name</TableCell>
                </TableHead>
                <TableBody>
                    <TableBody>Body</TableBody>
                </TableBody>
            </Table>
        );
    }
}