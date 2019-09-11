import React, { Component } from "react";
import ProductForm from "./productFrom";

class AddProduct extends Component {
  render() {
    document.title = "Add";
    return (
      <ProductForm
        token={this.props.token}
        admin={this.props.admin}
        serverError={this.props.serverError}
        unAuthorised={this.props.unAuthorised}
        history={this.props.history}
      />
    );
  }
}

export default AddProduct;
