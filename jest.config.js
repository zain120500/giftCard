const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/test'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'], 
};

module.exports = createJestConfig(customJestConfig);
