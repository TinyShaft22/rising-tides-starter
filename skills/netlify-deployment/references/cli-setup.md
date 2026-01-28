# CLI Setup

## Installation

```bash
npm install -g netlify-cli
```

## Authentication

```bash
# Login (opens browser)
netlify login

# Check status
netlify status
```

## Link to Site

```bash
# In project directory
netlify link

# Or create new site
netlify sites:create --name my-site
```

## Configuration

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[dev]
  command = "npm run dev"
  port = 3000
  targetPort = 5173

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Useful Commands

```bash
# Deploy draft
netlify deploy

# Deploy production
netlify deploy --prod

# Local dev server
netlify dev

# List sites
netlify sites:list

# Open admin
netlify open:admin

# View logs
netlify logs:function my-function
```
