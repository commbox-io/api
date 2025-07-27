# CommBox API Overview

## Table of Contents
- [Introduction](#introduction)
- [API Architecture](#api-architecture)
- [Authentication](#authentication)
- [API Categories](#api-categories)
- [Quick Start Guide](#quick-start-guide)
- [MCP Client Integration](#mcp-client-integration)
- [File Structure](#file-structure)

## Introduction

The CommBox API provides comprehensive access to CommBox's omnichannel communication platform. This REST API allows developers to integrate with CommBox's conversation management, automation, and customer engagement features across multiple communication channels including Chat, WhatsApp, SMS, Email, and more.

**Base URL:** `https://api.commbox.io`

## API Architecture

### OpenAPI Specification
- **Version:** 3.0.3
- **Total Endpoints:** 48 API paths
- **Categories:** 15 functional areas
- **Authentication:** Bearer Token (BearerAuth)
- **Security:** HTTPS only, all requests logged and validated

### Communication Channels Supported
- Web Chat
- WhatsApp Business API (WABA)
- SMS/Text messaging
- Email
- Facebook Messenger
- And more...

## Authentication

All API requests require Bearer Token authentication:

```http
Authorization: Bearer YOUR_API_TOKEN
```

**Obtaining API Keys:**
1. Navigate to CommBox console → Settings → API
2. Admin privileges required
3. API keys auto-rotate on a preset schedule
4. 30-day grace period for key transitions

## API Categories

### 1. **Core** (1 endpoint)
System-wide verification and status monitoring
- `GET /core/systemstatus` - Check system operational status

### 2. **Objects** (12 endpoints)
Conversation management between agents/bots and customers
- Create, read, update conversations
- Manage conversation transcripts and activities
- Handle conversation status and content

### 3. **Streams** (4 endpoints)
Communication channel management
- Check channel availability
- Retrieve stream objects and statistics
- Monitor SLA exceptions

### 4. **Users** (2 endpoints)
Customer and business user management
- User profile management
- Identity management across channels

### 5. **Managers** (3 endpoints)
Business persona management (Admins, Agents, Team Leaders)
- Manager profiles and assignments
- Team management
- Presence status

### 6. **Profiles** (4 endpoints)
System permissions and agent capabilities
- Permission groups
- Role-based access control

### 7. **Presence** (3 endpoints)
Agent availability and status management
- Online/Offline status
- Custom availability states
- Activity monitoring

### 8. **Teams** (2 endpoints)
Agent team organization and management
- Team creation and management
- Team-specific permissions and filters

### 9. **Assignments** (1 endpoint)
Conversation assignment to agents
- Manual and automatic assignment rules

### 10. **Tags** (5 endpoints)
Conversation and user classification
- Tag management and organization
- Conversation labeling and filtering

### 11. **SMS** (2 endpoints)
Text message communication
- Requires customer opt-in
- Send and manage SMS conversations

### 12. **WhatsApp** (5 endpoints)
WhatsApp Business API integration
- Template management
- Message sending
- WABA compliance features

### 13. **Forms** (2 endpoints)
Digital form creation and management
- Form link generation
- Customer form completion tracking

### 14. **Authentication** (1 endpoint)
API authentication and ticket management
- Access token validation

### 15. **Automation** (2 endpoints)
Bot and automation capabilities
- Context management
- Flow control and navigation

## Quick Start Guide

### 1. Get Your API Key
```bash
# Contact your CommBox admin to obtain API credentials
export COMMBOX_TOKEN="your_bearer_token_here"
```

### 2. Check System Status
```bash
curl -H "Authorization: Bearer $COMMBOX_TOKEN" \
     https://api.commbox.io/core/systemstatus
```

### 3. List Stream Objects
```bash
curl -H "Authorization: Bearer $COMMBOX_TOKEN" \
     "https://api.commbox.io/streams/{STREAM_ID}/objects?unixStartTime=1609459200&unixEndTime=1609545600"
```

### 4. Send WhatsApp Message
```bash
curl -X POST \
     -H "Authorization: Bearer $COMMBOX_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello from CommBox!"}' \
     https://api.commbox.io/whatsapp/send/{STREAM_ID}
```

## MCP Client Integration

### MCP (Model Context Protocol) Compatibility

The CommBox API is designed to be compatible with MCP clients for AI model integration:

#### Server Configuration
```json
{
  "name": "commbox-api",
  "endpoint": "https://api.commbox.io",
  "authentication": {
    "type": "bearer",
    "token": "${COMMBOX_API_TOKEN}"
  },
  "capabilities": [
    "conversation_management",
    "multi_channel_messaging", 
    "automation_control",
    "analytics_access"
  ]
}
```

#### Key MCP Use Cases

1. **Conversation Analysis**
   - Access conversation transcripts via Objects API
   - Analyze customer sentiment and patterns
   - Generate automated insights

2. **Automated Response Generation**
   - Use AI to craft contextual responses
   - Integrate with WhatsApp/SMS automation
   - Maintain conversation context

3. **Intelligent Routing**
   - Analyze conversation content for smart agent assignment
   - Use Tags API for automatic categorization
   - Optimize team workload distribution

4. **Real-time Assistance**
   - Monitor ongoing conversations
   - Provide AI-suggested responses to agents
   - Escalation pattern detection

#### MCP Integration Example
```python
# Example MCP client integration
import mcp

client = mcp.Client("commbox-api")

# Get active conversations
conversations = client.call("GET", "/streams/{stream_id}/objects", {
    "unixStartTime": start_time,
    "unixEndTime": end_time
})

# Analyze with AI model
for conv in conversations:
    transcript = client.call("GET", f"/streams/{stream_id}/objects/{conv.id}/transcript")
    sentiment = ai_model.analyze_sentiment(transcript)
    
    # Auto-tag based on AI analysis
    if sentiment.score < 0.3:
        client.call("POST", f"/tags/{tag_id}/objects/{conv.id}")
```

## File Structure

### Refactored Organization
```
/
├── README.md                  # Original comprehensive documentation
├── API_OVERVIEW.md           # This overview document
├── Commbox.json              # Original monolithic specification
├── openapi.yaml              # Main OpenAPI spec (assembled)
├── openapi.json              # Main OpenAPI spec (JSON format)
└── api/                      # Modular API organization
    ├── core/paths.json       # System status endpoints
    ├── objects/paths.json    # Conversation management
    ├── streams/paths.json    # Channel management
    ├── users/paths.json      # User management
    ├── managers/paths.json   # Business user management
    ├── profiles/paths.json   # Permission management
    ├── presence/paths.json   # Availability management
    ├── teams/paths.json      # Team organization
    ├── assignments/paths.json # Assignment management
    ├── tags/paths.json       # Classification system
    ├── sms/paths.json        # SMS messaging
    ├── whatsapp/paths.json   # WhatsApp integration
    ├── forms/paths.json      # Digital forms
    ├── authentication/paths.json # Auth management
    ├── automation/paths.json # Bot capabilities
    └── components/           # Shared components
        ├── components.json   # All components
        ├── schemas/          # Data schemas
        ├── security-schemes.json # Auth schemes
        └── split_summary.json # Organization summary
```

### Benefits of Modular Structure

1. **Maintainability**: Each API category in separate file
2. **Team Collaboration**: Different teams can work on different API areas
3. **Version Control**: Granular change tracking per API category
4. **Documentation**: Easier to document and understand specific areas
5. **Testing**: Isolated testing of API categories
6. **Deployment**: Selective deployment of API changes

## Rate Limiting and Best Practices

- **Throttling**: 429 status code indicates too many requests
- **Pagination**: Use sorting and limiting parameters for large datasets
- **Error Handling**: Comprehensive HTTP status codes (400, 401, 404, 429, 500, 501)
- **Security**: API tokens should be kept secure and rotated regularly

## Support and Resources

- **Base Documentation**: See `README.md` for comprehensive API details
- **OpenAPI Specification**: Use `openapi.yaml` for tool integration
- **Postman Collection**: Import for API testing and exploration
- **Support**: Contact CommBox support for API assistance

---

*This overview provides a high-level understanding of the CommBox API structure and capabilities. For detailed endpoint documentation, refer to the comprehensive `README.md` file and individual API category files.*