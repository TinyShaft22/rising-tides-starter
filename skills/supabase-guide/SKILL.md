---
name: supabase-guide
description: "Supabase backend using Supabase CLI. Database, auth, realtime, edge functions. Use when setting up Supabase, configuring auth, or managing database. Triggers on: 'supabase', 'backend', 'database', 'auth', 'realtime', 'edge functions'."
---

# Supabase Guide

Backend-as-a-Service using the Supabase CLI and SDK.

## Prerequisites

### Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# npm (any platform)
npm install -g supabase
```

### Login

```bash
supabase login
```

### Initialize Project

```bash
# In your project directory
supabase init
```

## Quick Reference

| Task | Command |
|------|---------|
| Start local | `supabase start` |
| Stop local | `supabase stop` |
| Link to project | `supabase link --project-ref xxx` |
| Push migrations | `supabase db push` |
| Generate types | `supabase gen types typescript` |
| Deploy functions | `supabase functions deploy` |

---

## Local Development

### Start Local Supabase

```bash
supabase start

# Output shows local URLs:
# API URL: http://localhost:54321
# Studio: http://localhost:54323
# Inbucket (email): http://localhost:54324
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # From supabase start output
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Database Setup

### Create Migration

```bash
supabase migration new create_users_table
```

### Write Migration

```sql
-- supabase/migrations/xxx_create_users_table.sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all profiles
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

-- Policy: Users can update own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);
```

### Apply Migration

```bash
# Local
supabase db reset

# Remote
supabase db push
```

---

## Client Setup

### Install SDK

```bash
npm install @supabase/supabase-js
```

### Create Client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Generate Types

```bash
supabase gen types typescript --local > types/database.ts
```

```typescript
// Typed client
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## Authentication

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

### OAuth

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:3000/auth/callback',
  },
});
```

### Get User

```typescript
const { data: { user } } = await supabase.auth.getUser();
```

---

## Database Queries

```typescript
// Select
const { data, error } = await supabase
  .from('profiles')
  .select('*');

// Insert
const { data, error } = await supabase
  .from('profiles')
  .insert({ username: 'john', full_name: 'John Doe' });

// Update
const { data, error } = await supabase
  .from('profiles')
  .update({ full_name: 'John Updated' })
  .eq('id', userId);

// Delete
const { data, error } = await supabase
  .from('profiles')
  .delete()
  .eq('id', userId);
```

---

## Reference Files

- `references/cli-setup.md` — Install, login, init
- `references/database.md` — Schema, migrations, queries
- `references/auth.md` — Authentication setup
- `references/realtime.md` — Realtime subscriptions
- `references/edge-functions.md` — Serverless functions

---

## When to Use

- Starting a new web app needing backend
- Need authentication with minimal setup
- Want PostgreSQL with REST/GraphQL API
- Building realtime features
- Prefer open-source Firebase alternative
