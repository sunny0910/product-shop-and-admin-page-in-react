import React, { Component } from "react";
import apiUrl from "../../apiUrl";
import apiRequest from "../../apiRequest";
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Snackbar,
  LinearProgress,
  CircularProgress
} from "@material-ui/core";
import { Link } from "react-router-dom";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      count: 0,
      spinnerLoading: true,
      linearLoading: false,
      deleteNotification: false
    };
    // console.log(this.props.match.params.unathorized);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.hideDeleteNotification = this.hideDeleteNotification.bind(this);
  }

  componentDidMount() {
    apiRequest(apiUrl + "/products", "GET").then(result => {
      if (result.status === 500) {
        this.props.serverError(true);
        return;
      }
      result
        .json()
        .then(json => {
          this.setState({
            products: json.products,
            count: json.count
          });
        })
        .catch(err => {
          console.log(err);
          this.props.serverError(true);
        });
    });
    setTimeout(() => {
      this.setState({ spinnerLoading: false });
    }, 500);
  }

  hideDeleteNotification() {
    this.setState({
      deleteNotification: false
    });
  }

  deleteProduct(id) {
    this.setState({ linearLoading: true });
    apiRequest(apiUrl + "/products/" + id, "DELETE", "", this.props.token)
      .then(result => {
        if (result.status === 500) {
          this.props.serverError(true);
          return;
        }
        result
          .json()
          .then(res => {
            setTimeout(
              id =>
                this.setState(prevState => ({
                  linearLoading: false,
                  deleteNotification: true,
                  products: prevState.products.filter(product => {
                    return product.id !== id;
                  })
                })),
              500,
              id
            );
          })
          .catch(err => {
            console.log(err);
            this.props.serverError(true);
          });
      })
      .catch(err => {
        this.props.serverError(true);
      });
  }

  render() {
    document.title = "Products";
    const anchorOrigin = { horizontal: "center", vertical: "bottom" };
    return (
      <div className="products-grid">
        {this.state.deleteNotification ? (
          <Snackbar
            autoHideDuration={1500}
            anchorOrigin={anchorOrigin}
            open
            onClose={this.hideDeleteNotification}
            message="Product Deleted!"
          />
        ) : (
          ""
        )}
        {/* {(this.props.match.params.unathorized) ? <Snackbar autoHideDuration={1500} anchorOrigin={anchorOrigin} open onClose={this.props.hideUnathorizedMessage} message="You are Not Authorized to view this page!" />:''} */}
        {this.state.spinnerLoading ? (
          <CircularProgress
            color="primary"
            variant="indeterminate"
            className="loader"
          />
        ) : (
          <React.Fragment>
            {this.state.linearLoading ? (
              <LinearProgress color="secondary" />
            ) : (
              ""
            )}
            <br />
            {this.props.admin ? (
              <Link to="/products/add" style={{ float: "right" }}>
                {" "}
                <Button
                  variant="outlined"
                  type="button"
                  color="primary"
                  size="medium"
                  onClick={this.state.props}
                >
                  Add
                </Button>{" "}
              </Link>
            ) : (
              ""
            )}
            <Grid
              container
              spacing={40}
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              {this.state.products.map(product => (
                <Grid item xs={4} key={product.id}>
                  <Card className="product-card">
                    <CardContent>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography component="p">
                            <b>Name:</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="p">{product.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="p">
                            <b>Description:</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="p">
                            {product.description}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="p">
                            <b>Price:</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="p">{product.price}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Grid
                        container
                        spacing={8}
                        direction="row"
                        justify="space-around"
                        // justify={
                        //   this.props.admin ? "space-around" : "flex-start"
                        // }
                      >
                        <Grid item xs={this.props.admin ? 6 : 12}>
                          {this.props.productsInCart.includes(product.id) ? (
                            <Button
                              color="primary"
                              size="small"
                              variant="contained"
                              onClick={() =>
                                this.props.removeFromCart(product.id)
                              }
                              fullWidth
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              size="small"
                              variant="contained"
                              onClick={() => this.props.addToCart(product.id)}
                              fullWidth
                            >
                              Add To Cart
                            </Button>
                          )}
                        </Grid>
                        {this.props.admin ? (
                          <React.Fragment>
                            <Grid item xs={3}>
                              <Link to={product.url.edit}>
                                <Button
                                  color="primary"
                                  size="small"
                                  variant="contained"
                                  fullWidth
                                >
                                  Edit
                                </Button>
                              </Link>
                            </Grid>
                            <Grid item xs={3}>
                              <Button
                                color="primary"
                                size="small"
                                fullWidth
                                variant="contained"
                                onClick={() => this.deleteProduct(product.id)}
                              >
                                Delete
                              </Button>
                            </Grid>
                          </React.Fragment>
                        ) : (
                          ""
                        )}
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </React.Fragment>
        )}
      </div>
    );
  }
}
export default Products;
