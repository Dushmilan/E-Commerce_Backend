function getAllUsers(req, res) {
  // Logic to get all users
  res.json({ message: 'Get all users' });
}
function getUserById(req, res) {
  const userId = req.params.id;
    // Logic to get user by ID
    res.json({ message: `Get user with ID: ${userId}` });
}
function createUser(req, res) {
  const newUser = req.body;
    // Logic to create a new user
    res.status(201).json({ message: 'User created', user: newUser });
}
function updateUser(req, res) {
  const userId = req.params.id;
  const updatedUser = req.body;
    // Logic to update user by ID
    res.json({ message: `User with ID: ${userId} updated`, user: updatedUser });
}
function deleteUser(req, res) {
    const userId = req.params.id;
    // Logic to delete user by ID
    res.json({ message: `User with ID: ${userId} deleted` });
}   
module.exports = {getAllUsers, getUserById,createUser,updateUser,deleteUser};