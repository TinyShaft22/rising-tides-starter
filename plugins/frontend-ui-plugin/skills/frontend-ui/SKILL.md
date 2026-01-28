---
name: frontend-ui
description: Complete frontend development with live documentation (context7) and shadcn component registry. Use for React/Next.js projects with shadcn/ui components.
mcp: context7, shadcn
---

# Frontend UI Development

Complete frontend development toolkit combining live documentation and component registry access.

## Trigger

Invoke when:
- Building React/Next.js interfaces
- Working with shadcn/ui components
- Need current framework documentation
- Creating production-grade UI

## Available Tools

### Context7 (Documentation)

Fetch current documentation for any library:

```
Fetch react 19 documentation
Fetch Next.js App Router documentation
Fetch tailwindcss v4 documentation
Fetch shadcn/ui documentation
Fetch framer-motion documentation
```

**Why use this?** Frameworks update frequently. Context7 ensures you use current syntax.

### Shadcn Registry (Components)

Browse and install shadcn components:

| Tool | Purpose |
|------|---------|
| `search_items_in_registries` | Find components by name/description |
| `view_items_in_registries` | See component details and code |
| `get_item_examples_from_registries` | Get usage examples |
| `get_add_command_for_items` | Get install command |

**Example workflow:**
```
1. Search for "dialog" in shadcn registry
2. View the dialog component details
3. Get the add command: npx shadcn@latest add dialog
4. Fetch shadcn dialog documentation via context7
5. Implement with current patterns
```

## Design Philosophy

Create distinctive, production-grade interfaces:

- **Typography**: Choose distinctive fonts, avoid generic Inter/Arial
- **Color**: Commit to cohesive palettes with sharp accents
- **Motion**: Purposeful animations at key moments
- **Composition**: Unexpected layouts, asymmetry, grid-breaking elements
- **Texture**: Gradients, noise, patterns - avoid flat solid colors

**Never use:**
- Generic AI aesthetics (purple gradients on white)
- Cookie-cutter layouts
- Overused font families
- Predictable component patterns

## Workflow

1. **Understand requirements** - purpose, audience, constraints
2. **Choose aesthetic direction** - minimal, maximalist, retro, organic, etc.
3. **Fetch current docs** - use context7 for framework documentation
4. **Browse components** - use shadcn registry for UI primitives
5. **Implement** - production-grade code with distinctive design
6. **Refine** - attention to spacing, typography, micro-interactions

## When to Use This Plugin

| Scenario | Use This Plugin |
|----------|-----------------|
| React/Next.js with shadcn | Yes |
| Need component examples | Yes |
| Need current framework docs | Yes |
| Simple HTML/CSS | No (use frontend-design skill) |
| Non-shadcn component libraries | Partial (context7 only) |

## Tips

- Always fetch docs before implementing - frameworks change fast
- Use shadcn registry to discover components you didn't know existed
- Combine multiple shadcn primitives for complex UI patterns
- Check examples before implementing - saves time on patterns
