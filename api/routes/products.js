var express = require('express');
var router = express.Router();
var Product = require('../models/productsModel');

router.get('/', function(req, res) {
    Product.find().select('name price _id').exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id : doc._id,
                    name: doc.name,
                    price : doc.price,
                    request : {
                        type: 'GET',
                        url: "http://localhost:3000/api/v1/products/"+doc._id
                    }
                }
            })
        }
            res.json(response);
        }
    )
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', function(req, res) {
    const product = new Product(req.body);
    product
    .save()
    .then(result => {
            res.json({
                message:'Product created successfuly',
                product: {
                    _id : result._id,
                    name : result.name,
                    price : result.price,
                    request : {
                        type: 'GET',
                        url: 'http://localhost:3000/api/v1/products/'+result._id
                    }       
                }
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

router.get('/:id', function(req, res) {
    const id = req.params.id;
    Product.findById(id)
    .select('name price _id')
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
router.post('/:id', function(req, res) {
    let body = req.body;
    let id = req.params.id;
    Product.update({_id: id}, {$set: body })
    .exec()
    .then(
        result => res.status(200).json(
            {
                message: "Product updated",
                request: {
                    type: 'GET',
                    url : "http://localhost:3000/api/v1/products/"+id
                }
            }
        )
    )
    .catch(
        err => res.status(500).json(
            {error:err}
        )
    )
});

router.delete('/:id', function(req, res) {
    let id = req.params.id;
    Product.deleteOne( {_id: id} )
    .exec() 
    .then(
        result => res.status(200).json({
            response: {
                message: "Successfuly deleted"
            }
        })
    )
    .catch(
        err=> res.status(500).json({error: err})
    );
});

module.exports = router;