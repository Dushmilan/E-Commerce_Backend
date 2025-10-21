const userModel = require('../models/userModel');
const middleWare = require('../utils/middleWare/middleWare');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
        console.error('Registration error:', error); // Added for debugging
    }   
};

// Login user and generate token
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username === process.env.Admin_Username && password === process.env.Admin_Password) {
            const token = middleWare.createToken({ username, isAdmin: true });
            return res.status(200).json({ token });
        }
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = middleWare.createToken({ id: user._id, username: user.username });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' });
    }
};

module.exports = { registerUser, loginUser };