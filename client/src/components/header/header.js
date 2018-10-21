import React, {Component} from 'react';
import { AppBar, Toolbar, Typography} from '@material-ui/core'
import {ShoppingCart} from '@material-ui/icons';
import Badge from '@material-ui/core/Badge';
import { Link } from 'react-router-dom'

class Header extends Component
{

    render() {
        let buttons = (!this.props.loggedIn)?
        (<div><div className="menu-items">
            <Link to='/login'><Typography color='inherit' variant="subheading"  >Log-In</Typography></Link>
        </div>
        <div className="menu-items">
            <Link to='/register'><Typography color='inherit' variant="subheading" >Register</Typography></Link>
        </div></div>):
        (<div className="menu-items">
            <Link to='/logout' onClick={this.props.logOut}><Typography color='inherit' variant="subheading" >Logout</Typography></Link>
        </div>);
        return (
            <div id = "header">
                <AppBar color="primary" position="sticky">
                    <Toolbar variant="dense">
                        <div className='logo'>
                            <Link to='/'>
                                <Typography color='inherit' variant="headline">React Project</Typography>
                            </Link>
                        </div>
                        <div className="menu">
                            <div className="menu-items-wrapper">
                                <div className="menu-items">
                                    <Link to='/products'>
                                        <Typography color='inherit' variant="subheading"  >Products</Typography>
                                    </Link>
                                </div>
                                { this.props.loggedIn ?
                                <div className="menu-items">
                                    <Link to='/users'>
                                        <Typography color='inherit' variant="subheading"  >Users</Typography>
                                    </Link>
                                </div>
                                :''}
                                {buttons}
                            </div>
                        </div>
                        <div className="cart-icon">
                            {this.props.productsInCart !==0 ?
                            <Badge badgeContent={this.props.productsInCart} color= "primary">
                                <ShoppingCart/>
                            </Badge>:
                            <ShoppingCart/>
                            }
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default Header;