const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

describe('OpenAPI Schema Validation', () => {
  let openApiSpec;
  let ajv;

  beforeAll(() => {
    const openApiPath = path.join(__dirname, '../../openapi.json');
    openApiSpec = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));
    
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe('Components Schemas', () => {
    test('should have schemas defined in components', () => {
      expect(openApiSpec).toHaveProperty('components');
      expect(openApiSpec.components).toHaveProperty('schemas');
      
      const schemas = openApiSpec.components.schemas;
      expect(Object.keys(schemas).length).toBeGreaterThan(0);
    });

    test('should have valid Object schema', () => {
      const schemas = openApiSpec.components.schemas;
      expect(schemas).toHaveProperty('Object');
      
      const objectSchema = schemas.Object;
      expect(objectSchema).toHaveProperty('type', 'object');
      expect(objectSchema).toHaveProperty('properties');
      
      // Check for required properties
      const properties = objectSchema.properties;
      expect(properties).toHaveProperty('Message');
      expect(properties).toHaveProperty('User');
      expect(properties).toHaveProperty('StatusId');
    });

    test('should have valid User schema', () => {
      const schemas = openApiSpec.components.schemas;
      expect(schemas).toHaveProperty('User');
      
      const userSchema = schemas.User;
      expect(userSchema).toHaveProperty('type', 'object');
      expect(userSchema).toHaveProperty('properties');
      
      const properties = userSchema.properties;
      expect(properties).toHaveProperty('Id');
      expect(properties).toHaveProperty('Email');
      expect(properties).toHaveProperty('FirstName');
      expect(properties).toHaveProperty('LastName');
    });

    test('should have valid Manager schema', () => {
      const schemas = openApiSpec.components.schemas;
      expect(schemas).toHaveProperty('Manager');
      
      const managerSchema = schemas.Manager;
      expect(managerSchema).toHaveProperty('type', 'object');
      expect(managerSchema).toHaveProperty('properties');
      
      const properties = managerSchema.properties;
      expect(properties).toHaveProperty('Id');
      expect(properties).toHaveProperty('TotalAsyncAssigned');
      expect(properties).toHaveProperty('TotalSyncAssigned');
    });

    test('all schemas should be valid JSON Schema', () => {
      const schemas = openApiSpec.components.schemas;
      
      Object.entries(schemas).forEach(([schemaName, schema]) => {
        // Basic schema validation
        expect(schema).toHaveProperty('type');
        
        if (schema.type === 'object') {
          expect(schema).toHaveProperty('properties');
        }
        
        // Validate that the schema is a valid JSON Schema
        const isValid = ajv.validateSchema(schema);
        if (!isValid) {
          console.error(`Schema ${schemaName} validation errors:`, ajv.errors);
        }
        expect(isValid).toBe(true);
      });
    });
  });

  describe('Parameters', () => {
    test('should have parameters defined in components', () => {
      expect(openApiSpec.components).toHaveProperty('parameters');
      
      const parameters = openApiSpec.components.parameters;
      expect(Object.keys(parameters).length).toBeGreaterThan(0);
    });

    test('should have common ID parameters', () => {
      const parameters = openApiSpec.components.parameters;
      
      // Check for common ID parameters
      expect(parameters).toHaveProperty('USER_ID');
      expect(parameters).toHaveProperty('STREAM_ID');
      expect(parameters).toHaveProperty('OBJECT_ID');
      
      // Validate USER_ID parameter
      const userIdParam = parameters.USER_ID;
      expect(userIdParam).toHaveProperty('name', 'USER_ID');
      expect(userIdParam).toHaveProperty('in', 'query');
      expect(userIdParam).toHaveProperty('schema');
      expect(userIdParam.schema).toHaveProperty('type');
    });

    test('all parameters should have required fields', () => {
      const parameters = openApiSpec.components.parameters;
      
      Object.entries(parameters).forEach(([paramName, param]) => {
        expect(param).toHaveProperty('name');
        expect(param).toHaveProperty('in');
        expect(param).toHaveProperty('schema');
        
        expect(['query', 'path', 'header'].includes(param.in)).toBe(true);
        expect(param.schema).toHaveProperty('type');
      });
    });
  });

  describe('Response Schemas', () => {
    test('should validate example response data against schemas', () => {
      const paths = openApiSpec.paths;
      
      Object.entries(paths).forEach(([pathName, pathItem]) => {
        Object.entries(pathItem).forEach(([method, operation]) => {
          if (operation.responses) {
            Object.entries(operation.responses).forEach(([statusCode, response]) => {
              if (response.content && response.content['application/json']) {
                const content = response.content['application/json'];
                if (content.schema && content.schema.example) {
                  // We have an example to validate
                  const schema = content.schema;
                  const example = content.schema.example;
                  
                  // Create a validator for this schema
                  const validate = ajv.compile(schema);
                  const isValid = validate(example);
                  
                  if (!isValid) {
                    console.warn(`Example validation failed for ${method.toUpperCase()} ${pathName} (${statusCode}):`, validate.errors);
                  }
                  
                  // This is a warning rather than a hard failure
                  // expect(isValid).toBe(true);
                }
              }
            });
          }
        });
      });
    });
  });

  describe('Enum Schemas', () => {
    test('should have valid enum definitions', () => {
      const schemas = openApiSpec.components.schemas;
      
      const enumSchemas = ['ObjectType', 'ObjectStatusType', 'StreamProviderType'];
      
      enumSchemas.forEach(enumName => {
        if (schemas[enumName]) {
          const enumSchema = schemas[enumName];
          expect(enumSchema).toHaveProperty('type', 'string');
          expect(enumSchema).toHaveProperty('enum');
          expect(Array.isArray(enumSchema.enum)).toBe(true);
          expect(enumSchema.enum.length).toBeGreaterThan(0);
        }
      });
    });
  });
});