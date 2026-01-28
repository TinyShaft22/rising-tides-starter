---
name: firebase-guide
description: "Firebase using Firebase CLI. Firestore, Auth, Hosting, Functions. Use when setting up Firebase or working with Google's backend services. Triggers on: 'firebase', 'firestore', 'firebase auth', 'firebase hosting', 'cloud functions'."
---

# Firebase Guide

Backend services using the Firebase CLI.

## Prerequisites

### Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Login

```bash
firebase login
```

### Initialize Project

```bash
firebase init
# Select services: Firestore, Functions, Hosting, etc.
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Deploy all | `firebase deploy` |
| Deploy hosting | `firebase deploy --only hosting` |
| Deploy functions | `firebase deploy --only functions` |
| Run emulators | `firebase emulators:start` |
| Open console | `firebase open` |

---

## Local Development

### Start Emulators

```bash
# All emulators
firebase emulators:start

# Specific emulators
firebase emulators:start --only firestore,auth

# With data export on shutdown
firebase emulators:start --export-on-exit
```

### Environment

```env
# Local development
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIRESTORE_EMULATOR_HOST=localhost:8080
```

---

## Firestore

### Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Posts collection
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        request.auth.uid == resource.data.authorId;
    }
  }
}
```

### Client Usage

```typescript
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

const db = getFirestore();

// Add document
await setDoc(doc(db, 'users', 'user123'), {
  name: 'John',
  email: 'john@example.com',
});

// Get document
const docSnap = await getDoc(doc(db, 'users', 'user123'));
if (docSnap.exists()) {
  console.log(docSnap.data());
}

// Query
const q = query(collection(db, 'posts'), where('authorId', '==', 'user123'));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  console.log(doc.id, doc.data());
});
```

---

## Authentication

### Setup

```typescript
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();

// Sign in with Google
const result = await signInWithPopup(auth, provider);
const user = result.user;

// Sign out
await signOut(auth);

// Get current user
const user = auth.currentUser;

// Listen for auth changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Signed in:', user.email);
  } else {
    console.log('Signed out');
  }
});
```

---

## Cloud Functions

### Setup

```bash
firebase init functions
# Choose TypeScript
```

### Example Function

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  // Create user profile in Firestore
  await admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

export const api = functions.https.onRequest(async (req, res) => {
  res.json({ message: 'Hello from Firebase!' });
});
```

### Deploy Functions

```bash
firebase deploy --only functions
firebase deploy --only functions:onUserCreate
```

---

## Hosting

### Deploy

```bash
# Build first
npm run build

# Deploy
firebase deploy --only hosting
```

### Configuration

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Preview Channels

```bash
# Create preview
firebase hosting:channel:deploy preview-name

# List channels
firebase hosting:channel:list

# Delete channel
firebase hosting:channel:delete preview-name
```

---

## Project Setup

### Firebase Config

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

## Reference Files

- `references/cli-setup.md` — Install, login, init
- `references/firestore.md` — Database operations
- `references/auth.md` — Authentication
- `references/hosting.md` — Static hosting
- `references/functions.md` — Cloud functions

---

## When to Use

- Need quick backend setup with Google
- Want NoSQL database (Firestore)
- Need authentication with multiple providers
- Building mobile apps with same backend
- Want generous free tier
