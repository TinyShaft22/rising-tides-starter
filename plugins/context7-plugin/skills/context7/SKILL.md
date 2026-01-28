---
name: context7
description: Pull live, up-to-date documentation for any library or framework. Use when you need current API references, before generating code for unfamiliar libraries, or when explicitly asked for docs.
mcp: context7
---

# Context7 (Live Documentation)

Pull live, up-to-date documentation for any library or framework.

## Trigger

Invoke when:
- "get docs for [library]"
- "pull [library] documentation"
- "what's the latest [library] API?"
- "context7 [library]"
- Before generating code for unfamiliar libraries

## How It Works

Context7 fetches current documentation directly from library sources, ensuring you have accurate, up-to-date information instead of relying on training data.

## Usage Patterns

### Basic: Get Library Docs
```
Fetch documentation for react-query v5
```

### Specific: Get API Reference
```
Get the useQuery hook documentation from react-query
```

### Version-Specific
```
Get Next.js 14 App Router documentation
```

### Multiple Libraries
```
Get docs for: tailwindcss, shadcn/ui, lucide-react
```

## Common Use Cases

| Scenario | What to Fetch |
|----------|--------------|
| Starting React project | react 18 docs, react-dom docs |
| Adding state management | zustand docs, or jotai docs |
| Styling components | tailwindcss docs, shadcn/ui docs |
| Adding API layer | tanstack-query docs, axios docs |
| Form handling | react-hook-form docs, zod docs |
| Testing | vitest docs, testing-library docs |

## Example Workflow

1. **User asks:** "Add a data table with sorting and filtering"
2. **Before coding:**
   - Fetch tanstack-table documentation
   - Fetch shadcn/ui table component docs
3. **Generate code** using current API

## Tips

- Always specify version when known (e.g., "Next.js 14" not just "Next.js")
- Fetch docs before generating complex code
- For frameworks with multiple packages, fetch main + relevant sub-packages
- Cache results mentally for the session to avoid repeat fetches

## When NOT to Use

- For extremely common patterns you know well
- When user provides their own docs/examples
- For standard library features (Array, Object, etc.)
