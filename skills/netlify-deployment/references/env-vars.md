# Environment Variables

## Set Variables

```bash
# Interactive
netlify env:set DATABASE_URL

# With value
netlify env:set DATABASE_URL "postgres://..."

# For specific context
netlify env:set API_KEY "xxx" --context production
netlify env:set API_KEY "xxx-dev" --context deploy-preview
```

## List Variables

```bash
netlify env:list
```

## Get Variable

```bash
netlify env:get DATABASE_URL
```

## Import from File

```bash
netlify env:import .env
```

## Delete Variable

```bash
netlify env:unset DATABASE_URL
```

## Contexts

| Context | Description |
|---------|-------------|
| `production` | Production deploys |
| `deploy-preview` | PR preview deploys |
| `branch-deploy` | Branch deploys |
| `dev` | Local development |

## In netlify.toml

```toml
[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  environment = { NODE_ENV = "preview" }
```

## Local Development

```bash
# Pull env vars
netlify env:pull

# Creates .env file
# Use with netlify dev
netlify dev
```

## Best Practices

1. Use context-specific values for different environments
2. Never commit `.env` files
3. Use `netlify dev` for local testing with env vars
4. Prefix client-side vars appropriately (e.g., `VITE_`, `NEXT_PUBLIC_`)
