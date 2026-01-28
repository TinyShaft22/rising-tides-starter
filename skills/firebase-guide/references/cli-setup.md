# CLI Setup

## Installation

```bash
npm install -g firebase-tools
```

## Authentication

```bash
# Login (opens browser)
firebase login

# Login in CI environment
firebase login:ci

# Check status
firebase login:list
```

## Initialize Project

```bash
firebase init
```

Select features:
- Firestore
- Functions
- Hosting
- Storage
- Emulators

## Project Commands

```bash
# List projects
firebase projects:list

# Use specific project
firebase use project-id

# Add project alias
firebase use --add
```

## Configuration Files

After `firebase init`:

```
firebase.json       # Main config
.firebaserc         # Project aliases
firestore.rules     # Firestore security rules
firestore.indexes.json # Firestore indexes
storage.rules       # Storage security rules
```

## firebase.json

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  },
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "functions": { "port": 5001 },
    "hosting": { "port": 5000 }
  }
}
```

## Useful Commands

```bash
# Deploy everything
firebase deploy

# Deploy specific service
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules

# Start emulators
firebase emulators:start

# Open console
firebase open
```
