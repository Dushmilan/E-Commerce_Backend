const productRoutes = require('express').Router();
const productController = require('../controllers/productController');
const photoUpload = require('../utils/middleWare/photoUpload');

// Define product-related routes
productRoutes.get('/', productController.getAllProducts);
productRoutes.get('/:id', productController.getProductById);
productRoutes.post('/', photoUpload,productController.createProduct);
productRoutes.put('/:id', productController.updateProduct);
productRoutes.delete('/:id', productController.deleteProduct);
module.exports = productRoutes;