# Memory Plugin

Provides persistent memory across Claude Code sessions using the `@anthropic-ai/mcp-server-memory` MCP.

## Default Behavior

The memory MCP server uses its default storage location. No configuration needed.

## Custom Storage Path (Optional)

To use a custom memory file location, edit `.mcp.json`:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-memory"],
      "env": {
        "MEMORY_FILE": "/path/to/your/memory.jsonl"
      }
    }
  }
}
```

**Note:** On Windows, use forward slashes or escaped backslashes:
- `C:/Users/YourName/.claude/memory.jsonl`
- `C:\\Users\\YourName\\.claude\\memory.jsonl`

## Usage

Once installed, Claude can:
- Remember information across sessions
- Recall previous context and decisions
- Build persistent knowledge about your projects
