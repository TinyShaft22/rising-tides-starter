---
name: vercel-deployment
description: "Vercel deployment using Vercel CLI. Deploy, preview, environment variables, domains. Use when deploying to Vercel or configuring Vercel projects. Triggers on: 'vercel', 'deploy', 'preview deployment', 'vercel env', 'vercel domains'."
---

# Vercel Deployment

Deploy and manage applications using the Vercel CLI.

## Prerequisites

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Link Project

```bash
# In project directory
vercel link
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Deploy preview | `vercel` |
| Deploy production | `vercel --prod` |
| List deployments | `vercel list` |
| Set env var | `vercel env add` |
| List env vars | `vercel env ls` |
| Add domain | `vercel domains add` |

---

## Deployment

### Preview Deployment

```bash
# Creates preview URL
vercel

# Output:
# ✓ Preview: https://my-app-xxx-team.vercel.app
```

### Production Deployment

```bash
vercel --prod

# Output:
# ✓ Production: https://my-app.vercel.app
```

### Deploy Specific Directory

```bash
vercel ./dist
vercel ./out --prod
```

### Deploy Without Prompts

```bash
vercel --yes
vercel --prod --yes
```

---

## Environment Variables

### Add Variable

```bash
# Interactive
vercel env add

# With value
vercel env add DATABASE_URL production
# Then enter value when prompted

# From file
vercel env add DATABASE_URL production < .env.production
```

### List Variables

```bash
vercel env ls
vercel env ls production
vercel env ls preview
vercel env ls development
```

### Pull to Local

```bash
# Download env vars to .env.local
vercel env pull
vercel env pull .env.production.local --environment=production
```

### Remove Variable

```bash
vercel env rm DATABASE_URL production
```

---

## Domains

### Add Domain

```bash
vercel domains add example.com
```

### List Domains

```bash
vercel domains ls
```

### Configure DNS

```bash
# Add DNS record
vercel dns add example.com @ A 76.76.21.21
vercel dns add example.com www CNAME cname.vercel-dns.com
```

### SSL Certificate

```bash
# Auto-provisioned, but can check status
vercel certs ls
```

---

## Project Configuration

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ],
  "redirects": [
    { "source": "/old", "destination": "/new", "permanent": true }
  ]
}
```

### Framework Detection

Vercel auto-detects:
- Next.js
- React (Create React App)
- Vue.js
- Nuxt
- SvelteKit
- Astro
- Remix

---

## Inspect and Debug

### View Deployment

```bash
vercel inspect [deployment-url]
```

### View Logs

```bash
vercel logs [deployment-url]
vercel logs --follow  # Stream logs
```

### List Deployments

```bash
vercel list
vercel list --prod  # Production only
```

### Rollback

```bash
# Promote previous deployment to production
vercel rollback [deployment-url]
```

---

## Teams and Projects

### Switch Team

```bash
vercel switch
```

### List Projects

```bash
vercel projects ls
```

### Remove Project

```bash
vercel remove my-project
```

---

## CI/CD Integration

### GitHub Action

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Get Tokens

```bash
# Get org and project IDs
vercel link
cat .vercel/project.json

# Create token in Vercel Dashboard > Settings > Tokens
```

---

## Reference Files

- `references/cli-setup.md` — Install, login
- `references/deploy.md` — Deploy commands, preview, production
- `references/env-vars.md` — Environment variables
- `references/domains.md` — Custom domains
- `references/project-settings.md` — Configuration options

---

## When to Use

- Deploying Next.js applications
- Need automatic preview deployments
- Want serverless functions
- Need edge functions globally
- Prefer zero-config deployment
