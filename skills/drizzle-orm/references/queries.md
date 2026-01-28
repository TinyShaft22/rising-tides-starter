# Queries

## Select

### Basic Select

```typescript
import { db } from './db';
import { users } from './schema';

// All rows
const allUsers = await db.select().from(users);

// Specific columns
const emails = await db.select({ email: users.email }).from(users);

// With alias
const result = await db.select({
  id: users.id,
  userEmail: users.email,
}).from(users);
```

### Where Conditions

```typescript
import { eq, ne, gt, gte, lt, lte, like, ilike, and, or, not, isNull, isNotNull, inArray } from 'drizzle-orm';

// Equality
const user = await db.select().from(users).where(eq(users.id, 1));

// Not equal
const others = await db.select().from(users).where(ne(users.id, 1));

// Comparison
const recent = await db.select().from(users).where(gt(users.createdAt, new Date('2024-01-01')));

// Pattern matching
const gmail = await db.select().from(users).where(like(users.email, '%@gmail.com'));
const gmailCI = await db.select().from(users).where(ilike(users.email, '%@GMAIL.COM')); // case insensitive

// Null checks
const withName = await db.select().from(users).where(isNotNull(users.name));
const noName = await db.select().from(users).where(isNull(users.name));

// In array
const specific = await db.select().from(users).where(inArray(users.id, [1, 2, 3]));

// Combined conditions
const filtered = await db.select().from(users).where(
  and(
    eq(users.role, 'admin'),
    or(
      like(users.email, '%@company.com'),
      isNotNull(users.verifiedAt)
    )
  )
);
```

### Ordering and Pagination

```typescript
import { asc, desc } from 'drizzle-orm';

// Order by
const sorted = await db.select().from(users).orderBy(asc(users.name));
const newest = await db.select().from(users).orderBy(desc(users.createdAt));

// Multiple order
const multi = await db.select().from(users).orderBy(desc(users.role), asc(users.name));

// Pagination
const page = await db.select()
  .from(users)
  .limit(10)
  .offset(20); // Skip first 20, take 10
```

## Insert

### Single Insert

```typescript
// Insert and return
const newUser = await db.insert(users).values({
  email: 'user@example.com',
  name: 'John',
}).returning();

// Insert without return
await db.insert(users).values({
  email: 'user@example.com',
});

// Return specific fields
const { id } = await db.insert(users).values({
  email: 'user@example.com',
}).returning({ id: users.id });
```

### Multiple Insert

```typescript
await db.insert(users).values([
  { email: 'user1@example.com', name: 'User 1' },
  { email: 'user2@example.com', name: 'User 2' },
  { email: 'user3@example.com', name: 'User 3' },
]);
```

### Upsert (On Conflict)

```typescript
await db.insert(users)
  .values({ email: 'user@example.com', name: 'John' })
  .onConflictDoUpdate({
    target: users.email,
    set: { name: 'John Updated' },
  });

// Do nothing on conflict
await db.insert(users)
  .values({ email: 'user@example.com' })
  .onConflictDoNothing();
```

## Update

```typescript
// Update with condition
await db.update(users)
  .set({ name: 'New Name' })
  .where(eq(users.id, 1));

// Update multiple fields
await db.update(users)
  .set({
    name: 'New Name',
    updatedAt: new Date(),
  })
  .where(eq(users.id, 1));

// Update with returning
const updated = await db.update(users)
  .set({ name: 'New Name' })
  .where(eq(users.id, 1))
  .returning();
```

## Delete

```typescript
// Delete with condition
await db.delete(users).where(eq(users.id, 1));

// Delete with returning
const deleted = await db.delete(users)
  .where(eq(users.id, 1))
  .returning();

// Delete all (careful!)
await db.delete(users);
```

## Joins

```typescript
// Left join
const postsWithAuthors = await db
  .select({
    postId: posts.id,
    postTitle: posts.title,
    authorName: users.name,
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id));

// Inner join
const postsWithAuthors = await db
  .select()
  .from(posts)
  .innerJoin(users, eq(posts.authorId, users.id));

// Multiple joins
const result = await db
  .select()
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .leftJoin(categories, eq(posts.categoryId, categories.id));
```

## Aggregates

```typescript
import { count, sum, avg, min, max } from 'drizzle-orm';

// Count
const userCount = await db.select({ count: count() }).from(users);

// Count with condition
const adminCount = await db
  .select({ count: count() })
  .from(users)
  .where(eq(users.role, 'admin'));

// Group by
const countByRole = await db
  .select({
    role: users.role,
    count: count(),
  })
  .from(users)
  .groupBy(users.role);

// Sum, avg, min, max
const stats = await db
  .select({
    total: sum(orders.amount),
    average: avg(orders.amount),
    minimum: min(orders.amount),
    maximum: max(orders.amount),
  })
  .from(orders);
```

## Raw SQL

```typescript
import { sql } from 'drizzle-orm';

// Raw expression
const result = await db.select({
  id: users.id,
  upperName: sql<string>`UPPER(${users.name})`,
}).from(users);

// Raw where
const filtered = await db.select().from(users)
  .where(sql`${users.createdAt} > NOW() - INTERVAL '7 days'`);

// Full raw query
const raw = await db.execute(sql`SELECT * FROM users WHERE id = ${id}`);
```
