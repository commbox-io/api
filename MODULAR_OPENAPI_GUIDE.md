# Modular OpenAPI Structure Guide

## Overview
The CommBox API specification has been organized into a modular structure for better maintainability. Instead of one large 25MB+ file, the API is now split into logical components.

## Directory Structure
```
api/
├── openapi-base.json         # Base configuration (info, servers, tags)
├── core/
│   └── paths.json           # Core API endpoints
├── authentication/
│   └── paths.json           # Authentication endpoints
├── assignments/
│   └── paths.json           # Assignment endpoints
├── automation/
│   └── paths.json           # Automation endpoints
├── forms/
│   └── paths.json           # Forms endpoints
├── managers/
│   └── paths.json           # Manager endpoints
├── objects/
│   └── paths.json           # Object (conversation) endpoints
├── presence/
│   └── paths.json           # Presence endpoints
├── profiles/
│   └── paths.json           # Profile endpoints
├── sms/
│   └── paths.json           # SMS endpoints
├── streams/
│   └── paths.json           # Stream endpoints
├── tags/
│   └── paths.json           # Tag endpoints
├── teams/
│   └── paths.json           # Team endpoints
├── users/
│   └── paths.json           # User endpoints
├── whatsapp/
│   └── paths.json           # WhatsApp endpoints
└── components/
    ├── components.json      # All component definitions
    ├── schemas/
    │   └── schemas.json     # Schema definitions
    └── security-schemes.json # Security schemes
```

## Working with the Modular Structure

### 1. Making Changes
To modify an endpoint:
1. Find the relevant category folder (e.g., `api/users/` for user endpoints)
2. Edit the `paths.json` file in that folder
3. Follow the existing structure and formatting

To modify schemas or components:
1. Edit `api/components/schemas/schemas.json` for data models
2. Edit `api/components/components.json` for parameters, responses, etc.

### 2. Building the Complete Specification
After making changes, run:
```bash
npm run build
```

This will:
1. Bundle all modular files into `openapi-bundled.json`
2. Validate the bundled specification
3. Generate a YAML version (`openapi-bundled.yaml`)

### 3. Validating Changes
```bash
# Validate the bundled specification
npm run validate:bundled

# Validate the original monolithic file
npm run validate

# Lint the specification for best practices
npm run lint
```

### 4. Previewing the API Documentation
```bash
# Start a local server to view the API docs
npm run preview
```

## Best Practices

### When Adding New Endpoints
1. Add endpoints to the appropriate category's `paths.json`
2. Keep related endpoints together
3. Use consistent naming conventions
4. Reference shared components using internal references

### When Adding New Schemas
1. Add schemas to `api/components/schemas/schemas.json`
2. Use descriptive names
3. Add proper descriptions for all properties
4. Reference other schemas when appropriate

### Example: Adding a New Endpoint
```json
// In api/users/paths.json
{
  "paths": {
    "/users/{USER_ID}/new-feature": {
      "get": {
        "tags": ["Users"],
        "summary": "Get user's new feature",
        "operationId": "getUserNewFeature",
        "parameters": [
          {
            "name": "USER_ID",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewFeature"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Benefits of Modular Structure

1. **Maintainability**: Easier to find and modify specific endpoints
2. **Collaboration**: Multiple developers can work on different modules
3. **Version Control**: Smaller diffs, easier to review changes
4. **Performance**: Faster to load and edit individual files
5. **Organization**: Logical grouping of related endpoints

## Migration from Monolithic File

The original `openapi.json` is preserved for backward compatibility. The modular structure in the `api/` directory is the recommended way to work with the specification going forward.

To ensure your changes are reflected everywhere:
1. Make changes in the modular files
2. Run `npm run build` to generate the bundled version
3. The bundled version can be used anywhere the original file was used