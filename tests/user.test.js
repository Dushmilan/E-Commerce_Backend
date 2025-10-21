const request = require('supertest');
const app = require('../server');
const userModel = require('../models/userModel');
const middleWare = require('../utils/middleWare/middleWare');

// Mock user data for testing
let mockUser = {
    username: 'testuser123',
    email: 'test123@example.com',
    password: 'testpassword123'
};

// Mock token for authenticated requests
let testToken;
let testUserId;

describe('User API', () => {
    beforeEach(async () => {
        // Create a user and generate a token for authenticated requests before each test that needs it
        mockUser = {
            username: 'testuser123_' + Date.now(),
            email: `test123_${Date.now()}@example.com`,
            password: 'testpassword123'
        };
        
        const newUser = new userModel({
            username: mockUser.username,
            email: mockUser.email,
            password: mockUser.password
        });
        const savedUser = await newUser.save();
        testUserId = savedUser._id;
        testToken = middleWare.createToken({ id: savedUser._id, username: savedUser.username });
    });

    describe('GET /api/users', () => {
        it('should get all users', async () => {
            const response = await request(app)
                .get('/api/users')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should get a user by ID', async () => {
            const response = await request(app)
                .get(`/api/users/${testUserId}`)
                .expect(200);

            expect(response.body._id).toBe(testUserId.toString());
            expect(response.body.username).toBe(mockUser.username);
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .get('/api/users/507f1f77bcf86cd799439011')
                .expect(404);

            expect(response.body.message).toBe('User not found');
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const newUser = {
                username: 'newtestuser_' + Date.now(),
                email: `newtest_${Date.now()}@example.com`,
                password: 'newpassword123'
            };
            
            const response = await request(app)
                .post('/api/users')
                .send(newUser)
                .expect(201);

            expect(response.body.username).toBe(newUser.username);
            expect(response.body.email).toBe(newUser.email);
            
            // Clean up: delete the created user
            await userModel.findByIdAndDelete(response.body._id);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update a user with valid token', async () => {
            const updatedData = {
                username: 'updatedtestuser_' + Date.now(),
                email: `updated_${Date.now()}@example.com`
            };

            const response = await request(app)
                .put(`/api/users/${testUserId}`)
                .set('Authorization', `Bearer ${testToken}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.username).toBe(updatedData.username);
            expect(response.body.email).toBe(updatedData.email);
        });

        it('should return 401 without valid token', async () => {
            const updatedData = {
                username: 'unauthorizedupdate_' + Date.now(),
                email: `unauth_${Date.now()}@example.com`
            };

            await request(app)
                .put(`/api/users/${testUserId}`)
                .send(updatedData)
                .expect(401);
        });

        it('should return 404 for non-existent user', async () => {
            const updatedData = {
                username: 'updatedtestuser_' + Date.now(),
                email: `updated_${Date.now()}@example.com`
            };

            await request(app)
                .put('/api/users/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${testToken}`)
                .send(updatedData)
                .expect(404);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete a user with valid token', async () => {
            // Create a new user to delete
            const uniqueUsername = 'usertodelete_' + Date.now();
            const userToDelete = new userModel({
                username: uniqueUsername,
                email: `delete_${Date.now()}@example.com`,
                password: 'deletepassword123'
            });
            const savedUser = await userToDelete.save();
            
            const response = await request(app)
                .delete(`/api/users/${savedUser._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(200);

            expect(response.body.message).toBe('User deleted successfully');
        });

        it('should return 401 without valid token', async () => {
            await request(app)
                .delete(`/api/users/${testUserId}`)
                .expect(401);
        });

        it('should return 404 for non-existent user', async () => {
            await request(app)
                .delete('/api/users/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${testToken}`)
                .expect(404);
        });
    });
});