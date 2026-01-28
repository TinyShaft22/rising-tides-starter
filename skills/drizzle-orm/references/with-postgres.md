# PostgreSQL Integration

## Setup

### With postgres.js (Recommended)

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

### With node-postgres (pg)

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(pool, { schema });
```

### With Neon (Serverless)

```bash
npm install drizzle-orm @neondatabase/serverless
```

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

## PostgreSQL Types

### Common Types

```typescript
import {
  pgTable,
  serial,
  bigserial,
  integer,
  bigint,
  smallint,
  text,
  varchar,
  char,
  boolean,
  timestamp,
  date,
  time,
  interval,
  numeric,
  real,
  doublePrecision,
  json,
  jsonb,
  uuid,
  inet,
  cidr,
  macaddr,
} from 'drizzle-orm/pg-core';

export const example = pgTable('example', {
  // Integers
  id: serial('id').primaryKey(),
  bigId: bigserial('big_id', { mode: 'number' }),
  count: integer('count'),
  smallCount: smallint('small_count'),

  // Text
  name: text('name'),
  code: varchar('code', { length: 10 }),
  initial: char('initial', { length: 1 }),

  // Boolean
  active: boolean('active'),

  // Date/Time
  createdAt: timestamp('created_at'),
  birthDate: date('birth_date'),
  startTime: time('start_time'),

  // Numeric
  price: numeric('price', { precision: 10, scale: 2 }),
  rating: real('rating'),
  exact: doublePrecision('exact'),

  // JSON
  data: json('data'),
  metadata: jsonb('metadata'),

  // Other
  uniqueId: uuid('unique_id').defaultRandom(),
  ipAddress: inet('ip_address'),
});
```

### Arrays

```typescript
import { text, integer } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  tags: text('tags').array(),
  scores: integer('scores').array(),
});

// Query
const post = await db.select().from(posts).where(
  sql`${posts.tags} @> ARRAY['typescript']`
);
```

### Custom Types

```typescript
import { customType } from 'drizzle-orm/pg-core';

const point = customType<{
  data: { x: number; y: number };
  driverData: string;
}>({
  dataType() {
    return 'point';
  },
  toDriver(value) {
    return `(${value.x},${value.y})`;
  },
  fromDriver(value) {
    const [x, y] = value.slice(1, -1).split(',').map(Number);
    return { x, y };
  },
});

export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  coordinates: point('coordinates'),
});
```

## PostgreSQL Features

### Full Text Search

```typescript
import { sql } from 'drizzle-orm';

// Add tsvector column
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  searchVector: sql<string>`tsvector`.as('search_vector'),
});

// Search query
const results = await db.select().from(articles).where(
  sql`${articles.searchVector} @@ to_tsquery('english', ${searchTerm})`
);
```

### Transactions

```typescript
await db.transaction(async (tx) => {
  await tx.insert(users).values({ email: 'user@example.com' });
  await tx.insert(profiles).values({ userId: 1, bio: 'Hello' });

  // Rollback on error automatically
});
```

### Prepared Statements

```typescript
const prepared = db.select().from(users).where(eq(users.id, sql.placeholder('id'))).prepare('get_user');

const user = await prepared.execute({ id: 1 });
```

## Drizzle Config

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // PostgreSQL-specific options
  verbose: true,
  strict: true,
});
```

## Connection Pooling

### For Serverless (Neon, Supabase)

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// HTTP mode for serverless
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

### For Long-Running (Traditional)

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);
```
