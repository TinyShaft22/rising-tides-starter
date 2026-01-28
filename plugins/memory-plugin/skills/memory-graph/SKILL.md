---
name: memory-graph
description: Persistent knowledge graph for storing entities, relations, and observations across sessions. Use for explicit memory management, querying stored knowledge, or manual memory operations.
mcp: memory
---

# Memory Graph (Persistent Knowledge)

Manually manage Claude's persistent memory across sessions.

## Trigger

Invoke when:
- "remember that [fact]"
- "what do you know about [entity]?"
- "update my preferences"
- "memory [operation]"
- "forget [entity]"
- Explicit memory management requests

## How It Works

The Memory MCP maintains a knowledge graph with:
- **Entities** — People, projects, tools, concepts
- **Relations** — How entities connect to each other
- **Observations** — Facts and attributes about entities

Memory persists in: `~/Desktop/claude-memory.jsonl`

## Usage Patterns

### Add Entity
```
Remember: Nick Mohler is the owner
- Runs an AI transformation agency
- Co-hosts AIS+ community
- Uses n8n, Claude Code, GHL
```

### Add Relation
```
Remember: Nick works_with Usman Mohammed
- Both co-host AIS+ community
- Usman handles business side
```

### Add Observation
```
Remember about Nick: prefers concise communication
```

### Query Memory
```
What do you know about the AIS+ community?
```

### Update Entity
```
Update Nick's info: now using Remotion for video
```

### Remove Entry
```
Forget the old project "deprecated-app"
```

## Entity Types

| Type | Examples |
|------|----------|
| **Person** | Nick Mohler, Usman Mohammed |
| **Project** | AIS+ Community, Rising Tides |
| **Tool** | n8n, Claude Code, GHL |
| **Concept** | AI automation, community building |
| **Organization** | Agency, AIS+ community |

## Relation Types

| Relation | Example |
|----------|---------|
| **works_with** | Nick works_with Usman |
| **uses** | Nick uses Claude Code |
| **owns** | Nick owns Agency |
| **member_of** | Member member_of AIS+ |
| **created** | Nick created Skills Pack |

## Example Workflow

1. **After learning something new:**
   - Extract entities from conversation
   - Create entities if they don't exist
   - Add observations about them
   - Create relations between entities

2. **At session start:**
   - Query relevant entities for context
   - Use observations to personalize responses

## Memory File Location

Configure the memory file path when setting up the MCP:

**Paths by platform:**
- Windows (WSL): `/mnt/c/Users/[USERNAME]/Desktop/claude-memory.jsonl`
- Mac: `/Users/[USERNAME]/Desktop/claude-memory.jsonl`
- Linux: `/home/[USERNAME]/Desktop/claude-memory.jsonl`

**View contents:**
```bash
cat ~/Desktop/claude-memory.jsonl | jq .
```

**Why Desktop?**
- Human-readable JSONL format
- Easy to open in VS Code
- Visible reminder of what's stored
- Easy to backup

## Tips

- Be selective — don't store everything
- Use consistent entity names
- Add relations for better context retrieval
- Periodically clean up stale entries
- Include dates for time-sensitive facts

## Automatic vs Manual

**Automatic memory** (when configured):
- Claude may store important facts during conversation
- Retrieves context at session start

**Manual memory** (this skill):
- Explicit "remember this" commands
- Direct queries about stored knowledge
- Cleanup and maintenance operations

## Privacy Note

The memory file is local to your machine. It contains:
- Names and relationships
- Project details
- Preferences and patterns

Review periodically and remove sensitive entries if needed.
