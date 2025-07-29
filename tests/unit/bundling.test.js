const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

describe('Bundling Process Tests', () => {
  const bundledPath = path.join(__dirname, '../../openapi-bundled.json');
  const originalPath = path.join(__dirname, '../../openapi.json');

  describe('Bundle Generation', () => {
    test('should generate bundled file when running bundle script', async () => {
      // Remove bundled file if it exists
      if (fs.existsSync(bundledPath)) {
        fs.unlinkSync(bundledPath);
      }

      // Run the bundling command
      await execAsync('npm run bundle:modular', { 
        cwd: path.join(__dirname, '../..'),
        timeout: 30000 
      });

      // Check that bundled file was created
      expect(fs.existsSync(bundledPath)).toBe(true);
    }, 40000);

    test('bundled file should be valid JSON', () => {
      if (!fs.existsSync(bundledPath)) {
        console.warn('Bundled file does not exist, skipping test');
        return;
      }

      const content = fs.readFileSync(bundledPath, 'utf8');
      let bundledSpec;
      
      expect(() => {
        bundledSpec = JSON.parse(content);
      }).not.toThrow();

      expect(bundledSpec).toBeDefined();
      expect(typeof bundledSpec).toBe('object');
    });

    test('bundled file should have all required OpenAPI fields', () => {
      if (!fs.existsSync(bundledPath)) {
        console.warn('Bundled file does not exist, skipping test');
        return;
      }

      const bundledSpec = JSON.parse(fs.readFileSync(bundledPath, 'utf8'));

      expect(bundledSpec).toHaveProperty('openapi');
      expect(bundledSpec).toHaveProperty('info');
      expect(bundledSpec).toHaveProperty('paths');
      expect(bundledSpec).toHaveProperty('components');
      expect(bundledSpec).toHaveProperty('tags');
      expect(bundledSpec).toHaveProperty('servers');
      expect(bundledSpec).toHaveProperty('security');
    });
  });

  describe('Content Comparison', () => {
    test('bundled file should have same number of paths as original', () => {
      if (!fs.existsSync(bundledPath) || !fs.existsSync(originalPath)) {
        console.warn('Required files do not exist, skipping test');
        return;
      }

      const bundledSpec = JSON.parse(fs.readFileSync(bundledPath, 'utf8'));
      const originalSpec = JSON.parse(fs.readFileSync(originalPath, 'utf8'));

      const bundledPaths = Object.keys(bundledSpec.paths);
      const originalPaths = Object.keys(originalSpec.paths);

      expect(bundledPaths.length).toBe(originalPaths.length);
    });

    test('bundled file should have same schemas as components', () => {
      if (!fs.existsSync(bundledPath)) {
        console.warn('Bundled file does not exist, skipping test');
        return;
      }

      const bundledSpec = JSON.parse(fs.readFileSync(bundledPath, 'utf8'));
      const schemasFile = path.join(__dirname, '../../api/components/schemas/schemas.json');
      
      if (fs.existsSync(schemasFile)) {
        const modularSchemas = JSON.parse(fs.readFileSync(schemasFile, 'utf8'));
        
        expect(bundledSpec.components).toHaveProperty('schemas');
        
        // Check that all modular schemas are in bundled file
        Object.keys(modularSchemas).forEach(schemaName => {
          expect(bundledSpec.components.schemas).toHaveProperty(schemaName);
        });
      }
    });

    test('bundled file should include all modular paths', () => {
      if (!fs.existsSync(bundledPath)) {
        console.warn('Bundled file does not exist, skipping test');
        return;
      }

      const bundledSpec = JSON.parse(fs.readFileSync(bundledPath, 'utf8'));
      const apiDir = path.join(__dirname, '../../api');
      
      // Get all endpoint directories
      const endpointDirs = fs.readdirSync(apiDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== 'components')
        .map(dirent => dirent.name);

      // Collect all paths from modular files
      const modularPaths = {};
      endpointDirs.forEach(dirName => {
        const pathsFile = path.join(apiDir, dirName, 'paths.json');
        if (fs.existsSync(pathsFile)) {
          const pathsData = JSON.parse(fs.readFileSync(pathsFile, 'utf8'));
          Object.assign(modularPaths, pathsData.paths);
        }
      });

      // Check that all modular paths are in bundled file
      Object.keys(modularPaths).forEach(pathName => {
        expect(bundledSpec.paths).toHaveProperty(pathName);
      });
    });
  });

  describe('Build Process', () => {
    test('build command should run without errors', async () => {
      let error;
      let stdout;
      let stderr;

      try {
        const result = await execAsync('npm run build', { 
          cwd: path.join(__dirname, '../..'),
          timeout: 30000 
        });
        stdout = result.stdout;
        stderr = result.stderr;
      } catch (err) {
        error = err;
        stdout = err.stdout;
        stderr = err.stderr;
      }

      if (error) {
        console.error('Build error:', error.message);
        console.error('Stdout:', stdout);
        console.error('Stderr:', stderr);
      }

      expect(error).toBeFalsy();
      expect(stdout).toContain('OpenAPI specification bundled successfully');
    }, 40000);

    test('validation should pass after bundling', async () => {
      // Ensure we have a bundled file
      if (!fs.existsSync(bundledPath)) {
        await execAsync('npm run bundle:modular', { 
          cwd: path.join(__dirname, '../..'),
          timeout: 30000 
        });
      }

      let error;
      let stdout;

      try {
        const result = await execAsync('npm run validate:bundled', { 
          cwd: path.join(__dirname, '../..'),
          timeout: 30000 
        });
        stdout = result.stdout;
      } catch (err) {
        error = err;
        stdout = err.stdout;
      }

      if (error) {
        console.error('Validation error:', error.message);
        console.error('Stdout:', stdout);
      }

      expect(error).toBeFalsy();
      expect(stdout).toContain('is valid');
    }, 40000);
  });

  describe('File Integrity', () => {
    test('bundled file should not contain $ref references to local files', () => {
      if (!fs.existsSync(bundledPath)) {
        console.warn('Bundled file does not exist, skipping test');
        return;
      }

      const bundledContent = fs.readFileSync(bundledPath, 'utf8');
      
      // Should not contain references to local files
      expect(bundledContent).not.toMatch(/\$ref.*\.json/);
      expect(bundledContent).not.toMatch(/\$ref.*\.yaml/);
      expect(bundledContent).not.toMatch(/\$ref.*\.yml/);
    });

    test('bundled file should be reasonably sized', () => {
      if (!fs.existsSync(bundledPath)) {
        console.warn('Bundled file does not exist, skipping test');
        return;
      }

      const stats = fs.statSync(bundledPath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      // File should be reasonable size (not empty, not too large)
      expect(fileSizeInMB).toBeGreaterThan(0.01); // At least 10KB
      expect(fileSizeInMB).toBeLessThan(50); // Less than 50MB
    });
  });
});