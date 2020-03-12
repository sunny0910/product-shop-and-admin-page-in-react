import React, { Component } from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import Badge from "@material-ui/core/Badge";
import { Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <div id="header">
        <AppBar color="primary" position="fixed">
          <Toolbar variant="dense">
            <div className="logo">
              <Link to="/">
                <Typography color="inherit" variant="h5">
                  React Project
                </Typography>
              </Link>
            </div>
            <div className="menu">
              <div className="menu-items-wrapper">
                <div className="menu-items">
                  <Link to="/products">
                    <Typography color="inherit" variant="subtitle1">
                      Shop
                    </Typography>
                  </Link>
                </div>
                {this.props.admin ? (
                  <div className="menu-items">
                    <Link to="/users">
                      <Typography color="inherit" variant="subtitle1">
                        Users
                      </Typography>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {this.props.loggedIn ? (
                  <div className="menu-items">
                    <Link to="/logout" onClick={this.props.logOut}>
                      <Typography color="inherit" variant="subtitle1">
                        Logout
                      </Typography>
                    </Link>
                  </div>
                ) : (
                  <React.Fragment>
                    <div className="menu-items">
                      <Link to="/login">
                        <Typography color="inherit" variant="subtitle1">
                          Login
                        </Typography>
                      </Link>
                    </div>
                    <div className="menu-items">
                      <Link to="/register">
                        <Typography color="inherit" variant="subtitle1">
                          Register
                        </Typography>
                      </Link>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="cart-icon">
              {this.props.productsInCartCount !== 0 ? (
                <Badge
                  badgeContent={this.props.productsInCartCount}
                  color="secondary"
                >
                  <ShoppingCart />
                </Badge>
              ) : (
                <ShoppingCart />
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
