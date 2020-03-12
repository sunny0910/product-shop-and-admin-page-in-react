import React, { Component } from "react";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Button,
  Snackbar,
  CircularProgress,
  LinearProgress,
  TextField
} from "@material-ui/core";
import apiUrl from "../../apiUrl";
import apiRequest from "../../apiRequest";

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      price: 0,
      sucessNotification: false,
      linearLoading: false,
      spinnerLoading: true,
      priceError: false
    };
  }

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleDescriptionChange = (e) => {
    this.setState({
      description: e.target.value
    });
  }

  handlePriceChange = (e) => {
    if (Math.sign(e.target.value) === -1 || Math.sign(e.target.value) === -0) {
      this.setState({priceError: true})
    } else {
      this.setState({priceError: false})
    }
    this.setState({
      price: e.target.value
    });
  }

  componentDidMount = () => {
    if (!this.props.editPage) {
      this.setState({ spinnerLoading: false });
      return;
    }
    setTimeout(() => {
      apiRequest(
        apiUrl + "/products/" + this.props.id,
        "GET",
        "",
        this.props.token
      )
        .then(result => {
          if (result.status === 500) {
            this.props.serverError(true);
            return;
          }
          if (result.status === 401) {
            this.props.unAuthorised(result);
            return;
          }
          result
            .json()
            .then(json => {
              this.setState({
                name: json.name,
                description: json.description,
                price: json.price,
                spinnerLoading: false
              });
            })
            .catch(err => {
              console.log(err);
              this.props.serverError(true);
            });
        })
        .catch(err => {
          this.props.serverError(true);
        });
    }, 500);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (
      this.state.name === "" ||
      this.state.description === "" ||
      this.state.price === 0 ||
      this.state.priceError
    ) {
      return;
    }
    this.setState({ linearLoading: true });
    let data = {
      name: this.state.name,
      description: this.state.description,
      price: this.state.price
    };
    let method = "PATCH";
    let urlPath = this.props.id;
    if (!this.props.editPage) {
      method = "POST";
      urlPath = "";
    }
    data = JSON.stringify(data);
    apiRequest(
      apiUrl + "/products/" + urlPath,
      method,
      data,
      this.props.token
    ).then(result => {
      if (result.status === 500) {
        this.setState({ linearLoading: false });
        this.props.serverError(true);
        return;
      }
      if (result.status === 401) {
        this.setState({ linearLoading: false });
        this.props.unAuthorised(result);
        return;
      }
      result
        .json()
        .then(json => {
          setTimeout(() => {
            this.setState({
              sucessNotification: true,
              linearLoading: false
            }, ()=> {
              setTimeout(
                () => {
                  this.props.history.push('/products')
                }, 500
              )
            });
          }, 500);
        })
        .catch(err => {
          console.log(err);
          this.props.serverError(true);
        });
    });
  }

  render() {
    const buttonText = this.props.editPage ? "Update" : "Add";
    const anchorOrigin = { horizontal: "center", vertical: "bottom" };
    return (
      <div className="editpaper">
        <Paper>
          <form onSubmit={this.handleSubmit}>
            {this.state.sucessNotification ? (
              <Snackbar
                autoHideDuration={1500}
                anchorOrigin={anchorOrigin}
                open
                onClose={this.hideUpdatedMessage}
                message={
                  this.props.editPage ? "Product Updated!" : "Product Added!"
                }
              />
            ) : (
              ""
            )}
            {this.state.linearLoading ? <LinearProgress color="primary" /> : ""}
            <div className="formcontent">
              <div className="formHeading">
                {this.props.editPage ? (
                  <Typography variant="h5">Edit Product</Typography>
                ) : (
                  <Typography variant="h5">Add Product</Typography>
                )}
              </div>
              {this.state.spinnerLoading ? (
                <CircularProgress
                  color="primary"
                  variant="indeterminate"
                  className="userForm"
                />
              ) : (
                <React.Fragment>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="product-name">
                      Product Name:{" "}
                    </InputLabel>
                    <Input
                      type="text"
                      name="product-name"
                      value={this.state.name}
                      onChange={this.handleNameChange}
                      required
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <TextField
                      label="Description"
                      multiline
                      rows="10"
                      rowsMax='20'
                      size='medium'
                      value={this.state.description}
                      onChange={this.handleDescriptionChange}
                      required
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="price">Price: </InputLabel>
                    <Input
                      type="number"
                      name="price"
                      value={this.state.price}
                      onChange={this.handlePriceChange}
                      error={this.state.priceError}
                      required
                    />
                  </FormControl>
                  <Button
                    className="formSubmit"
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{backgroundColor: '#2196f3'}}
                  >
                    {buttonText}
                  </Button>
                </React.Fragment>
              )}
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

export default ProductForm;
