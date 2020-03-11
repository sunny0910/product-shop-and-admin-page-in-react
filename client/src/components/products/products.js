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
  CircularProgress,
  Tooltip
} from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';
import { Link } from "react-router-dom";
import getDataFromCookie from "../getDataFromCookie";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      productsCount: 0,
      productsPerPage: 10,
      page: 1,
      totalPages: getDataFromCookie("totalPages"),
      spinnerLoading: true,
      linearLoading: false,
      deleteNotification: false
    };
  }

  pageChange = (e, value) => {
    this.setState({page: value}, () => {
      this.updateProducts(this.state.page)
    })
  }

  updateProducts = (page) => {
    apiRequest(apiUrl + `/products?page=${this.state.page}`, "GET").then(result => {
      if (result.status === 500) {
        this.props.serverError(true);
        return;
      }
      result
        .json()
        .then(json => {
          let totalPages = Math.ceil(json.totalCount/json.productsPerPage)
          this.setState({
            products: json.products,
            productsCount: json.totalCount,
            productsPerPage: json.productsPerPage,
            spinnerLoading: false,
          });
          if (this.state.totalPages !== totalPages) {
            this.setState({totalPages: totalPages})
            document.cookie = "totalPages=" + this.state.totalPages + "; path=/";
          }
        })
        .catch(err => {
          console.log(err);
          this.props.serverError(true);
        });
    });

  }

  componentDidMount = () => {
    this.updateProducts(this.state.page)
  }

  hideDeleteNotification = () => {
    this.setState({
      deleteNotification: false
    });
  }

  deleteProduct = (id) => {
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
    let productInfoStyles = {'height': '40px'}
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
              <Tooltip title="Add Product" placement={"left"}>
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
              </Tooltip>
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
                <Grid item xs={12} sm={12} md={6} lg={4} key={product.id}>
                  <Card className="product-card">
                    <CardContent>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography component="p">
                            <b>Name:</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6} style={productInfoStyles}>
                          <Typography component="p">{product.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="p">
                            <b>Description:</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6} style={productInfoStyles}>
                          <Typography component="p">
                            {product.description.length > 30 ? product.description.substr(0, 30) + " ..." : product.description}
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
                      >
                        <Grid item xs={12} sm={this.props.admin ? 6 : 12}>
                          {this.props.productsInCart.includes(product.id) ? (
                            <Button
                              style={{color: '#2196f3', borderColor: '#2196f3'}}
                              color="primary"
                              size="small"
                              variant="outlined"
                              onClick={() =>
                                this.props.removeFromCart(product.id)
                              }
                              fullWidth
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              style={{backgroundColor: '#2196f3'}}
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
                            <Grid item xs={12} sm={3}>
                              <Link to={product.url.edit}>
                                <Button
                                  style={{backgroundColor: '#2196f3'}}
                                  color="primary"
                                  size="small"
                                  variant="contained"
                                  fullWidth
                                >
                                  Edit
                                </Button>
                              </Link>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Button
                                style={{backgroundColor: '#2196f3'}}
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
            {this.state.spinnerLoading ? (""):
            (<div id="product-pagination">
              <Pagination count={parseInt(this.state.totalPages)} shape="rounded" variant="outlined" page={parseInt(this.state.page)} style={{color: "rgb(33, 150, 243)", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} onChange={this.pageChange} />
            </div>)
            }
          </React.Fragment>
        )}
      </div>
    );
  }
}
export default Products;
