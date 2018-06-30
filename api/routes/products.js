var express = require('express');
var router = express.Router();
// var products = require('../models/products');

router.get('/', function(reu, res) {
    res.json({
        mssg: 'Products shop site'
    });
    res.end();
});

router.get('/products', function(reu, res) {
    // var allproducts = products.find();
    // res.json({allproducts});
    res.json({
        mssg: 'Products list'
    });
    res.send();
});

router.post('/products', function(reu, res) {
    const order = {
        // id : reu.id,
        name : reu.body.name,
        price : reu.body.price
    }
    // var product = products.insert();
    res.json({
        mssg:'Create product',
        order: order
    });
});

router.post('/edit/:id', function(reu, res) {
    let par = reu.params;
    res.json({
        mssg: "edit product",
        value : {par}
    });
});

router.delete('/:id', function(reu, res) {
    res.json({
        mssg: "delete product"
    });
});

router.patch('/:id', function(reu, res) {
    res.json({
        mssg: "Product updated"
    });
});

module.exports = router;