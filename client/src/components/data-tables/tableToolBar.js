import React, {Component} from 'react';
import {Toolbar, Typography, Tooltip, IconButton} from '@material-ui/core'
import {Delete, Add} from '@material-ui/icons/';
import {Link} from 'react-router-dom';

class TableToolBar extends Component
{
    render() {
        let style = (this.props.selectedCount === 0) ? {} : { backgroundColor: "#f50057", color: "white"};
        return (
            <Toolbar style={style}>
                <div className='table-title-left'>
                    {   this.props.selectedCount>0?
                        (<Typography color='inherit' variant='subheading'>
                            {this.props.selectedCount} Selected    
                        </Typography>):
                        <Typography color= 'inherit' variant='subheading'>
                            All Users
                        </Typography>
                    }
                </div>
                <div className='table-title-right'>
                    {this.props.selectedCount>0?(
                    <Tooltip title="Delete">
                    <Link to='/users/delte'>
                        <IconButton aria-label="Delete">
                            <Delete style={style}/>
                        </IconButton>
                    </Link>
                    </Tooltip>
                    ):<Tooltip title="Add">
                        <Link to='/users/add'>
                            <IconButton aria-label="Add">
                                <Add />
                            </IconButton>
                        </Link>
                    </Tooltip>}
                </div>
            </Toolbar>
        );
    }
}

export default TableToolBar