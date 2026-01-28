# Hosting

## Deploy

```bash
# Build first
npm run build

# Deploy
firebase deploy --only hosting
```

## Configuration

### firebase.json

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## Preview Channels

```bash
# Create preview
firebase hosting:channel:deploy preview-name

# List channels
firebase hosting:channel:list

# Delete channel
firebase hosting:channel:delete preview-name
```

## Custom Domain

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS verification steps
4. Add DNS records at your registrar

## Redirects

```json
{
  "hosting": {
    "redirects": [
      {
        "source": "/old-page",
        "destination": "/new-page",
        "type": 301
      },
      {
        "source": "/old/**",
        "destination": "/new/:splat",
        "type": 301
      }
    ]
  }
}
```

## Rewrites

### SPA Fallback

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Cloud Functions

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ]
  }
}
```

### Cloud Run

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "my-service",
          "region": "us-central1"
        }
      }
    ]
  }
}
```

## Multiple Sites

```json
{
  "hosting": [
    {
      "target": "app",
      "public": "dist/app"
    },
    {
      "target": "admin",
      "public": "dist/admin"
    }
  ]
}
```

```bash
firebase deploy --only hosting:app
firebase deploy --only hosting:admin
```
