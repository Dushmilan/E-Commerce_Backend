const productModel = require('../models/productModel');

function getAllProducts(req, res) {
  productModel.find({}, (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(products);
  });
}
function getProductById(req, res) {
  const { id } = req.params;
  productModel.findById(id, (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });   
}
function createProduct(req, res) {
  const productData = req.body;
  const newProduct = new productModel(productData);
  newProduct.save((err, savedProduct) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create product' });
    }
    res.status(201).json(savedProduct);
  });  
}
function updateProduct(req, res) {
  const { id } = req.params;
  const productData = req.body;
  productModel.findByIdAndUpdate(id, productData, { new: true }, (err, updatedProduct) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update product' });
    }
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  });    
}
function deleteProduct(req, res) {
  const { id } = req.params;
  productModel.findByIdAndDelete(id, (err, deletedProduct) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  }); 
}
module.exports = {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct};