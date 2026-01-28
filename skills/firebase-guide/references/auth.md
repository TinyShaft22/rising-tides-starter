# Authentication

## Setup

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

## Email/Password

### Sign Up

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';

const userCredential = await createUserWithEmailAndPassword(
  auth,
  'email@example.com',
  'password123'
);
const user = userCredential.user;
```

### Sign In

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';

const userCredential = await signInWithEmailAndPassword(
  auth,
  'email@example.com',
  'password123'
);
```

### Sign Out

```typescript
import { signOut } from 'firebase/auth';

await signOut(auth);
```

## OAuth Providers

### Google

```typescript
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
const user = result.user;
```

### GitHub

```typescript
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';

const provider = new GithubAuthProvider();
const result = await signInWithPopup(auth, provider);
```

## Auth State

### Current User

```typescript
const user = auth.currentUser;
if (user) {
  console.log('Signed in:', user.email);
}
```

### Listen for Changes

```typescript
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Signed in:', user.uid);
  } else {
    console.log('Signed out');
  }
});
```

## Password Reset

```typescript
import { sendPasswordResetEmail } from 'firebase/auth';

await sendPasswordResetEmail(auth, 'email@example.com');
```

## Update Profile

```typescript
import { updateProfile } from 'firebase/auth';

await updateProfile(auth.currentUser, {
  displayName: 'John Doe',
  photoURL: 'https://example.com/photo.jpg',
});
```

## ID Token

```typescript
const token = await auth.currentUser.getIdToken();
// Use token for API authentication
```

## React Hook

```typescript
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
```
