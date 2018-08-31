var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);

router.post('/', checkAuth, productController.createProduct);

router.get('/:id', productController.getOneProduct);

router.delete('/:id', checkAuth, productController.deleteProduct);

router.post('/:id', checkAuth, productController.updateProduct);

module.exports = router;