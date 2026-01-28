# Environment Variables

## Add Variables

### Interactive

```bash
vercel env add
# Prompts for name, value, and environments
```

### With Value

```bash
# Add to all environments
vercel env add DATABASE_URL

# Add to specific environment
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
```

### From File

```bash
vercel env add DATABASE_URL production < .env.production
```

## List Variables

```bash
# All environments
vercel env ls

# Specific environment
vercel env ls production
vercel env ls preview
vercel env ls development
```

## Pull to Local

```bash
# Pull all env vars
vercel env pull

# Pull to specific file
vercel env pull .env.local

# Pull from specific environment
vercel env pull .env.production.local --environment=production
```

## Remove Variables

```bash
vercel env rm DATABASE_URL production
```

## Sensitive vs Regular

Sensitive variables are encrypted and not shown in logs.

```bash
# Add as sensitive
vercel env add --sensitive API_SECRET production
```

## Environment Contexts

| Context | When Used |
|---------|-----------|
| `production` | Production deployments |
| `preview` | All preview deployments |
| `development` | Local dev (vercel dev) |

## Best Practices

1. Use `NEXT_PUBLIC_` prefix for client-side variables
2. Don't commit `.env.local` to git
3. Use separate values for preview vs production
4. Pull env vars before local development

## In Code

```typescript
// Server-side
const apiKey = process.env.API_KEY;

// Client-side (Next.js)
const publicUrl = process.env.NEXT_PUBLIC_API_URL;
```
