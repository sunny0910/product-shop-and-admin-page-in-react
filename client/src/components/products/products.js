import React, {Component} from 'react';
import apiUrl from '../../apiUrl';
import apiRequest from '../../apiRequest';
import { Grid, Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
// import CardActionArea from '@material-ui/core/CardActionArea';

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
        // const anchorOrigin = {horizontal: "center", vertical: "bottom"};
        document.title = "Products";
        // const products=this.state.products;
        // const allProducts = products.map((product) => 
        //     <div className = 'product-listing-single-product' key = {product._id}>
        //         <div className='product-name'>
        //             <p>{product.name}</p>
        //         </div>
        //         <div className='product-price'>
        //             <p>{product.price}</p>
        //         </div>
        //     </div>
        // );
        return (
            <div className = 'products-grid'>
            {/* {(this.props.match.params.unathorized) ? <Snackbar autoHideDuration={1500} anchorOrigin={anchorOrigin} open onClose={this.props.hideUnathorizedMessage} message="You are Not Authorized to view this page!" />:''} */}
                
                {/* {allProducts} */}
            <Grid container spacing={40} direction="row" justify = "space-evenly" alignItems="center">
                {this.state.products.map((product) => (
                    <Grid item xs={3} key={product._id}>
                        <Card className="product-card">
                            {/* <CardActionArea> */}
                                <CardMedia
                                    component="div"
                                    image="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&h=350"
                                    alt="Product Image"
                                    title="Product Title"
                                />
                                <CardContent>
                                    <Typography component="h2">
                                        {product.name}
                                    </Typography>
                                    <Typography component="p">
                                        {product.price}
                                    </Typography>
                                </CardContent>
                            {/* </CardActionArea> */}
                            <CardActions>
                                {this.props.productsInCart.includes(product._id) ?
                                    <Button color="primary" size="large" onClick={() => this.props.removeFromCart(product._id)}>
                                        Remove
                                    </Button> :
                                    <Button color="primary" size="large" onClick={() => this.props.addToCart(product._id)}>
                                        Add To Cart
                                    </Button>
                                }
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            </div>
        );
    }
}
export default Products;