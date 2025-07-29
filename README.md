# CommBox API Documentation

## Overview

CommBox provides a comprehensive REST API for omnichannel communication management. This repository contains the OpenAPI 3.0.3 specification for the CommBox API, which enables integration with various communication channels including Chat, WhatsApp, SMS, Email, and more.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ and npm v8+
- Git for version control
- CommBox API token (obtain from CommBox console → Settings → API)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd commbox/api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your COMMBOX_API_TOKEN
```

## 📁 Project Structure

```
api/
├── openapi.json              # Original monolithic OpenAPI specification
├── openapi-bundled.json      # Generated bundled specification from modular files
├── api/                      # Modular API specification
│   ├── openapi-base.json     # Base configuration
│   ├── core/                 # Core endpoints
│   ├── authentication/       # Authentication endpoints
│   ├── objects/              # Conversation management
│   ├── streams/              # Communication channels
│   ├── users/                # User management
│   ├── whatsapp/             # WhatsApp integration
│   └── components/           # Shared schemas and components
├── scripts/                  # Build and utility scripts
└── docs/                     # Additional documentation
```

## 🛠️ Available Commands

### Development
```bash
# Bundle modular files into a single specification
npm run build

# Validate the OpenAPI specification
npm run validate:bundled

# Preview API documentation in browser
npm run preview

# Format all JSON/YAML files
npm run format

# Lint the API specification
npm run lint
```

### Testing
```bash
# Test API authentication (requires valid token in .env)
npm run test:api

# Validate original specification
npm run validate

# Validate YAML version
npm run validate:yaml
```

## 📚 API Documentation

### Base URL
```
https://api.commbox.io
```

### Authentication
All API requests require Bearer token authentication:

```bash
curl -X GET https://api.commbox.io/v2/authentication/me \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Main API Categories

1. **Core** - System status and health checks
2. **Authentication** - Token management and ticket generation
3. **Objects** - Conversation management
4. **Streams** - Communication channel configuration
5. **Users** - Customer and agent management
6. **WhatsApp** - WhatsApp Business API integration
7. **SMS** - Text messaging capabilities
8. **Teams** - Agent group management
9. **Automation** - Bot and workflow automation

### Example: Creating a Conversation

```bash
curl -X POST https://api.commbox.io/streams/{STREAM_ID}/objects \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "Message": "Hello, I need help with my order",
    "User": {
      "FirstName": "John",
      "LastName": "Doe",
      "Email": "john.doe@example.com",
      "Phone1": "972501234567"
    }
  }'
```

## 🔧 Working with the Modular Structure

The API specification is organized into modules for better maintainability:

### Making Changes

1. **Modify endpoints**: Edit the relevant `paths.json` file in the appropriate directory
2. **Update schemas**: Edit `api/components/schemas/schemas.json`
3. **Add parameters**: Edit `api/components/components.json`

### Building After Changes

```bash
# Bundle and validate
npm run build

# This will:
# 1. Combine all modular files
# 2. Generate openapi-bundled.json
# 3. Validate the specification
# 4. Create a YAML version
```

## 📋 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# API Authentication
COMMBOX_API_TOKEN=your_api_token_here
COMMBOX_API_BASE_URL=https://api.commbox.io

# Development Server
PORT=8080
NODE_ENV=development

# API Testing
TEST_ACCOUNT_ID=your_test_account_id
TEST_CHANNEL_ID=your_test_channel_id
```

## 🧪 Testing the API

### 1. System Status Check
```bash
curl https://api.commbox.io/core/systemstatus
```

### 2. Authentication Test
```bash
npm run test:api
```

### 3. Interactive API Explorer
```bash
npm run preview
# Opens http://localhost:8080/commbox.html
```

## 📖 Additional Resources

- [API Overview](./API_OVERVIEW.md) - Detailed API introduction
- [Endpoint Index](./ENDPOINT_INDEX.md) - Complete list of all endpoints
- [Modular Structure Guide](./MODULAR_OPENAPI_GUIDE.md) - Working with modular files
- [MCP Integration](./MCP_INTEGRATION.md) - Model Context Protocol integration
- [Terminal Setup](./TERMINAL_SETUP.md) - Development environment setup
- [Full API Documentation](./API_DOCUMENTATION_FULL.md) - Complete API reference with examples

## 🤝 Contributing

1. Make changes in the modular files under `api/`
2. Run `npm run build` to bundle and validate
3. Test your changes using the preview server
4. Ensure all validations pass before committing

## 📝 License

Please refer to the [CommBox End User License Agreement](https://www.commbox.io/end-user-license-agreement-eula/)

## 🆘 Support

- **Documentation**: https://docs.commbox.io
- **Contact**: contactus@CommBox.io
- **API Status**: Check `/core/systemstatus` endpoint

