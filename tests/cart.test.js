const request = require('supertest');
const app = require('../server');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');

describe('Cart API', () => {
    let testUserId;
    let testProductId;
    let testUser;
    let testProduct;

    // Create test user and product before running tests
    beforeAll(async () => {
        // Create a test user
        testUser = new userModel({
            username: 'carttestuser_' + Date.now(),
            email: `carttest_${Date.now()}@example.com`,
            password: 'testpassword123'
        });
        const savedUser = await testUser.save();
        testUserId = savedUser._id;

        // Create a test product
        testProduct = new productModel({
            id: 'cartprod_' + Date.now(),
            name: 'Test Product for Cart',
            description: 'Test product description',
            price: 29.99,
            stock: 10,
            photo: 'test-product-image.jpg'
        });
        const savedProduct = await testProduct.save();
        testProductId = savedProduct._id;
    });

    // Clean up test data after running tests
    afterAll(async () => {
        await cartModel.deleteMany({ userId: testUserId });
        await userModel.findByIdAndDelete(testUserId);
        await productModel.findByIdAndDelete(testProductId);
    });

    describe('POST /api/cart/add', () => {
        it('should add a product to cart', async () => {
            const response = await request(app)
                .post('/api/cart/add')
                .send({
                    userId: testUserId,
                    productId: testProductId,
                    quantity: 2
                })
                .expect(200);

            expect(response.body.userId).toBe(testUserId.toString());
            expect(response.body.products).toHaveLength(1);
            expect(response.body.products[0].productId.toString()).toBe(testProductId.toString());
            expect(response.body.products[0].quantity).toBe(2);
        });
    });

    describe('GET /api/cart/:userId', () => {
        it('should get cart by user ID', async () => {
            // First, add an item to create the cart
            await request(app)
                .post('/api/cart/add')
                .send({
                    userId: testUserId,
                    productId: testProductId,
                    quantity: 1
                })
                .expect(200);

            // Then get the cart
            const response = await request(app)
                .get(`/api/cart/${testUserId}`)
                .expect(200);

            expect(response.body.userId).toBe(testUserId.toString());
            expect(response.body.products).toHaveLength(1);
        });

        it('should return 404 for non-existent cart', async () => {
            const response = await request(app)
                .get('/api/cart/507f1f77bcf86cd799439011')
                .expect(404);

            expect(response.body.message).toBe('Cart not found');
        });
    });

    describe('POST /api/cart/remove', () => {
        it('should remove a product from cart', async () => {
            // First, add an item to create the cart
            await request(app)
                .post('/api/cart/add')
                .send({
                    userId: testUserId,
                    productId: testProductId,
                    quantity: 1
                })
                .expect(200);

            // Then remove the item
            const response = await request(app)
                .post('/api/cart/remove')
                .send({
                    userId: testUserId,
                    productId: testProductId
                })
                .expect(200);

            expect(response.body.products).toHaveLength(0);
        });

        it('should return 404 for non-existent cart', async () => {
            const response = await request(app)
                .post('/api/cart/remove')
                .send({
                    userId: '507f1f77bcf86cd799439011',
                    productId: testProductId
                })
                .expect(404);

            expect(response.body.message).toBe('Cart not found');
        });
    });

    describe('POST /api/cart/clear', () => {
        it('should clear the cart', async () => {
            // First, add an item to cart
            await request(app)
                .post('/api/cart/add')
                .send({
                    userId: testUserId,
                    productId: testProductId,
                    quantity: 1
                })
                .expect(200);

            // Then clear the cart - userId and other data in request body
            const response = await request(app)
                .post('/api/cart/clear')
                .send({
                    userId: testUserId
                })
                .expect(200);

            expect(response.body.products).toHaveLength(0);
        });

        it('should return 404 for non-existent cart', async () => {
            const response = await request(app)
                .post('/api/cart/clear')
                .send({
                    userId: '507f1f77bcf86cd799439011'
                })
                .expect(404);

            expect(response.body.message).toBe('Cart not found');
        });
    });
});