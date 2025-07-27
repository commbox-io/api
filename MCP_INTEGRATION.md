# CommBox API MCP Integration Guide

## What is MCP?

The Model Context Protocol (MCP) is a standard for connecting AI models with external data sources and tools. This guide shows how to integrate CommBox API with MCP clients for AI-powered conversation management.

## MCP Server Configuration

### Basic Configuration

```json
{
  "name": "commbox",
  "description": "CommBox omnichannel communication platform API",
  "version": "1.0.0",
  "protocol": {
    "version": "1.0"
  },
  "capabilities": {
    "tools": true,
    "resources": true,
    "prompts": true
  },
  "server": {
    "endpoint": "https://api.commbox.io",
    "authentication": {
      "type": "bearer",
      "header": "Authorization",
      "prefix": "Bearer"
    }
  }
}
```

### Environment Variables

```bash
# Set your CommBox API token
export COMMBOX_API_TOKEN="your_bearer_token_here"
export COMMBOX_BASE_URL="https://api.commbox.io"
```

## Available MCP Tools

### 1. Conversation Management Tools

#### `get_conversations`
Retrieve conversations from a specific stream.

```json
{
  "name": "get_conversations",
  "description": "Get conversations from a CommBox stream within a time range",
  "parameters": {
    "stream_id": {
      "type": "string",
      "description": "The stream ID to get conversations from"
    },
    "start_time": {
      "type": "integer", 
      "description": "Unix timestamp for start time"
    },
    "end_time": {
      "type": "integer",
      "description": "Unix timestamp for end time"
    }
  }
}
```

#### `get_conversation_transcript`
Get the full transcript of a conversation.

```json
{
  "name": "get_conversation_transcript",
  "description": "Get the transcript of a specific conversation",
  "parameters": {
    "stream_id": {
      "type": "string",
      "description": "The stream ID"
    },
    "object_id": {
      "type": "string", 
      "description": "The conversation object ID"
    }
  }
}
```

### 2. WhatsApp Automation Tools

#### `send_whatsapp_template`
Send WhatsApp template messages.

```json
{
  "name": "send_whatsapp_template",
  "description": "Send a WhatsApp template message",
  "parameters": {
    "stream_id": {
      "type": "string",
      "description": "Encrypted WhatsApp stream ID"
    },
    "template_id": {
      "type": "string",
      "description": "WhatsApp template ID"
    },
    "recipient": {
      "type": "string",
      "description": "Recipient phone number"
    },
    "parameters": {
      "type": "object",
      "description": "Template parameters"
    }
  }
}
```

### 3. Tag Management Tools

#### `apply_conversation_tag`
Apply tags to conversations for categorization.

```json
{
  "name": "apply_conversation_tag",
  "description": "Apply a tag to a conversation",
  "parameters": {
    "tag_id": {
      "type": "string",
      "description": "The tag ID to apply"
    },
    "object_id": {
      "type": "string",
      "description": "The conversation object ID"
    }
  }
}
```

### 4. User Management Tools

#### `get_user_profile`
Retrieve user profile information.

```json
{
  "name": "get_user_profile", 
  "description": "Get user profile information",
  "parameters": {
    "user_id": {
      "type": "string",
      "description": "The user ID"
    }
  }
}
```

## MCP Resources

### 1. Stream Resources

Access to communication channels and their metadata.

```json
{
  "name": "streams",
  "description": "CommBox communication streams/channels",
  "uri_template": "commbox://streams/{stream_id}",
  "mime_type": "application/json"
}
```

### 2. Conversation Resources

Access to individual conversations and their content.

```json
{
  "name": "conversations",
  "description": "Individual conversations in CommBox",
  "uri_template": "commbox://conversations/{stream_id}/{object_id}",
  "mime_type": "application/json"
}
```

### 3. User Resources

Access to user profiles and identities.

```json
{
  "name": "users", 
  "description": "CommBox user profiles and identities",
  "uri_template": "commbox://users/{user_id}",
  "mime_type": "application/json"
}
```

## Example MCP Implementation

### Python MCP Server Example

