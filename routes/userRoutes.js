const userRoutes = require('express').Router();
const userController = require('../controllers/userController');
const middleWare = require('../utils/middleWare/middleWare');

// Define user-related routes
userRoutes.get('/', userController.getAllUsers);
userRoutes.get('/:id', userController.getUserById);
userRoutes.post('/', userController.createUser);
userRoutes.put('/:id', middleWare.authenticateToken,userController.updateUser);
userRoutes.delete('/:id',middleWare.authenticateToken, userController.deleteUser);


module.exports = userRoutes;