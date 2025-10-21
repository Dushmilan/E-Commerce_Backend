const request = require('supertest');
const app = require('../server');
const productModel = require('../models/productModel');

// Mock product data for testing (without file uploads for in-memory tests)
const mockProduct = {
    id: 'prod_' + Date.now(),
    name: 'Test Product',
    description: 'This is a test product',
    price: 29.99,
    stock: 10,
    photo: 'sample-image.jpg' // This would normally be set by the upload middleware
};

describe('Product API', () => {
    let createdProductId;

    describe('GET /products', () => {
        it('should get all products', async () => {
            const response = await request(app)
                .get('/products')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /products/:id', () => {
        it('should get a product by ID', async () => {
            // First create a product to retrieve
            const createResponse = await request(app)
                .post('/products')
                .send({
                    ...mockProduct
                })
                .expect(201);
                
            createdProductId = createResponse.body._id;

            const response = await request(app)
                .get(`/products/${createdProductId}`)
                .expect(200);

            expect(response.body._id).toBe(createdProductId);
            expect(response.body.name).toBe(mockProduct.name);
        });

        it('should return 404 for non-existent product', async () => {
            const response = await request(app)
                .get('/products/507f1f77bcf86cd799439011')
                .expect(404);

            expect(response.body.error).toBe('Product not found');
        });
    });

    describe('POST /products', () => {
        it('should create a new product with photo field', async () => {
            const uniqueProduct = {
                id: 'prod_' + Date.now(),
                name: 'New Test Product',
                description: 'New test product description',
                price: 39.99,
                stock: 5,
                photo: 'test-image.jpg' // Include photo field
            };
            
            const response = await request(app)
                .post('/products')
                .send(uniqueProduct)
                .expect(201);

            expect(response.body.name).toBe(uniqueProduct.name);
            expect(response.body.description).toBe(uniqueProduct.description);
            expect(response.body.price).toBe(uniqueProduct.price);
            expect(response.body.photo).toBe(uniqueProduct.photo);
            
            // Clean up: delete the created product
            createdProductId = response.body._id;
        });

        it('should return error if required fields are missing', async () => {
            const response = await request(app)
                .post('/products')
                .send({
                    name: 'Product without required fields'
                    // Missing other required fields
                })
                .expect(500);

            expect(response.body.error).toBe('Failed to create product');
        });
    });

    describe('PUT /products/:id', () => {
        it('should update a product', async () => {
            // First create a product
            const createResponse = await request(app)
                .post('/products')
                .send({
                    id: 'upd_' + Date.now(),
                    name: 'Product to Update',
                    description: 'Original description',
                    price: 19.99,
                    stock: 3,
                    photo: 'update-test.jpg'
                })
                .expect(201);
                
            const productId = createResponse.body._id;
            
            const updatedData = {
                name: 'Updated Product Name',
                description: 'Updated description',
                price: 49.99,
                stock: 8,
                photo: 'updated-test.jpg'
            };

            const response = await request(app)
                .put(`/products/${productId}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.name).toBe(updatedData.name);
            expect(response.body.description).toBe(updatedData.description);
        });

        it('should return 404 for non-existent product', async () => {
            const updatedData = {
                name: 'Non-existent update',
                description: 'Should not work',
                price: 99.99
            };

            const response = await request(app)
                .put('/products/507f1f77bcf86cd799439011')
                .send(updatedData)
                .expect(404);

            expect(response.body.error).toBe('Product not found');
        });
    });

    describe('DELETE /products/:id', () => {
        it('should delete a product', async () => {
            // First create a product to delete
            const createResponse = await request(app)
                .post('/products')
                .send({
                    id: 'del_' + Date.now(),
                    name: 'Product to Delete',
                    description: 'Description to delete',
                    price: 15.99,
                    stock: 2,
                    photo: 'delete-test.jpg'
                })
                .expect(201);
                
            const productId = createResponse.body._id;

            const response = await request(app)
                .delete(`/products/${productId}`)
                .expect(200);

            expect(response.body.message).toBe('Product deleted successfully');
        });

        it('should return 404 for non-existent product', async () => {
            const response = await request(app)
                .delete('/products/507f1f77bcf86cd799439011')
                .expect(404);

            expect(response.body.error).toBe('Product not found');
        });
    });
});