const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  rootDir: 'src',
  coverageDirectory: './coverage',
};
