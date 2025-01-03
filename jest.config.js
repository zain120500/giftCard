// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
});

// Create the Jest config based on the Next.js setup
const customJestConfig = {
  testEnvironment: 'jsdom', // Use jsdom for browser-like tests
  roots: ['<rootDir>/test'], // Specify the directory for your tests
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'], // Match test files
};

module.exports = createJestConfig(customJestConfig);
