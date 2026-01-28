# Cloud Functions

## Deploy HTTP Function

```bash
gcloud functions deploy my-function \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point handler \
  --region us-central1
```

## Function Code

### JavaScript

```javascript
// index.js
exports.handler = (req, res) => {
  const name = req.query.name || 'World';
  res.json({ message: `Hello, ${name}!` });
};
```

### TypeScript

```typescript
// src/index.ts
import { HttpFunction } from '@google-cloud/functions-framework';

export const handler: HttpFunction = (req, res) => {
  res.json({ message: 'Hello!' });
};
```

## Event Triggers

### Cloud Storage

```bash
gcloud functions deploy processFile \
  --gen2 \
  --runtime nodejs20 \
  --trigger-bucket my-bucket \
  --entry-point processFile
```

```javascript
exports.processFile = (cloudEvent) => {
  const file = cloudEvent.data;
  console.log(`File: ${file.name}`);
};
```

### Pub/Sub

```bash
gcloud functions deploy processPubSub \
  --gen2 \
  --runtime nodejs20 \
  --trigger-topic my-topic \
  --entry-point processPubSub
```

```javascript
exports.processPubSub = (cloudEvent) => {
  const message = Buffer.from(cloudEvent.data.message.data, 'base64').toString();
  console.log(`Message: ${message}`);
};
```

### Firestore

```bash
gcloud functions deploy onUserCreate \
  --gen2 \
  --runtime nodejs20 \
  --trigger-event-filters="type=google.cloud.firestore.document.v1.created" \
  --trigger-event-filters="database=(default)" \
  --trigger-event-filters-path-pattern="document=users/{userId}" \
  --entry-point onUserCreate
```

## Configuration

### Environment Variables

```bash
gcloud functions deploy my-function \
  --set-env-vars "API_KEY=xxx"
```

### Secrets

```bash
gcloud functions deploy my-function \
  --set-secrets "API_KEY=my-secret:latest"
```

### Memory and Timeout

```bash
gcloud functions deploy my-function \
  --memory 256MB \
  --timeout 60s
```

## Manage Functions

```bash
# List functions
gcloud functions list

# Describe function
gcloud functions describe my-function

# View logs
gcloud functions logs read my-function

# Delete function
gcloud functions delete my-function
```

## Local Testing

```bash
# Install framework
npm install @google-cloud/functions-framework

# Run locally
npx functions-framework --target=handler
```
