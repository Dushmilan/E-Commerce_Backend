const axios = require('axios');
const mongoose = require('mongoose');

// Test server is running on port 3000
const BASE_URL = 'http://localhost:3000';

console.log('Testing Order Functionality...');

// Test 1: Check if server is running
async function testServerStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log('✓ Server status check passed:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Server status check failed:', error.message);
    return false;
  }
}

// Test 2: Test creating an order with payment middleware (using valid ObjectId)
async function testCreateOrder() {
  try {
    // Generate a valid ObjectId for testing
    const validUserId = new mongoose.Types.ObjectId().toString();
    const validProductId = new mongoose.Types.ObjectId().toString();

    // Sample order data with amount for payment processing
    const orderData = {
      userId: validUserId,
      products: [
        {
          productId: validProductId,
          quantity: 2
        }
      ],
      amount: 99.99, // Amount for payment processing
      address: {
        street: '123 Test Street',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country'
      }
    };

    const response = await axios.post(`${BASE_URL}/api/orders`, orderData);
    console.log('✓ Order creation test passed:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Order creation test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 3: Test retrieving all orders
async function testGetAllOrders() {
  try {
    const response = await axios.get(`${BASE_URL}/api/orders`);
    console.log('✓ Get all orders test passed:', `Found ${response.data.length} orders`);
    return true;
  } catch (error) {
    console.error('✗ Get all orders test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 4: Test retrieving user orders
async function testGetUserOrders() {
  try {
    // Using a valid ObjectId for testing
    const userId = new mongoose.Types.ObjectId().toString();
    const response = await axios.get(`${BASE_URL}/api/orders/user/${userId}`);
    console.log('✓ Get user orders test passed:', `Found ${response.data.length} orders for user`);
    return true;
  } catch (error) {
    console.error('✗ Get user orders test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 5: Test payment middleware error handling with invalid amount
async function testPaymentErrorHandling() {
  try {
    // Generate a valid ObjectId for testing
    const validUserId = new mongoose.Types.ObjectId().toString();
    const validProductId = new mongoose.Types.ObjectId().toString();

    // Test with invalid amount
    const orderData = {
      userId: validUserId,
      products: [
        {
          productId: validProductId,
          quantity: 2
        }
      ],
      amount: -10, // Invalid negative amount
      address: {
        street: '123 Test Street',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country'
      }
    };

    const response = await axios.post(`${BASE_URL}/api/orders`, orderData);
    console.log('✗ Payment error handling test failed: Should have returned error for invalid amount');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✓ Payment error handling test passed: Correctly rejected invalid amount');
      return true;
    } else {
      console.error('✗ Payment error handling test unexpected result:', error.response?.data || error.message);
      return false;
    }
  }
}

// Test 6: Test retrieving a specific order by ID (with a valid existing order)
async function testGetOrderById() {
  try {
    // First create an order to test with
    const validUserId = new mongoose.Types.ObjectId().toString();
    const validProductId = new mongoose.Types.ObjectId().toString();

    const orderData = {
      userId: validUserId,
      products: [
        {
          productId: validProductId,
          quantity: 1
        }
      ],
      amount: 49.99,
      address: {
        street: '456 Test Avenue',
        city: 'Testville',
        zipCode: '54321',
        country: 'Testland'
      }
    };

    // Create the order first
    const createResponse = await axios.post(`${BASE_URL}/api/orders`, orderData);
    const orderId = createResponse.data._id;
    
    // Now test retrieving that specific order
    const response = await axios.get(`${BASE_URL}/api/orders/${orderId}`);
    console.log('✓ Get order by ID test passed:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Get order by ID test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 7: Test retrieving a non-existent order (should return 404)
async function testGetNonExistentOrder() {
  try {
    // Use a valid ObjectId format but one that doesn't exist
    const fakeOrderId = new mongoose.Types.ObjectId().toString();
    const response = await axios.get(`${BASE_URL}/api/orders/${fakeOrderId}`);
    
    console.log('✗ Get non-existent order test failed: Should have returned 404');
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('✓ Get non-existent order test passed: Correctly returned 404 for non-existent order');
      return true;
    } else {
      console.error('✗ Get non-existent order test unexpected result:', error.response?.data || error.message);
      return false;
    }
  }
}

// Main test function
async function runTests() {
  console.log('\nStarting Order Functionality Tests...\n');
  
  const results = [];
  
  results.push(await testServerStatus());
  results.push(await testGetAllOrders());
  results.push(await testCreateOrder());
  results.push(await testGetUserOrders());
  results.push(await testPaymentErrorHandling());
  results.push(await testGetOrderById());
  results.push(await testGetNonExistentOrder());
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\nTest Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All order functionality tests passed!');
  } else {
    console.log('⚠️ Some tests failed. Check the error messages above.');
  }
}

// Run the tests
runTests();