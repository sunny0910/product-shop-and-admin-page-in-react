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
    }

    componentDidMount() {
        apiRequest(apiUrl+'/products', 'GET')
        .then((result) => {
            result.json()
            .then((json) => {
                this.setState({
                    products: json.products,
                    count: json.count
                });
                //console.log(this.state);
            }
            )
        })
    }

    render() {
        const products=this.state.products;
        const allProducts = products.map((product) => 
            <div className = 'product-listing-single-product' id = {product.id}>
                <div className='product-name'>
                    <p>{product.name}</p>
                </div>
                <div className='product-price'>
                    <p>{product.price}</p>
                </div>
            </div>
        );
        console.log(products);
        return (
            <div className = 'products'>
                {allProducts}
            </div>
        );
    }
}
export default Products;