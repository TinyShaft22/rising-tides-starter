# Firebase Hosting (via GCP)

Firebase Hosting is part of GCP and can be managed via both Firebase CLI and gcloud.

## Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
```

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
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
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

## Connect to Cloud Run

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "my-api",
          "region": "us-central1"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Preview Channels

```bash
# Create preview
firebase hosting:channel:deploy preview-name --expires 7d

# List channels
firebase hosting:channel:list

# Delete channel
firebase hosting:channel:delete preview-name
```

## Custom Domain

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Verify domain ownership
4. Add DNS records

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
# Configure targets
firebase target:apply hosting app my-app-site
firebase target:apply hosting admin my-admin-site

# Deploy specific target
firebase deploy --only hosting:app
```

## CI/CD

```yaml
# GitHub Actions
- uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    repoToken: '${{ secrets.GITHUB_TOKEN }}'
    firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
    channelId: live
```
