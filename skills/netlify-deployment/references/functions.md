# Netlify Functions

## Create Function

```bash
netlify functions:create hello
```

Creates `netlify/functions/hello/hello.js`

## Basic Function

```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello!' }),
  };
};
```

## TypeScript Function

```typescript
// netlify/functions/hello.ts
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello!' }),
  };
};
```

## Request Handling

```typescript
export const handler: Handler = async (event) => {
  const { httpMethod, body, queryStringParameters, headers } = event;

  if (httpMethod === 'POST') {
    const data = JSON.parse(body || '{}');
    // Handle POST
  }

  const name = queryStringParameters?.name || 'World';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: `Hello, ${name}!` }),
  };
};
```

## Scheduled Functions

```typescript
// netlify/functions/scheduled.ts
import { schedule } from '@netlify/functions';

export const handler = schedule('0 0 * * *', async () => {
  // Runs daily at midnight
  console.log('Running scheduled task');
  return { statusCode: 200 };
});
```

## Background Functions

```typescript
// netlify/functions/background-task-background.ts
// Name must end with -background
export const handler = async (event) => {
  // Long-running task (up to 15 minutes)
  await processLargeDataset();
  return { statusCode: 200 };
};
```

## Local Testing

```bash
netlify dev
# Functions available at: http://localhost:8888/.netlify/functions/hello
```

## Deploy

```bash
# Deploy with site
netlify deploy --prod

# Functions only
netlify functions:deploy
```

## Configuration

### netlify.toml

```toml
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[functions."heavy-function"]
  timeout = 26
  memory = 1024
```

## Access from Frontend

```typescript
// Rewrite in netlify.toml
// [[redirects]]
//   from = "/api/*"
//   to = "/.netlify/functions/:splat"
//   status = 200

const response = await fetch('/api/hello');
const data = await response.json();
```
