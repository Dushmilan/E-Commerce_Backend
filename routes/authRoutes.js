const authController = require('../controllers/authController');
const middleWare = require('../utils/middleWare/middleWare');
const authRoutes = require('express').Router(); 

// Define authentication-related routes
authRoutes.post('/register', authController.registerUser);
authRoutes.post('/login', authController.loginUser);

module.exports = authRoutes;