# Database Setup

## Schema Definition

```typescript
// src/lib/db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  serial,
  boolean,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';

// NextAuth required tables
export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  // Stripe fields
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripePriceId: text('stripe_price_id'),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
```

## Database Client

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

## Run Migrations

```bash
# Generate migration
npm run db:generate

# Push to database
npm run db:push

# Open studio
npm run db:studio
```

## Helper Functions

```typescript
// src/lib/db/queries.ts
import { eq } from 'drizzle-orm';
import { db } from '.';
import { users } from './schema';

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function updateUserStripeInfo(
  userId: string,
  data: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    stripeCurrentPeriodEnd?: Date;
  }
) {
  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user?.stripeCurrentPeriodEnd) return false;
  return user.stripeCurrentPeriodEnd > new Date();
}
```

## Type Exports

```typescript
// src/lib/db/types.ts
import { users, accounts, sessions } from './schema';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
```
