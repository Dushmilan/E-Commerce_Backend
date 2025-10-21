const cartController = require('../controllers/cartController');
const express = require('express');
const router = express.Router();
// Add product to cart
router.post('/add', cartController.addToCart);
// Get cart by user ID
router.get('/:userId', cartController.getCartByUserId);
// Remove product from cart
router.post('/remove', cartController.removeFromCart);
// Clear cart
router.post('/clear', cartController.clearCart);
module.exports = router;
