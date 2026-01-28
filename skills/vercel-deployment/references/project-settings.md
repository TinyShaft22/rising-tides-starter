# Project Settings

## vercel.json Reference

```json
{
  // Build settings
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": "dist",

  // Framework detection
  "framework": "nextjs",

  // Regions
  "regions": ["iad1", "sfo1"],

  // Functions configuration
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },

  // Headers
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ],

  // Redirects
  "redirects": [
    {
      "source": "/old",
      "destination": "/new",
      "permanent": true
    }
  ],

  // Rewrites
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ],

  // Clean URLs
  "cleanUrls": true,

  // Trailing slash
  "trailingSlash": false,

  // Public directory (for static files)
  "public": true
}
```

## Function Configuration

### Memory

```json
{
  "functions": {
    "api/heavy.ts": {
      "memory": 3008
    }
  }
}
```

Options: 128, 256, 512, 1024, 2048, 3008 MB

### Max Duration

```json
{
  "functions": {
    "api/long-running.ts": {
      "maxDuration": 60
    }
  }
}
```

Hobby: 10s max, Pro: 60s max, Enterprise: 900s max

### Regions

```json
{
  "functions": {
    "api/**/*.ts": {
      "regions": ["iad1", "sfo1"]
    }
  }
}
```

## Environment-Specific Config

```json
{
  "env": {
    "MY_VAR": "value"
  },
  "build": {
    "env": {
      "BUILD_VAR": "build-value"
    }
  }
}
```

## Ignore Files

### .vercelignore

```
node_modules
.git
*.log
.env.local
```

## Monorepo Setup

```json
{
  "buildCommand": "cd packages/web && npm run build",
  "outputDirectory": "packages/web/dist",
  "installCommand": "npm install --prefix packages/web"
}
```

Or use Root Directory in Vercel Dashboard.
