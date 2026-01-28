# CLI Setup

## Installation

```bash
npm install -g vercel
```

## Authentication

```bash
# Login (opens browser)
vercel login

# Login with email
vercel login --email

# Check status
vercel whoami
```

## Link Project

```bash
# In project directory
vercel link

# Creates .vercel/project.json
```

## Configuration

### .vercel/project.json

```json
{
  "projectId": "prj_xxx",
  "orgId": "team_xxx"
}
```

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "api/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

## Teams

```bash
# Switch team
vercel switch

# List teams
vercel teams ls
```

## Useful Commands

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# List deployments
vercel list

# Inspect deployment
vercel inspect [url]

# View logs
vercel logs [url]

# Pull env vars
vercel env pull
```
