# Cloud Functions

## Setup

```bash
firebase init functions
# Choose TypeScript
```

## Basic HTTP Function

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';

export const helloWorld = functions.https.onRequest((req, res) => {
  res.json({ message: 'Hello from Firebase!' });
});
```

## With Express

```typescript
import * as functions from 'firebase-functions';
import * as express from 'express';

const app = express();

app.get('/users', async (req, res) => {
  res.json({ users: [] });
});

app.post('/users', async (req, res) => {
  const { name } = req.body;
  res.json({ id: '1', name });
});

export const api = functions.https.onRequest(app);
```

## Firestore Triggers

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// On create
export const onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const user = snap.data();
    console.log('New user:', user);
  });

// On update
export const onUserUpdate = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    console.log('Changed from', before, 'to', after);
  });

// On delete
export const onUserDelete = functions.firestore
  .document('users/{userId}')
  .onDelete(async (snap, context) => {
    console.log('Deleted user:', snap.data());
  });
```

## Auth Triggers

```typescript
export const onUserSignUp = functions.auth.user().onCreate(async (user) => {
  // Create user profile
  await admin.firestore().collection('profiles').doc(user.uid).set({
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  // Clean up user data
  await admin.firestore().collection('profiles').doc(user.uid).delete();
});
```

## Scheduled Functions

```typescript
export const dailyCleanup = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    // Run daily cleanup
    console.log('Running daily cleanup');
  });
```

## Deploy

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:helloWorld
```

## Local Testing

```bash
# Start emulators
firebase emulators:start --only functions

# Or with shell
firebase functions:shell
```

## Environment Config

```bash
# Set config
firebase functions:config:set api.key="secret"

# Get config
firebase functions:config:get

# Use in code
const key = functions.config().api.key;
```
