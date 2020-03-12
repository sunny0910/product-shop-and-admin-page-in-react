import React, {Component} from 'react';
import {Toolbar, Typography, Tooltip, IconButton} from '@material-ui/core'
import {Delete, Add} from '@material-ui/icons/';
import {Link} from 'react-router-dom';

class TableToolBar extends Component
{
    render() {
        let style = (this.props.selectedCount === 0) ? {} : { backgroundColor: "rgb(251, 224, 234)", color: "rgb(225, 0, 80)"};
        return (
            <Toolbar style={style}>
                <div className='table-title-left'>
                    {   this.props.selectedCount > 0 ?
                        (<Typography color='inherit' variant='subtitle1'>
                            {this.props.selectedCount} Selected    
                        </Typography>):
                        <Typography color= 'inherit' variant='subtitle1'>
                            All Users
                        </Typography>
                    }
                </div>
                <div className='table-title-right'>
                    {this.props.selectedCount > 0 ? 
                        (<Tooltip title="Delete">
                            <IconButton aria-label="Delete" onClick={this.props.deleteMultipleRows}>
                                <Delete style={style} onClose={this.hideDeleteNotification}/>
                            </IconButton>
                        </Tooltip>):
                        <Tooltip title="Add">
                            <Link to='/users/add'>
                                <IconButton aria-label="Add">
                                    <Add />
                                </IconButton>
                            </Link>
                        </Tooltip>
                    }
                </div>
            </Toolbar>
        );
    }
}

export default TableToolBar