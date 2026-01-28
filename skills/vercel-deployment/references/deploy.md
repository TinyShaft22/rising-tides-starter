# Deployment

## Basic Deployment

### Preview

```bash
vercel
# Creates preview URL: https://project-xxx.vercel.app
```

### Production

```bash
vercel --prod
# Deploys to production: https://project.vercel.app
```

## Deployment Options

```bash
# Deploy without prompts
vercel --yes

# Deploy specific directory
vercel ./dist --prod

# Deploy with build command override
vercel --build-env CI=true

# Force rebuild
vercel --force

# Skip build
vercel --prebuilt
```

## Pre-built Deployments

```bash
# Build locally
npm run build

# Deploy built output
vercel --prebuilt
```

## Inspect Deployments

```bash
# List all deployments
vercel list

# List production only
vercel list --prod

# Inspect specific deployment
vercel inspect https://project-xxx.vercel.app

# View build logs
vercel logs https://project-xxx.vercel.app
```

## Rollback

```bash
# Promote previous deployment
vercel rollback [deployment-url]

# Or alias a specific deployment to production
vercel alias [deployment-url] production
```

## Remove Deployments

```bash
# Remove specific deployment
vercel remove [deployment-url]

# Remove all non-production deployments
vercel remove my-project --safe
```

## CI/CD

### GitHub Actions

```yaml
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

### Get IDs

```bash
# Link project first
vercel link

# IDs are in .vercel/project.json
cat .vercel/project.json
```
