const orderController = require('../controllers/orderController');
const express = require('express');
const router = express.Router();


// Create a new order
router.post('/', orderController.createOrder);  
// Get orders for a specific user
router.get('/user/:userId', orderController.getUserOrders);
// Get all orders
router.get('/', orderController.getAllOrders);
module.exports = router;