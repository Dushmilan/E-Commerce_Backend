const productRoutes = require('express').Router();
const productController = require('../controllers/productController');

// Define product-related routes
productRoutes.get('/', productController.getAllProducts);
productRoutes.get('/:id', productController.getProductById);
productRoutes.post('/', productController.createProduct);
productRoutes.put('/:id', productController.updateProduct);
productRoutes.delete('/:id', productController.deleteProduct);
module.exports = productRoutes;