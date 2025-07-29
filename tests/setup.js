// Test setup and global configurations
const { matchers } = require('jest-json-schema');

// Add custom JSON schema matchers
expect.extend(matchers);

global.TEST_TIMEOUT = 30000;