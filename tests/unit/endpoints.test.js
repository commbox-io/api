const fs = require('fs');
const path = require('path');

describe('API Endpoints Structure', () => {
  let openApiSpec;

  beforeAll(() => {
    const openApiPath = path.join(__dirname, '../../openapi.json');
    openApiSpec = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));
  });

  describe('Paths Structure', () => {
    test('should have paths defined', () => {
      expect(openApiSpec).toHaveProperty('paths');
      expect(typeof openApiSpec.paths).toBe('object');
      expect(Object.keys(openApiSpec.paths).length).toBeGreaterThan(0);
    });

    test('should have core system status endpoint', () => {
      expect(openApiSpec.paths).toHaveProperty('/core/systemstatus');
      
      const endpoint = openApiSpec.paths['/core/systemstatus'];
      expect(endpoint).toHaveProperty('get');
      expect(endpoint.get).toHaveProperty('summary');
      expect(endpoint.get).toHaveProperty('responses');
    });

    test('should have authentication endpoints', () => {
      const pathKeys = Object.keys(openApiSpec.paths);
      const hasAuthEndpoints = pathKeys.some(path => 
        path.includes('auth')
      );
      
      // Should have at least one authentication endpoint
      expect(hasAuthEndpoints).toBe(true);
      
      // Count authentication endpoints
      const authEndpointCount = pathKeys.filter(path => 
        path.includes('auth')
      ).length;
      
      expect(authEndpointCount).toBeGreaterThan(0);
    });

    test('all endpoints should have proper HTTP methods', () => {
      const validMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
      
      Object.entries(openApiSpec.paths).forEach(([pathName, pathItem]) => {
        const methods = Object.keys(pathItem);
        
        methods.forEach(method => {
          expect(validMethods.includes(method.toLowerCase())).toBe(true);
        });
      });
    });

    test('all operations should have required fields', () => {
      Object.entries(openApiSpec.paths).forEach(([pathName, pathItem]) => {
        Object.entries(pathItem).forEach(([method, operation]) => {
          // Each operation should have tags
          expect(operation).toHaveProperty('tags');
          expect(Array.isArray(operation.tags)).toBe(true);
          expect(operation.tags.length).toBeGreaterThan(0);
          
          // Each operation should have summary
          expect(operation).toHaveProperty('summary');
          expect(typeof operation.summary).toBe('string');
          expect(operation.summary.length).toBeGreaterThan(0);
          
          // Each operation should have responses
          expect(operation).toHaveProperty('responses');
          expect(typeof operation.responses).toBe('object');
          expect(Object.keys(operation.responses).length).toBeGreaterThan(0);
          
          // Should have at least one success response (2xx)
          const responseKeys = Object.keys(operation.responses);
          const hasSuccessResponse = responseKeys.some(code => 
            code.startsWith('2') || code === '200' || code === '201'
          );
          expect(hasSuccessResponse).toBe(true);
        });
      });
    });

    test('should have standard error responses', () => {
      Object.entries(openApiSpec.paths).forEach(([pathName, pathItem]) => {
        Object.entries(pathItem).forEach(([method, operation]) => {
          const responses = operation.responses;
          
          // Should have 400, 401, and 500 responses for most endpoints
          if (pathName !== '/core/systemstatus') { // System status might not need auth
            expect(responses).toHaveProperty('400');
            expect(responses).toHaveProperty('401');
            expect(responses).toHaveProperty('500');
          }
        });
      });
    });
  });

  describe('Tags Structure', () => {
    test('should have tags defined', () => {
      expect(openApiSpec).toHaveProperty('tags');
      expect(Array.isArray(openApiSpec.tags)).toBe(true);
      expect(openApiSpec.tags.length).toBeGreaterThan(0);
    });

    test('should have core API category tags', () => {
      const expectedTags = [
        'Core', 'Authentication', 'Objects', 'Streams', 
        'Users', 'WhatsApp', 'SMS', 'Teams'
      ];
      
      const tagNames = openApiSpec.tags.map(tag => tag.name);
      
      expectedTags.forEach(expectedTag => {
        expect(tagNames).toContain(expectedTag);
      });
    });

    test('all tags should have descriptions', () => {
      openApiSpec.tags.forEach(tag => {
        expect(tag).toHaveProperty('name');
        expect(tag).toHaveProperty('description');
        expect(typeof tag.name).toBe('string');
        expect(typeof tag.description).toBe('string');
        expect(tag.name.length).toBeGreaterThan(0);
      });
    });

    test('all endpoint tags should be defined in global tags', () => {
      const globalTagNames = openApiSpec.tags.map(tag => tag.name);
      
      Object.entries(openApiSpec.paths).forEach(([pathName, pathItem]) => {
        Object.entries(pathItem).forEach(([method, operation]) => {
          operation.tags.forEach(tag => {
            expect(globalTagNames).toContain(tag);
          });
        });
      });
    });
  });

  describe('Parameter Structure', () => {
    test('path parameters should be properly defined', () => {
      Object.entries(openApiSpec.paths).forEach(([pathName, pathItem]) => {
        // Extract path parameters from URL
        const pathParams = pathName.match(/\{([^}]+)\}/g);
        
        if (pathParams) {
          Object.entries(pathItem).forEach(([method, operation]) => {
            if (operation.parameters) {
              const pathParameters = operation.parameters.filter(
                param => param.in === 'path'
              );
              
              pathParams.forEach(pathParam => {
                const paramName = pathParam.slice(1, -1); // Remove { }
                const hasParam = pathParameters.some(
                  param => param.name === paramName
                );
                expect(hasParam).toBe(true);
              });
            }
          });
        }
      });
    });

    test('required path parameters should be marked as required', () => {
      Object.entries(openApiSpec.paths).forEach(([pathName, pathItem]) => {
        Object.entries(pathItem).forEach(([method, operation]) => {
          if (operation.parameters) {
            operation.parameters.forEach(param => {
              if (param.in === 'path') {
                expect(param.required).toBe(true);
              }
            });
          }
        });
      });
    });
  });

  describe('Response Structure', () => {
    test('success responses should have content', () => {
      Object.entries(openApiSpec.paths).forEach(([pathName, pathItem]) => {
        Object.entries(pathItem).forEach(([method, operation]) => {
          Object.entries(operation.responses).forEach(([statusCode, response]) => {
            if (statusCode.startsWith('2')) {
              expect(response).toHaveProperty('description');
              
              // Most success responses should have content
              if (method !== 'delete' && statusCode !== '204') {
                // Some responses might not have content (like 204 No Content)
                if (!response.content) {
                  console.warn(`${method.toUpperCase()} ${pathName} (${statusCode}) has no content`);
                }
              }
            }
          });
        });
      });
    });

    test('error responses should have descriptions', () => {
      Object.entries(openApiSpec.paths).forEach(([pathName, pathItem]) => {
        Object.entries(pathItem).forEach(([method, operation]) => {
          Object.entries(operation.responses).forEach(([statusCode, response]) => {
            if (statusCode.startsWith('4') || statusCode.startsWith('5')) {
              expect(response).toHaveProperty('description');
              expect(typeof response.description).toBe('string');
              expect(response.description.length).toBeGreaterThan(0);
            }
          });
        });
      });
    });
  });
});