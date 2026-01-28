# Deployment

## Basic Deployment

### Draft Deploy

```bash
netlify deploy

# Output shows draft URL
# Draft URL: https://xxx--my-site.netlify.app
```

### Production Deploy

```bash
netlify deploy --prod

# Deploys to main URL
# Production URL: https://my-site.netlify.app
```

## Deployment Options

```bash
# Deploy specific directory
netlify deploy --dir=dist

# Deploy without prompts
netlify deploy --prod --yes

# Deploy with build
netlify deploy --build --prod
```

## Build Commands

```bash
# Trigger build
netlify build

# Build locally
netlify build --context production
netlify build --context deploy-preview
```

## Deploy Previews

Automatic on pull requests when connected to Git.

Manual preview:
```bash
netlify deploy
# Creates unique preview URL
```

## Rollback

```bash
# List deploys
netlify deploys

# Rollback to specific deploy
netlify deploy:restore deploy-id
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
      - run: npm ci && npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Build Hooks

```bash
# Create webhook URL for triggering builds
netlify build:hooks:create "CI Build"

# Trigger via curl
curl -X POST https://api.netlify.com/build_hooks/xxx
```
