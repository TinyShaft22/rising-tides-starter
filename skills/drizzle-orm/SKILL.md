---
name: drizzle-orm
description: "Drizzle ORM for TypeScript. Schema design, migrations, queries, and PostgreSQL integration. Use when working with Drizzle, defining database schemas, or running migrations. Triggers on: 'drizzle', 'database schema', 'migration', 'ORM', 'drizzle-kit'."
---

# Drizzle ORM

TypeScript-first ORM with type-safe queries and migrations.

## Prerequisites

**Install Drizzle:**
```bash
npm install drizzle-orm
npm install -D drizzle-kit
```

**For PostgreSQL:**
```bash
npm install postgres  # or pg
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Generate migration | `npx drizzle-kit generate` |
| Run migrations | `npx drizzle-kit migrate` |
| Push schema (dev) | `npx drizzle-kit push` |
| Open Drizzle Studio | `npx drizzle-kit studio` |
| Check schema diff | `npx drizzle-kit check` |

---

## Project Setup

### 1. Create drizzle.config.ts

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 2. Define Schema (src/db/schema.ts)

```typescript
import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false),
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 3. Create Database Client (src/db/index.ts)

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

---

## Common Queries

### Select

```typescript
// All users
const allUsers = await db.select().from(users);

// With conditions
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.email, 'test@example.com'));

// Select specific columns
const names = await db
  .select({ name: users.name, email: users.email })
  .from(users);
```

### Insert

```typescript
// Single insert
const newUser = await db.insert(users).values({
  email: 'user@example.com',
  name: 'John',
}).returning();

// Multiple insert
await db.insert(users).values([
  { email: 'user1@example.com', name: 'User 1' },
  { email: 'user2@example.com', name: 'User 2' },
]);
```

### Update

```typescript
await db
  .update(users)
  .set({ name: 'Updated Name' })
  .where(eq(users.id, 1));
```

### Delete

```typescript
await db.delete(users).where(eq(users.id, 1));
```

### Joins

```typescript
const postsWithAuthors = await db
  .select({
    post: posts,
    author: users,
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id));
```

---

## Migration Workflow

```bash
# 1. Make schema changes in schema.ts

# 2. Generate migration
npx drizzle-kit generate

# 3. Review generated SQL in /drizzle folder

# 4. Run migration
npx drizzle-kit migrate
```

**For development (quick iteration):**
```bash
npx drizzle-kit push  # Pushes schema directly without migration files
```

---

## Reference Files

- `references/schema-patterns.md` — Defining tables, relations
- `references/migrations.md` — Generate, run, rollback
- `references/queries.md` — Select, insert, update, delete
- `references/with-postgres.md` — PostgreSQL-specific patterns

---

## When to Use

- Starting a new TypeScript project with a database
- Need type-safe database queries
- Migrating from another ORM
- Building Next.js/Node.js applications
- Working with PostgreSQL, MySQL, or SQLite
