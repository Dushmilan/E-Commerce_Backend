const userModel = require('../models/userModel');

function getAllUsers(req, res) {
  userModel.find({})
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
}
function getUserById(req, res) {
  const userId = req.params.id;
  userModel.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
}
function createUser(req, res) {
  const newUser = req.body;
    // Logic to create a new user
    userModel.create(newUser)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(400).json({ message: err.message });
    });
}
function updateUser(req, res) {
  const userId = req.params.id;
  const updatedUser = req.body;

    // Logic to update user by ID
  userModel.findByIdAndUpdate(
    userId,
    { ...updatedUser, updatedAT: Date.now() },
    { new: true }
    )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    })
    .catch(err => {
      res.status(400).json({ message: err.message });
    });
}
function deleteUser(req, res) {
    const userId = req.params.id;
    // Logic to delete user by ID
    userModel.findByIdAndDelete(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
}
module.exports = {getAllUsers, getUserById,createUser,updateUser,deleteUser};