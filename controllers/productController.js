const productModel = require('../models/productModel');

async function getAllProducts(req, res) {
  try {
    const products = await productModel.find({});
    res.json(products);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}
async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
}
async function createProduct(req, res) {
  try {
    const productData = req.body;
    
    // Handle photo upload path
    if (req.file) {
      productData.photo = req.file.path;  // or req.file.filename depending on your needs
    }
    
    const newProduct = new productModel(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create product' });
  }
}
async function updateProduct(req, res) {
  const { id } = req.params;
  try {
    const productData = req.body;
    
    // Handle photo upload path
    if (req.file) {
      productData.photo = req.file.path;  // or req.file.filename depending on your needs
    }
    
    const updatedProduct = await productModel.findByIdAndUpdate(id, productData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update product' });
  }
}
async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
}
module.exports = {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct};