import React, {Component} from 'react';
import apiUrl from '../../apiUrl';
import apiRequest from '../../ApiRequest';

class Products extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            count: 0
        }
        console.log(this.state);
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
                {allProducts}
            </div>
        );
    }
}
export default Products;