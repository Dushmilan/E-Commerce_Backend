const request = require('supertest');
const app = require('../server');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

describe('Authentication API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const uniqueUser = {
                username: 'testuser_' + Date.now(),
                email: `test_${Date.now()}@example.com`,
                password: 'testpassword123'
            };
            
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: uniqueUser.username,
                    email: uniqueUser.email,
                    password: uniqueUser.password
                })
                .expect(201);

            expect(response.body.message).toBe('User registered successfully');
        });

        it('should return error if username already exists', async () => {
            const uniqueUser = {
                username: 'testuser_' + Date.now(),
                email: `test_${Date.now()}@example.com`,
                password: 'testpassword123'
            };
            
            // Register user first
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: uniqueUser.username,
                    email: uniqueUser.email,
                    password: uniqueUser.password
                })
                .expect(201);
            
            // Try to register the same user again
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: uniqueUser.username, // This username already exists
                    email: `another_${Date.now()}@example.com`,
                    password: uniqueUser.password
                })
                .expect(500);

            expect(response.body.error).toBe('Error registering user');
        });

        it('should return error if required fields are missing', async () => {
            const uniqueUser = {
                username: 'testuser_' + Date.now(),
                email: `test_${Date.now()}@example.com`,
                password: 'testpassword123'
            };
            
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: uniqueUser.username
                    // Missing email and password
                })
                .expect(500);

            expect(response.body.error).toBe('Error registering user');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login user with correct credentials', async () => {
            const uniqueUser = {
                username: 'testuser_' + Date.now(),
                email: `test_${Date.now()}@example.com`,
                password: 'testpassword123'
            };
            
            // First, register the user
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: uniqueUser.username,
                    email: uniqueUser.email,
                    password: uniqueUser.password
                })
                .expect(201);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: uniqueUser.username,
                    password: uniqueUser.password
                })
                .expect(200);

            expect(response.body.token).toBeDefined();
        });

        it('should return error for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'nonexistentuser_' + Date.now(),
                    password: 'wrongpassword'
                })
                .expect(400);

            expect(response.body.error).toBe('Invalid credentials');
        });

        it('should return error for incorrect password', async () => {
            const uniqueUser = {
                username: 'testuser_' + Date.now(),
                email: `test_${Date.now()}@example.com`,
                password: 'testpassword123'
            };
            
            // First, register the user
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: uniqueUser.username,
                    email: uniqueUser.email,
                    password: uniqueUser.password
                })
                .expect(201);
            
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: uniqueUser.username,
                    password: 'wrongpassword'
                })
                .expect(400);

            expect(response.body.error).toBe('Invalid credentials');
        });
    });
});