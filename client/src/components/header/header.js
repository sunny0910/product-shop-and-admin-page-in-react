import React, {Component} from 'react';
import { AppBar, Toolbar, Typography} from '@material-ui/core'
import {ShoppingCart} from '@material-ui/icons';

class Header extends Component
{
    constructor(props) {
        super(props)
        
    }

    render() {
        let buttons = (!this.props.loggedIn)?
        (<div><div className="menu-items">
            <Typography color='inherit' variant="subheading"  >Log-In</Typography>
        </div>
        <div className="menu-items">
            <Typography color='inherit' variant="subheading" >Register</Typography>
        </div></div>):
        (<div className="menu-items">
            <Typography color='inherit' variant="subheading" >Logout</Typography>
        </div>);
        return (
            <div id = "header">
                <AppBar color="primary" position="sticky">
                    <Toolbar variant="dense">
                        <Typography color='inherit' variant="headline" id="nav-logo">React Project</Typography>
                        <div className="menu">
                            <div className="menu-items-wrapper">
                                <div className="menu-items">
                                    <Typography color='inherit' variant="subheading"  >Products</Typography>
                                </div>
                                <div className="menu-items">
                                    <Typography color='inherit' variant="subheading"  >Users</Typography>
                                </div>
                                {buttons}
                            </div>
                        </div>
                        <div className="cart-icon">
                            <ShoppingCart/>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default Header;