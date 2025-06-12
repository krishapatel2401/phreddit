// jest.config.js
module.exports = {
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest', // Transforms JS and JSX files with Babel
    },
    testEnvironment: 'jsdom', // Use jsdom for testing (browser-like environment)
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy', // Mock CSS imports with identity-obj-proxy
    },
  };