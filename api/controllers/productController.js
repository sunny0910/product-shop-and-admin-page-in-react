const Product = require('../models/productsModel');
const baseUrl = require('../baseUrl');

const getAllProducts = (req, res) => {
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
                        url: baseUrl+"/api/v1/products/"+doc._id
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
}

const createProduct = (req, res) => {
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
                        url: baseUrl+'/api/v1/products/'+result._id
                    }
                }
            });
        }
    )
    .catch(err => {
            res.status(500).json({
                error: err
            });
        }
    );
}

const getOneProduct = (req, res) => {
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
            res.status(500).json({error: err});
        }
    );
}

const updateProduct = (req, res) => {
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
                    url : baseUrl+"/api/v1/products/"+id
                }
            }
        )
    )
    .catch(
        err => res.status(500).json(
            {error:err}
        )
    )
}

const deleteProduct = (req, res) => {
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
}

module.exports = {
getAllProducts : getAllProducts,
createProduct : createProduct,
getOneProduct : getOneProduct,
updateProduct : updateProduct,
deleteProduct : deleteProduct
}