```python
#!/usr/bin/env python3
import asyncio
import json
import os
from typing import Any, Dict, List
import httpx
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import mcp.types as types

class CommBoxMCPServer:
    def __init__(self):
        self.api_token = os.getenv("COMMBOX_API_TOKEN")
        self.base_url = os.getenv("COMMBOX_BASE_URL", "https://api.commbox.io")
        self.client = httpx.AsyncClient(
            headers={"Authorization": f"Bearer {self.api_token}"}
        )
    
    async def get_conversations(self, stream_id: str, start_time: int, end_time: int):
        """Get conversations from a stream"""
        response = await self.client.get(
            f"{self.base_url}/streams/{stream_id}/objects",
            params={
                "unixStartTime": start_time,
                "unixEndTime": end_time
            }
        )
        return response.json()
    
    async def get_transcript(self, stream_id: str, object_id: str):
        """Get conversation transcript"""
        response = await self.client.get(
            f"{self.base_url}/streams/{stream_id}/objects/{object_id}/transcript"
        )
        return response.json()
    
    async def send_whatsapp_template(self, stream_id: str, template_data: Dict[str, Any]):
        """Send WhatsApp template message"""
        response = await self.client.post(
            f"{self.base_url}/emarsys/sendwhatsapptemplate/{stream_id}",
            json=template_data
        )
        return response.json()
    
    async def apply_tag(self, tag_id: str, object_id: str):
        """Apply tag to conversation"""
        response = await self.client.post(
            f"{self.base_url}/tags/{tag_id}/objects/{object_id}"
        )
        return response.json()

# Initialize MCP server
server = Server("commbox")
commbox = CommBoxMCPServer()

@server.list_tools()
async def handle_list_tools() -> List[types.Tool]:
    """List available tools"""
    return [
        types.Tool(
            name="get_conversations",
            description="Get conversations from a CommBox stream within a time range",
            inputSchema={
                "type": "object",
                "properties": {
                    "stream_id": {"type": "string"},
                    "start_time": {"type": "integer"},
                    "end_time": {"type": "integer"}
                },
                "required": ["stream_id", "start_time", "end_time"]
            }
        ),
        types.Tool(
            name="get_conversation_transcript", 
            description="Get the transcript of a specific conversation",
            inputSchema={
                "type": "object",
                "properties": {
                    "stream_id": {"type": "string"},
                    "object_id": {"type": "string"}
                },
                "required": ["stream_id", "object_id"]
            }
        ),
        types.Tool(
            name="send_whatsapp_template",
            description="Send a WhatsApp template message",
            inputSchema={
                "type": "object", 
                "properties": {
                    "stream_id": {"type": "string"},
                    "template_data": {"type": "object"}
                },
                "required": ["stream_id", "template_data"]
            }
        ),
        types.Tool(
            name="apply_conversation_tag",
            description="Apply a tag to a conversation",
            inputSchema={
                "type": "object",
                "properties": {
                    "tag_id": {"type": "string"},
                    "object_id": {"type": "string"}
                },
                "required": ["tag_id", "object_id"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[types.TextContent]:
    """Handle tool calls"""
    
    if name == "get_conversations":
        result = await commbox.get_conversations(
            arguments["stream_id"],
            arguments["start_time"], 
            arguments["end_time"]
        )
        return [types.TextContent(type="text", text=json.dumps(result, indent=2))]
    
    elif name == "get_conversation_transcript":
        result = await commbox.get_transcript(
            arguments["stream_id"],
            arguments["object_id"]
        )
        return [types.TextContent(type="text", text=json.dumps(result, indent=2))]
    
    elif name == "send_whatsapp_template":
        result = await commbox.send_whatsapp_template(
            arguments["stream_id"],
            arguments["template_data"]
        )
        return [types.TextContent(type="text", text=json.dumps(result, indent=2))]
    
    elif name == "apply_conversation_tag":
        result = await commbox.apply_tag(
            arguments["tag_id"],
            arguments["object_id"]
        )
        return [types.TextContent(type="text", text=json.dumps(result, indent=2))]
    
    else:
        raise ValueError(f"Unknown tool: {name}")

async def main():
    # Run the server using stdin/stdout streams
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="commbox",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    asyncio.run(main())
```

## Use Cases for AI Integration

### 1. Intelligent Conversation Routing

```python
async def intelligent_routing(conversation_data):
    """Use AI to route conversations to appropriate agents"""
    
    # Get conversation transcript
    transcript = await commbox.get_transcript(
        conversation_data["stream_id"], 
        conversation_data["object_id"]
    )
    
    # Analyze with AI model
    analysis = ai_model.analyze_conversation(transcript)
    
    # Apply appropriate tags
    if analysis.category == "technical_support":
        await commbox.apply_tag("tech_support_tag_id", conversation_data["object_id"])
    elif analysis.urgency == "high":
        await commbox.apply_tag("urgent_tag_id", conversation_data["object_id"])
```

### 2. Automated Response Generation

```python
async def generate_response_suggestions(stream_id: str, object_id: str):
    """Generate AI response suggestions for agents"""
    
    # Get conversation context
    transcript = await commbox.get_transcript(stream_id, object_id)
    
    # Generate contextual response suggestions
    suggestions = ai_model.generate_responses(
        conversation_history=transcript,
        tone="professional",
        max_responses=3
    )
    
    return suggestions
```

### 3. Sentiment Analysis and Escalation

```python
async def monitor_conversation_sentiment(stream_id: str, object_id: str):
    """Monitor conversation sentiment for escalation"""
    
    transcript = await commbox.get_transcript(stream_id, object_id)
    sentiment = ai_model.analyze_sentiment(transcript)
    
    if sentiment.score < 0.3:  # Negative sentiment
        # Auto-tag for manager review
        await commbox.apply_tag("negative_sentiment_tag_id", object_id)
        
        # Could also trigger manager notification
        return {"action": "escalate", "reason": "negative_sentiment", "score": sentiment.score}
```

## Getting Started

1. **Install MCP SDK**: `pip install mcp`
2. **Set Environment Variables**: Configure your CommBox API token
3. **Implement MCP Server**: Use the example above as a starting point
4. **Test Integration**: Start with simple tools like conversation retrieval
5. **Add AI Logic**: Integrate your AI models with the MCP tools

## Best Practices

- **Rate Limiting**: Respect CommBox API rate limits
- **Error Handling**: Implement proper error handling for API failures
- **Caching**: Cache frequently accessed data to reduce API calls
- **Security**: Never expose API tokens in logs or client-side code
- **Monitoring**: Log MCP tool usage for debugging and optimization

## Support

For MCP integration support:
- Review the CommBox API documentation in `README.md`
- Check the endpoint reference in `ENDPOINT_INDEX.md`
- Contact CommBox support for API-specific questions
- Refer to MCP protocol documentation for client integration details