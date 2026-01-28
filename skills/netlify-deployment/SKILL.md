---
name: netlify-deployment
description: "Netlify deployment using Netlify CLI. Deploy, environment variables, functions. Use when deploying to Netlify. Triggers on: 'netlify', 'netlify deploy', 'netlify functions', 'netlify env'."
---

# Netlify Deployment

Deploy and manage applications using the Netlify CLI.

## Prerequisites

### Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Login

```bash
netlify login
```

### Link to Site

```bash
# In project directory
netlify link
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Deploy draft | `netlify deploy` |
| Deploy production | `netlify deploy --prod` |
| Dev server | `netlify dev` |
| List sites | `netlify sites:list` |
| Set env var | `netlify env:set KEY value` |
| Open admin | `netlify open:admin` |

---

## Deployment

### Draft Deploy

```bash
netlify deploy

# Output:
# ✔ Deploy is live!
# Draft URL: https://xxx--my-site.netlify.app
```

### Production Deploy

```bash
netlify deploy --prod

# Output:
# ✔ Deploy is live!
# Production URL: https://my-site.netlify.app
```

### Deploy Directory

```bash
netlify deploy --dir=dist
netlify deploy --dir=build --prod
```

---

## Local Development

### Start Dev Server

```bash
netlify dev

# Runs your build command and serves with Netlify features:
# - Environment variables
# - Redirects/rewrites
# - Functions
```

### Live Preview

```bash
netlify dev --live
# Creates shareable URL for live preview
```

---

## Environment Variables

### Set Variable

```bash
netlify env:set DATABASE_URL "postgres://..."
netlify env:set API_KEY "xxx" --context production
netlify env:set API_KEY "xxx-dev" --context deploy-preview
```

### List Variables

```bash
netlify env:list
```

### Get Variable

```bash
netlify env:get DATABASE_URL
```

### Import from File

```bash
netlify env:import .env
```

### Delete Variable

```bash
netlify env:unset DATABASE_URL
```

---

## Netlify Functions

### Create Function

```bash
netlify functions:create hello

# Creates netlify/functions/hello/hello.js
```

### Example Function

```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  const { name = 'World' } = event.queryStringParameters || {};

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: `Hello, ${name}!` }),
  };
};
```

### TypeScript Function

```typescript
// netlify/functions/hello.ts
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello!' }),
  };
};
```

### Test Locally

```bash
netlify dev
# Function available at: http://localhost:8888/.netlify/functions/hello
```

### Deploy Functions Only

```bash
netlify deploy --functions=netlify/functions
```

---

## Configuration

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"

[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  environment = { NODE_ENV = "preview" }
```

---

## Site Management

### Create Site

```bash
netlify sites:create --name my-site
```

### List Sites

```bash
netlify sites:list
```

### Open in Browser

```bash
netlify open        # Opens site
netlify open:admin  # Opens admin panel
```

### Delete Site

```bash
netlify sites:delete
```

---

## Build Hooks

### Create Build Hook

```bash
netlify build:hooks:create "Deploy from CI"
# Returns webhook URL for triggering builds
```

### Trigger Build

```bash
curl -X POST https://api.netlify.com/build_hooks/xxx
```

---

## Reference Files

- `references/cli-setup.md` — Install, login
- `references/deploy.md` — Deploy commands
- `references/env-vars.md` — Environment variables
- `references/functions.md` — Netlify functions

---

## When to Use

- Deploying static sites or SPAs
- Need serverless functions
- Want automatic deploy previews
- Building JAMstack applications
- Need form handling without backend
