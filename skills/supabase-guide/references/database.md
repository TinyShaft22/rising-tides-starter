# Database

## Migrations

### Create Migration

```bash
supabase migration new create_users
```

### Migration File

```sql
-- supabase/migrations/20240101000000_create_users.sql

-- Create table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid() = id);
```

### Apply Migrations

```bash
# Local
supabase db reset

# Remote
supabase db push
```

## Row Level Security (RLS)

### Common Policies

```sql
-- Anyone can read
CREATE POLICY "Public read" ON posts
FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated insert" ON posts
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update own records
CREATE POLICY "Update own" ON posts
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete own records
CREATE POLICY "Delete own" ON posts
FOR DELETE USING (auth.uid() = user_id);
```

## Queries

### Basic CRUD

```typescript
import { supabase } from './supabase';

// Select
const { data, error } = await supabase
  .from('users')
  .select('*');

// Select with filter
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'user@example.com')
  .single();

// Insert
const { data, error } = await supabase
  .from('users')
  .insert({ email: 'new@example.com', name: 'New User' })
  .select();

// Update
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Updated' })
  .eq('id', userId);

// Delete
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId);
```

### Joins

```typescript
// One-to-many
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    author:users(name, email)
  `);

// Many-to-many
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    tags:post_tags(tag:tags(*))
  `);
```

### Filters

```typescript
.eq('column', 'value')      // Equal
.neq('column', 'value')     // Not equal
.gt('column', value)        // Greater than
.gte('column', value)       // Greater than or equal
.lt('column', value)        // Less than
.lte('column', value)       // Less than or equal
.like('column', '%value%')  // Pattern match
.ilike('column', '%VALUE%') // Case-insensitive pattern
.in('column', [1, 2, 3])    // In array
.contains('column', ['a'])  // Array contains
.range('column', 1, 10)     // Range
.is('column', null)         // Is null
```

## Type Generation

```bash
# From local
supabase gen types typescript --local > types/database.ts

# From remote
supabase gen types typescript --project-id your-project-ref > types/database.ts
```

### Usage

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database';

const supabase = createClient<Database>(url, key);

// Now fully typed!
const { data } = await supabase
  .from('users')
  .select('*');
// data is typed as Database['public']['Tables']['users']['Row'][]
```
