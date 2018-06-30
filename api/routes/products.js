var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
var Product = require('../models/productsModel');

router.get('/products', function(req, res) {
    Product.find().exec()
    .then(docs => {
            res.json({
                mssg: 'Products list, Index action',
                products: docs
            });
        }
    )
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/products', function(req, res) {
    const product = new Product(req.body);
    product
    .save()
    .then(result => {
            res.json({
                message:'Create product, store action',
                product: result
            });
        }
    )
    .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        }
    );
    
});

router.get('/products/:id', function(req, res) {
    const id = req.params.id;
    Product.findById(id)
    .exec()
    .then(doc => {
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: 'Not Found'});
        }
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({error: err});
        }
    );
});

router.post('/products/:id', function(req, res) {
    let body = req.body;
    console.log(body);
    Product.update({_id: req.params.id}, {body})
    .exec()
    .then(
        result => res.status(200).json(
            {
                message: "Product updated",
                response: result
            }
        )
    )
    .catch(
        err => res.status(500).json(
            {error:err}
        )
    )
    res.json({
        mssg: "update product, update action",
        value : par
    });
});

router.delete('/products/:id', function(req, res) {
    let id = req.params.id;
    console.log(id);
    Product.deleteOne( {_id: id} )
    .exec() 
    .then(
        result => res.status(200).json({
            response: result
        })
    )
    .catch(
        err=> res.status(500).json({error: err})
    );
});

module.exports = router;