const orderController = require('../controllers/orderController');
const paymentmiddleware = require('../utils/middleWare/payment');
const middleWare = require('../utils/middleWare/middleWare');
const express = require('express');
const router = express.Router();


// Create a new order
router.post('/', paymentmiddleware.processPayment, orderController.createOrder);  
// Get orders for a specific user
router.get('/user/:userId', middleWare.authenticateToken, orderController.getUserOrders);
// Get a specific order by ID
router.get('/:orderId', middleWare.authenticateToken, orderController.getOrderById);
// Get all orders (admin only)
router.get('/', middleWare.authenticateToken, orderController.getAllOrders);
module.exports = router;