# Connectors

This plugin provides full n8n workflow automation capabilities.

## Required
- **n8n instance** — Self-hosted or n8n Cloud with API access

## Setup

### 1. Get n8n API Key
1. Log into your n8n instance
2. Go to Settings > API
3. Create new API key

### 2. Set Environment Variables
```bash
export N8N_API_URL="https://your-instance.app.n8n.cloud"
export N8N_API_KEY="your-api-key"
```

### 3. Add MCP to Claude Code
```bash
claude mcp add n8n-mcp \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  -e N8N_API_URL=https://your-instance.app.n8n.cloud \
  -e N8N_API_KEY=your-api-key \
  -- npx n8n-mcp
```

## Optional
- **n8n Skills** — Install for enhanced workflow building: `git clone https://github.com/czlonkowski/n8n-skills.git ~/.claude/skills/n8n-skills`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `N8N_API_URL` | Yes | Your n8n instance URL |
| `N8N_API_KEY` | Yes | API key from n8n Settings > API |
| `MCP_MODE` | Yes | Set to `stdio` for Claude Code |
| `LOG_LEVEL` | Recommended | Set to `error` to reduce noise |
| `DISABLE_CONSOLE_OUTPUT` | Recommended | Set to `true` for cleaner output |

## Resources

- [n8n MCP GitHub](https://github.com/czlonkowski/n8n-mcp)
- [n8n Skills GitHub](https://github.com/czlonkowski/n8n-skills)
- [n8n Documentation](https://docs.n8n.io/)
