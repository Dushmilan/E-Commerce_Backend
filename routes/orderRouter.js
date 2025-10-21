const orderController = require('../controllers/orderController');
const paymentmiddleware = require('../utils/middleWare/payment');
const express = require('express');
const router = express.Router();


// Create a new order
router.post('/', paymentmiddleware.processPayment,orderController.createOrder);  
// Get orders for a specific user
router.get('/user/:userId', orderController.getUserOrders);
// Get a specific order by ID
router.get('/:orderId', orderController.getOrderById);
// Get all orders
router.get('/', orderController.getAllOrders);
module.exports = router;