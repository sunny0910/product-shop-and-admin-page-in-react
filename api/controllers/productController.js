const Product = require("../models/productsModel");

const getAllProducts = (req, res) => {
  Product.find()
    .select("price description name _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            id: doc._id,
            name: doc.name,
            description: doc.description,
            price: doc.price,
            url: {
              view: "/products/" + doc._id,
              edit: "/products/" + doc._id + "/edit",
              delete: "/products" + doc._id + "/delete"
            }
          };
        })
      };
      res.json(response);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

const createProduct = (req, res) => {
  const product = new Product(req.body);
  product
    .save()
    .then(result => {
      res.json({
        message: "Product created successfuly",
        product: {
          id: result._id,
          name: result.name,
          description: result.description,
          price: result.price
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

const getOneProduct = (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .select("price description name _id")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

const updateProduct = (req, res) => {
  let body = req.body;
  let id = req.params.id;
  Product.update({ _id: id }, { $set: body })
    .exec()
    .then(result =>
      res.status(200).json({
        message: "Product updated"
      })
    )
    .catch(err => res.status(500).json({ error: err }));
};

const deleteProduct = (req, res) => {
  let id = req.params.id;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result =>
      res.status(200).json({
        response: {
          message: "Successfuly deleted"
        }
      })
    )
    .catch(err => res.status(500).json({ error: err }));
};

module.exports = {
  getAllProducts: getAllProducts,
  createProduct: createProduct,
  getOneProduct: getOneProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct
};
