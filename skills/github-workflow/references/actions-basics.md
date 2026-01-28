# GitHub Actions Basics

## View Workflows

```bash
# List all workflows
gh workflow list

# View workflow details
gh workflow view deploy.yml

# View in browser
gh workflow view deploy.yml --web
```

## Run Workflows

```bash
# Run workflow manually
gh workflow run deploy.yml

# Run with inputs
gh workflow run deploy.yml -f environment=production

# Run specific branch
gh workflow run deploy.yml --ref feature-branch
```

## View Runs

```bash
# List recent runs
gh run list

# List runs for specific workflow
gh run list --workflow=deploy.yml

# View run details
gh run view 12345

# View run logs
gh run view 12345 --log

# View failed step logs
gh run view 12345 --log-failed

# Watch running workflow
gh run watch 12345
```

## Manage Runs

```bash
# Cancel run
gh run cancel 12345

# Rerun failed jobs
gh run rerun 12345 --failed

# Rerun entire workflow
gh run rerun 12345

# Download artifacts
gh run download 12345
```

## Common Workflow Examples

### CI Workflow
```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

### Deploy Workflow
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
      - run: npm ci && npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

### Release Workflow
```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: softprops/action-gh-release@v1
        with:
          files: dist/*
```

## Secrets Management

```bash
# List secrets (names only)
gh secret list

# Set secret
gh secret set MY_SECRET

# Set from file
gh secret set MY_SECRET < secret.txt

# Delete secret
gh secret delete MY_SECRET

# Set for environment
gh secret set MY_SECRET --env production
```

## Cache Management

```bash
# List caches
gh cache list

# Delete cache
gh cache delete --all
```
