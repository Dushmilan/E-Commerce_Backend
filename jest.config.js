module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTest.js'],
  testTimeout: 30000, // Increase timeout for tests that involve database operations
};