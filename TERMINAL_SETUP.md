# Terminal Setup Guide for CommBox API Development

## Prerequisites
- Node.js v18+ and npm v8+ (verified: Node v22.15.0, npm v10.9.2)
- Git for version control
- A text editor (VS Code recommended)
- Terminal/Command Prompt

## Initial Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd commbox/api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your CommBox API token.

## Available Commands

### API Validation
```bash
# Validate OpenAPI specification
npm run validate

# Validate YAML version
npm run validate:yaml

# Lint API specification
npm run lint
```

### Development Server
```bash
# View API documentation in browser
npm run preview

# Start HTTP server
npm run serve
```

### API Testing
```bash
# Test API authentication (update token in .env first)
npm run test:api
```

### Code Formatting
```bash
# Format all JSON, YAML, and Markdown files
npm run format
```

### Build Commands
```bash
# Bundle API specification
npm run bundle
```

## Working with the API

1. **API Base URL**: `https://api.commbox.io`
2. **Authentication**: Bearer token required for all requests
3. **Documentation**: Run `npm run preview` to view interactive API docs

## Project Structure
```
api/
├── openapi.json          # Main OpenAPI specification
├── openapi.yaml          # YAML version
├── commbox.html          # API documentation HTML
├── api/                  # Split API definitions
│   ├── */paths.json      # Endpoint definitions by category
│   └── components/       # Shared components
├── .env.example          # Environment template
└── package.json          # NPM scripts and dependencies
```

## Quick Start Workflow

1. Install dependencies: `npm install`
2. Copy environment file: `cp .env.example .env`
3. Add your API token to `.env`
4. Validate API spec: `npm run validate`
5. View documentation: `npm run preview`

## Troubleshooting

- **npm install fails**: Ensure Node.js v18+ is installed
- **API validation errors**: Run `npm run lint` for detailed issues
- **Authentication errors**: Check your API token in `.env`
- **Port conflicts**: Change PORT in `.env` if 8080 is in use