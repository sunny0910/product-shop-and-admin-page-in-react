const Product = require("../models/productsModel");

const getAllProducts = (req, res) => {

  const productsPerPage = 9

  const getProducts = (pageNumber) => (
    new Promise((resolve, reject) =>{
      Product.find()
        .select("price description name _id")
        .skip((pageNumber - 1) * productsPerPage)
        .limit(productsPerPage)
        .exec()
        .then(docs => {
          resolve(docs)
        })
        .catch(err => {
          reject(err)
        });
      })
    )
  const productsCount = () => (
    new Promise((resolve, reject) => {
      Product.find().countDocuments().exec()
      .then(count => {
        resolve(count)
        })
      .catch(err => {
        reject(err)
        })
      })
    )
    const getProductsAndCount = async (pageNumber) => {
      let products = await getProducts(pageNumber)
      let count = await productsCount()
      return {"products": products, 'count': count}
    }

    const pageNumber = req.query.page
    getProductsAndCount(pageNumber)
    .then(result => {
      products = result['products']
      count = result['count']
      const response = {
        totalCount: count,
        pageCount: products.length,
        productsPerPage: productsPerPage,
        products: products.map(product => {
          return {
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            url: {
              view: "/products/" + product._id,
              edit: "/products/" + product._id + "/edit",
              delete: "/products" + product._id + "/delete"
            }
          };
        })
      };
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    })
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
