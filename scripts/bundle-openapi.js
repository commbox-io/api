const fs = require('fs');
const path = require('path');

// Helper function to merge objects deeply
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

// Load the base OpenAPI structure
const baseSpec = JSON.parse(fs.readFileSync(path.join(__dirname, '../api/openapi-base.json'), 'utf8'));

// Initialize the final spec with base info
const finalSpec = {
  openapi: baseSpec.openapi,
  info: baseSpec.info,
  servers: baseSpec.servers,
  security: baseSpec.security,
  tags: baseSpec.tags,
  paths: {},
  components: {
    schemas: {},
    parameters: {},
    securitySchemes: {},
    responses: {},
    requestBodies: {},
    headers: {},
    examples: {},
    links: {},
    callbacks: {}
  }
};

// Add x-tagGroups if exists
if (baseSpec['x-tagGroups']) {
  finalSpec['x-tagGroups'] = baseSpec['x-tagGroups'];
}

// Function to load path files
function loadPaths(dir) {
  const pathFiles = [
    'core/paths.json',
    'authentication/paths.json',
    'assignments/paths.json',
    'automation/paths.json',
    'forms/paths.json',
    'managers/paths.json',
    'objects/paths.json',
    'presence/paths.json',
    'profiles/paths.json',
    'sms/paths.json',
    'streams/paths.json',
    'tags/paths.json',
    'teams/paths.json',
    'users/paths.json',
    'whatsapp/paths.json'
  ];

  pathFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      try {
        const pathData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (pathData.paths) {
          Object.assign(finalSpec.paths, pathData.paths);
        }
      } catch (err) {
        console.error(`Error loading ${file}:`, err.message);
      }
    }
  });
}

// Function to load components
function loadComponents(dir) {
  const componentsFile = path.join(dir, 'components/components.json');
  if (fs.existsSync(componentsFile)) {
    try {
      const components = JSON.parse(fs.readFileSync(componentsFile, 'utf8'));
      
      // Merge each component type
      Object.keys(components).forEach(componentType => {
        if (finalSpec.components[componentType]) {
          Object.assign(finalSpec.components[componentType], components[componentType]);
        }
      });
    } catch (err) {
      console.error('Error loading components:', err.message);
    }
  }

  // Load schemas separately if they exist
  const schemasFile = path.join(dir, 'components/schemas/schemas.json');
  if (fs.existsSync(schemasFile)) {
    try {
      const schemas = JSON.parse(fs.readFileSync(schemasFile, 'utf8'));
      Object.assign(finalSpec.components.schemas, schemas);
    } catch (err) {
      console.error('Error loading schemas:', err.message);
    }
  }
}

// Main bundling process
console.log('Starting OpenAPI bundling process...');

const apiDir = path.join(__dirname, '../api');

// Load all paths
console.log('Loading paths...');
loadPaths(apiDir);

// Load all components
console.log('Loading components...');
loadComponents(apiDir);

// Clean up empty component sections
Object.keys(finalSpec.components).forEach(key => {
  if (Object.keys(finalSpec.components[key]).length === 0) {
    delete finalSpec.components[key];
  }
});

// Write the bundled specification
const outputPath = path.join(__dirname, '../openapi-bundled.json');
fs.writeFileSync(outputPath, JSON.stringify(finalSpec, null, 2));

console.log(`✓ OpenAPI specification bundled successfully!`);
console.log(`  Output: ${outputPath}`);
console.log(`  Total paths: ${Object.keys(finalSpec.paths).length}`);
console.log(`  Total schemas: ${Object.keys(finalSpec.components.schemas || {}).length}`);

// Also create a YAML version if js-yaml is available
try {
  const yaml = require('js-yaml');
  const yamlStr = yaml.dump(finalSpec, { noRefs: true, lineWidth: -1 });
  fs.writeFileSync(path.join(__dirname, '../openapi-bundled.yaml'), yamlStr);
  console.log(`  YAML version also created: openapi-bundled.yaml`);
} catch (err) {
  console.log('  Note: Install js-yaml to also generate YAML output');
}