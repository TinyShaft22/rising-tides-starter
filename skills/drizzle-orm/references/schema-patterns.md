# Schema Patterns

## Table Definitions

### Basic Table

```typescript
import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### With Enums

```typescript
import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'guest']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').default('user').notNull(),
});
```

### With JSON

```typescript
import { jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  metadata: jsonb('metadata').$type<{
    preferences: { theme: 'light' | 'dark' };
    settings: Record<string, unknown>;
  }>(),
});
```

## Relations

### One-to-Many

```typescript
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  authorId: integer('author_id').references(() => users.id),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

### Many-to-Many

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

// Junction table
export const usersToGroups = pgTable('users_to_groups', {
  userId: integer('user_id').notNull().references(() => users.id),
  groupId: integer('group_id').notNull().references(() => groups.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.groupId] }),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
}));
```

## Indexes

```typescript
import { index, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex('email_idx').on(table.email),
  nameIdx: index('name_idx').on(table.name),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));
```

## Constraints

```typescript
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').default(0),
}, (table) => ({
  priceCheck: check('price_positive', sql`${table.price} > 0`),
  stockCheck: check('stock_non_negative', sql`${table.stock} >= 0`),
}));
```

## Common Patterns

### Soft Delete

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  deletedAt: timestamp('deleted_at'),
});

// Query only active users
const activeUsers = await db
  .select()
  .from(users)
  .where(isNull(users.deletedAt));
```

### Timestamps Mixin

```typescript
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  ...timestamps,
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  ...timestamps,
});
```
