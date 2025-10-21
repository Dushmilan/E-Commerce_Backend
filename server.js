const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

//route imports
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// ... other imports
const connectDB = require('./config/db');

connectDB(); // Call connectDB to establish the database connection

app.use(cors());
app.use(express.json());

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Define your routes here
app.get('/', (req, res) => {res.send('Welcome to the E-Commerce Backend!');});
app.get('/status', (req, res) => {res.json({ status: 'OK', timestamp: new Date() });});
app.get('/health', (req, res) => {res.json({ health: 'Healthy', uptime: process.uptime() });});


app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// app.use('/products', productRoutes);


module.exports = app;