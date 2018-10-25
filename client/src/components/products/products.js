import React, {Component} from 'react';
import apiUrl from '../../apiUrl';
import apiRequest from '../../apiRequest';
import { Snackbar } from '@material-ui/core';

class Products extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            count: 0
        }
        // console.log(this.props.match.params.unathorized);
        
    }

    componentDidMount() {
        apiRequest(apiUrl+'/products', 'GET')
        .then((result) => {
            if (result.status === 500) {
                this.props.serverError(true);
                return
            }
            result.json()
            .then((json) => {
                this.setState({
                    products: json.products,
                    count: json.count
                });
            })
            .catch((err) => {
                console.log(err);
                this.props.serverError(true);
            })
        })
    }

    render() {
        const anchorOrigin = {horizontal: "center", vertical: "bottom"};
        document.title = "Products";
        const products=this.state.products;
        const allProducts = products.map((product) => 
            <div className = 'product-listing-single-product' key = {product._id}>
                <div className='product-name'>
                    <p>{product.name}</p>
                </div>
                <div className='product-price'>
                    <p>{product.price}</p>
                </div>
            </div>
        );
        return (
            <div className = 'products'>
            {(this.props.match.params.unathorized) ? <Snackbar autoHideDuration={1500} anchorOrigin={anchorOrigin} open onClose={this.props.hideUnathorizedMessage} message="You are Not Authorized to view this page!" />:''}
                {allProducts}
            </div>
        );
    }
}
export default Products;