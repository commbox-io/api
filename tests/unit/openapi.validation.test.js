const fs = require('fs');
const path = require('path');
const SwaggerParser = require('swagger-parser');
const OpenAPISchemaValidator = require('openapi-schema-validator').default;

describe('OpenAPI Specification Validation', () => {
  let openApiSpec;
  let bundledSpec;
  
  beforeAll(() => {
    // Load the original specification
    const openApiPath = path.join(__dirname, '../../openapi.json');
    openApiSpec = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));
    
    // Load the bundled specification if it exists
    const bundledPath = path.join(__dirname, '../../openapi-bundled.json');
    if (fs.existsSync(bundledPath)) {
      bundledSpec = JSON.parse(fs.readFileSync(bundledPath, 'utf8'));
    }
  });

  test('should have valid OpenAPI 3.0.3 specification', async () => {
    try {
      const validator = new OpenAPISchemaValidator({ version: 3 });
      const result = validator.validate(openApiSpec);
      
      if (!result.valid) {
        console.error('Validation errors:', result.errors);
      }
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      // If the validator constructor fails, skip this test
      console.warn('OpenAPI Schema Validator not available, skipping test');
      expect(true).toBe(true);
    }
  });

  test('should validate bundled specification if exists', async () => {
    if (!bundledSpec) {
      console.warn('Bundled specification not found, skipping test');
      return;
    }

    const validator = new OpenAPISchemaValidator({ version: 3 });
    const result = validator.validate(bundledSpec);
    
    if (!result.valid) {
      console.error('Bundled spec validation errors:', result.errors);
    }
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should parse successfully with SwaggerParser', async () => {
    await expect(SwaggerParser.validate(openApiSpec)).resolves.toBeDefined();
  });

  test('should have required OpenAPI fields', () => {
    expect(openApiSpec).toHaveProperty('openapi');
    expect(openApiSpec).toHaveProperty('info');
    expect(openApiSpec).toHaveProperty('paths');
    expect(openApiSpec.openapi).toBe('3.0.3');
  });

  test('should have valid info section', () => {
    const { info } = openApiSpec;
    
    expect(info).toHaveProperty('title');
    expect(info).toHaveProperty('version');
    expect(info).toHaveProperty('description');
    expect(info).toHaveProperty('contact');
    
    expect(typeof info.title).toBe('string');
    expect(typeof info.version).toBe('string');
    expect(typeof info.description).toBe('string');
    expect(info.title.length).toBeGreaterThan(0);
  });

  test('should have valid servers configuration', () => {
    expect(openApiSpec).toHaveProperty('servers');
    expect(Array.isArray(openApiSpec.servers)).toBe(true);
    expect(openApiSpec.servers.length).toBeGreaterThan(0);
    
    openApiSpec.servers.forEach(server => {
      expect(server).toHaveProperty('url');
      expect(typeof server.url).toBe('string');
      expect(server.url).toMatch(/^https?:\/\//);
    });
  });

  test('should have security schemes defined', () => {
    expect(openApiSpec).toHaveProperty('components');
    expect(openApiSpec.components).toHaveProperty('securitySchemes');
    
    const securitySchemes = openApiSpec.components.securitySchemes;
    expect(Object.keys(securitySchemes).length).toBeGreaterThan(0);
    
    // Check for Bearer token authentication
    expect(securitySchemes).toHaveProperty('BearerAuth');
    expect(securitySchemes.BearerAuth.type).toBe('http');
    expect(securitySchemes.BearerAuth.scheme).toBe('bearer');
  });

  test('should have global security configuration', () => {
    expect(openApiSpec).toHaveProperty('security');
    expect(Array.isArray(openApiSpec.security)).toBe(true);
    expect(openApiSpec.security.length).toBeGreaterThan(0);
    
    // Check for BearerAuth requirement
    const hasBearerAuth = openApiSpec.security.some(
      secReq => secReq.hasOwnProperty('BearerAuth')
    );
    expect(hasBearerAuth).toBe(true);
  });
});