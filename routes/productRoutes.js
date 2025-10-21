const productRoutes = require('express').Router();
const productController = require('../controllers/productController');
const middleWare = require('../utils/middleWare/middleWare');
const photoUpload = require('../utils/middleWare/photoUpload');

// Define product-related routes
productRoutes.get('/', middleWare.authenticateToken, productController.getAllProducts);
productRoutes.get('/:id', middleWare.authenticateToken, productController.getProductById);
productRoutes.post('/', middleWare.authenticateToken, photoUpload, productController.createProduct);
productRoutes.put('/:id', middleWare.authenticateToken, productController.updateProduct);
productRoutes.delete('/:id', middleWare.authenticateToken, productController.deleteProduct);
module.exports = productRoutes;