const cartModel = require('../models/cartModel');

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = new cartModel({ userId, products: [] });
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        await cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};



// Get cart by user ID
exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartModel.findOne({ userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await cartModel
            .findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.products = [];
        await cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};




