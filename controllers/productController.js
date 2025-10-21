function getAllProducts(req, res) {
  // Logic to get all products
  res.json({ message: 'Get all products' });
}
function getProductById(req, res) {
  const { id } = req.params;
    // Logic to get a product by ID
    res.json({ message: `Get product with ID: ${id}` });    
}
function createProduct(req, res) {
  const productData = req.body;
    // Logic to create a new product
    res.json({ message: 'Create a new product', data: productData });    
}
function updateProduct(req, res) {
  const { id } = req.params;
  const productData = req.body;
    // Logic to update a product by ID
    res.json({ message: `Update product with ID: ${id}`, data: productData });    
}
function deleteProduct(req, res) {
  const { id } = req.params;
    // Logic to delete a product by ID
    res.json({ message: `Delete product with ID: ${id}` });    
}
module.exports = {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct};