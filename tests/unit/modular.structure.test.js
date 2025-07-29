const fs = require('fs');
const path = require('path');

describe('Modular Structure Tests', () => {
  const apiDir = path.join(__dirname, '../../api');

  describe('Directory Structure', () => {
    test('should have api directory', () => {
      expect(fs.existsSync(apiDir)).toBe(true);
      expect(fs.statSync(apiDir).isDirectory()).toBe(true);
    });

    test('should have base configuration file', () => {
      const baseConfigPath = path.join(apiDir, 'openapi-base.json');
      expect(fs.existsSync(baseConfigPath)).toBe(true);
      
      const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, 'utf8'));
      expect(baseConfig).toHaveProperty('openapi');
      expect(baseConfig).toHaveProperty('info');
      expect(baseConfig).toHaveProperty('tags');
    });

    test('should have components directory', () => {
      const componentsDir = path.join(apiDir, 'components');
      expect(fs.existsSync(componentsDir)).toBe(true);
      expect(fs.statSync(componentsDir).isDirectory()).toBe(true);
    });

    test('should have endpoint directories', () => {
      const expectedDirs = [
        'core', 'authentication', 'objects', 'streams', 
        'users', 'whatsapp', 'sms', 'teams'
      ];
      
      expectedDirs.forEach(dirName => {
        const dirPath = path.join(apiDir, dirName);
        expect(fs.existsSync(dirPath)).toBe(true);
        expect(fs.statSync(dirPath).isDirectory()).toBe(true);
      });
    });
  });

  describe('Path Files Structure', () => {
    test('endpoint directories should have paths.json files', () => {
      const endpointDirs = fs.readdirSync(apiDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== 'components')
        .map(dirent => dirent.name);

      endpointDirs.forEach(dirName => {
        const pathsFile = path.join(apiDir, dirName, 'paths.json');
        expect(fs.existsSync(pathsFile)).toBe(true);
        
        const pathsData = JSON.parse(fs.readFileSync(pathsFile, 'utf8'));
        expect(pathsData).toHaveProperty('paths');
        expect(typeof pathsData.paths).toBe('object');
      });
    });

    test('paths.json files should have valid structure', () => {
      const corePathsFile = path.join(apiDir, 'core', 'paths.json');
      const pathsData = JSON.parse(fs.readFileSync(corePathsFile, 'utf8'));
      
      expect(pathsData).toHaveProperty('paths');
      
      Object.entries(pathsData.paths).forEach(([pathName, pathItem]) => {
        expect(pathName).toMatch(/^\/[a-zA-Z0-9\/_{}]+$/);
        
        Object.entries(pathItem).forEach(([method, operation]) => {
          expect(['get', 'post', 'put', 'patch', 'delete'].includes(method)).toBe(true);
          expect(operation).toHaveProperty('tags');
          expect(operation).toHaveProperty('summary');
          expect(operation).toHaveProperty('responses');
        });
      });
    });
  });

  describe('Components Structure', () => {
    test('should have components.json file', () => {
      const componentsFile = path.join(apiDir, 'components', 'components.json');
      expect(fs.existsSync(componentsFile)).toBe(true);
      
      const components = JSON.parse(fs.readFileSync(componentsFile, 'utf8'));
      expect(components).toHaveProperty('securitySchemes');
      expect(components).toHaveProperty('parameters');
      expect(components).toHaveProperty('schemas');
    });

    test('should have schemas directory with schemas.json', () => {
      const schemasFile = path.join(apiDir, 'components', 'schemas', 'schemas.json');
      expect(fs.existsSync(schemasFile)).toBe(true);
      
      const schemas = JSON.parse(fs.readFileSync(schemasFile, 'utf8'));
      expect(typeof schemas).toBe('object');
      expect(Object.keys(schemas).length).toBeGreaterThan(0);
      
      // Check for common schemas
      expect(schemas).toHaveProperty('Object');
      expect(schemas).toHaveProperty('User');
    });
  });

  describe('Bundling Script', () => {
    test('should have bundling script', () => {
      const bundleScript = path.join(__dirname, '../../scripts', 'bundle-openapi.js');
      expect(fs.existsSync(bundleScript)).toBe(true);
    });

    test('bundling script should be executable', () => {
      const bundleScript = path.join(__dirname, '../../scripts', 'bundle-openapi.js');
      const content = fs.readFileSync(bundleScript, 'utf8');
      
      expect(content).toContain('require');
      expect(content).toContain('JSON.parse');
      expect(content).toContain('fs.writeFileSync');
    });
  });

  describe('Package.json Configuration', () => {
    test('should have bundling command in package.json', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageData.scripts).toHaveProperty('bundle:modular');
      expect(packageData.scripts['bundle:modular']).toContain('bundle-openapi.js');
    });

    test('should have build command that includes bundling', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageData.scripts).toHaveProperty('build');
      expect(packageData.scripts.build).toContain('bundle:modular');
    });
  });

  describe('File Consistency', () => {
    test('all path files should use consistent tag names', () => {
      // Load base tags
      const baseConfigPath = path.join(apiDir, 'openapi-base.json');
      const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, 'utf8'));
      const globalTags = baseConfig.tags.map(tag => tag.name);
      
      // Check each endpoint directory
      const endpointDirs = fs.readdirSync(apiDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== 'components')
        .map(dirent => dirent.name);

      endpointDirs.forEach(dirName => {
        const pathsFile = path.join(apiDir, dirName, 'paths.json');
        const pathsData = JSON.parse(fs.readFileSync(pathsFile, 'utf8'));
        
        Object.values(pathsData.paths).forEach(pathItem => {
          Object.values(pathItem).forEach(operation => {
            if (operation.tags) {
              operation.tags.forEach(tag => {
                expect(globalTags).toContain(tag);
              });
            }
          });
        });
      });
    });

    test('schema references should be consistent', () => {
      const schemasFile = path.join(apiDir, 'components', 'schemas', 'schemas.json');
      const schemas = JSON.parse(fs.readFileSync(schemasFile, 'utf8'));
      const schemaNames = Object.keys(schemas);
      
      // Check path files for schema references
      const endpointDirs = fs.readdirSync(apiDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== 'components')
        .map(dirent => dirent.name);

      endpointDirs.forEach(dirName => {
        const pathsFile = path.join(apiDir, dirName, 'paths.json');
        const pathsContent = fs.readFileSync(pathsFile, 'utf8');
        
        // Find schema references in the file
        const schemaRefs = pathsContent.match(/#\/components\/schemas\/(\w+)/g);
        if (schemaRefs) {
          schemaRefs.forEach(ref => {
            const schemaName = ref.split('/').pop();
            expect(schemaNames).toContain(schemaName);
          });
        }
      });
    });
  });
});