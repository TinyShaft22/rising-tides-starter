# Firestore

## Setup

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

## CRUD Operations

### Add Document

```typescript
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Auto-generated ID
const docRef = await addDoc(collection(db, 'users'), {
  name: 'John',
  email: 'john@example.com',
});

// Custom ID
await setDoc(doc(db, 'users', 'user-id'), {
  name: 'John',
  email: 'john@example.com',
});
```

### Get Document

```typescript
import { doc, getDoc } from 'firebase/firestore';

const docSnap = await getDoc(doc(db, 'users', 'user-id'));
if (docSnap.exists()) {
  console.log(docSnap.data());
}
```

### Get Collection

```typescript
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// All documents
const querySnapshot = await getDocs(collection(db, 'users'));
querySnapshot.forEach((doc) => {
  console.log(doc.id, doc.data());
});

// With query
const q = query(
  collection(db, 'users'),
  where('age', '>', 18),
  orderBy('age'),
  limit(10)
);
const querySnapshot = await getDocs(q);
```

### Update Document

```typescript
import { doc, updateDoc } from 'firebase/firestore';

await updateDoc(doc(db, 'users', 'user-id'), {
  name: 'Updated Name',
});
```

### Delete Document

```typescript
import { doc, deleteDoc } from 'firebase/firestore';

await deleteDoc(doc(db, 'users', 'user-id'));
```

## Real-time Listeners

```typescript
import { doc, onSnapshot, collection } from 'firebase/firestore';

// Single document
const unsubscribe = onSnapshot(doc(db, 'users', 'user-id'), (doc) => {
  console.log('Current data:', doc.data());
});

// Collection
const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') console.log('New:', change.doc.data());
    if (change.type === 'modified') console.log('Modified:', change.doc.data());
    if (change.type === 'removed') console.log('Removed:', change.doc.data());
  });
});

// Unsubscribe when done
unsubscribe();
```

## Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public read, authenticated write
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        request.auth.uid == resource.data.authorId;
    }
  }
}
```

## Deploy Rules

```bash
firebase deploy --only firestore:rules
```
