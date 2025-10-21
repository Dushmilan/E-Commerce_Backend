const request = require('supertest');
const app = require('../server');

// Mock product data for testing
const mockProduct = {
    name: 'Test Product',
    price: 29.99,
    description: 'This is a test product',
    category: 'Electronics'
};

describe('Product API', () => {
    describe('GET /products', () => {
        it('should get all products', async () => {
            const response = await request(app)
                .get('/products')
                .expect(200);

            expect(response.body.message).toBe('Get all products');
        });
    });

    describe('GET /products/:id', () => {
        it('should get a product by ID', async () => {
            const productId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .get(`/products/${productId}`)
                .expect(200);

            expect(response.body.message).toBe(`Get product with ID: ${productId}`);
        });
    });

    describe('POST /products', () => {
        it('should create a new product', async () => {
            const response = await request(app)
                .post('/products')
                .send(mockProduct)
                .expect(200);

            expect(response.body.message).toBe('Create a new product');
            expect(response.body.data).toEqual(mockProduct);
        });
    });

    describe('PUT /products/:id', () => {
        it('should update a product', async () => {
            const updatedProduct = {
                name: 'Updated Product',
                price: 39.99,
                description: 'Updated description'
            };
            
            const productId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .put(`/products/${productId}`)
                .send(updatedProduct)
                .expect(200);

            expect(response.body.message).toBe(`Update product with ID: ${productId}`);
            expect(response.body.data).toEqual(updatedProduct);
        });
    });

    describe('DELETE /products/:id', () => {
        it('should delete a product', async () => {
            const productId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .delete(`/products/${productId}`)
                .expect(200);

            expect(response.body.message).toBe(`Delete product with ID: ${productId}`);
        });
    });
});