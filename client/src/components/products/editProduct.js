import React, { Component } from "react";
import ProductForm from "./productFrom";

class EditProduct extends Component {
  render() {
    document.title = "Edit";
    return (
      <ProductForm
        id={this.props.match.params.id}
        admin={this.props.admin}
        token={this.props.token}
        history={this.props.history}
        editPage={true}
        serverError={this.props.serverError}
        unAuthorised={this.props.unAuthorised}
      />
    );
  }
}

export default EditProduct;
