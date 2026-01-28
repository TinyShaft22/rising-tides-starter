# Migrations

## Migration Commands

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Run pending migrations
npx drizzle-kit migrate

# Push schema directly (development only)
npx drizzle-kit push

# View current schema status
npx drizzle-kit check

# Drop everything and recreate (dangerous!)
npx drizzle-kit drop
```

## Configuration

### drizzle.config.ts

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Schema file location
  schema: './src/db/schema.ts',

  // Output directory for migrations
  out: './drizzle',

  // Database dialect
  dialect: 'postgresql', // or 'mysql', 'sqlite'

  // Connection
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // Optional: verbose output
  verbose: true,

  // Optional: strict mode
  strict: true,
});
```

## Migration Workflow

### Development

```bash
# 1. Edit schema.ts
# 2. Push changes directly (fast iteration)
npx drizzle-kit push

# Open Drizzle Studio to inspect
npx drizzle-kit studio
```

### Production

```bash
# 1. Edit schema.ts
# 2. Generate migration file
npx drizzle-kit generate

# 3. Review generated SQL in /drizzle folder
cat drizzle/0001_migration_name.sql

# 4. Run migration
npx drizzle-kit migrate
```

## Generated Migration Files

Migrations are stored in the `out` directory:

```
drizzle/
├── 0000_initial.sql
├── 0001_add_users_table.sql
├── 0002_add_posts_table.sql
└── meta/
    ├── 0000_snapshot.json
    ├── 0001_snapshot.json
    └── _journal.json
```

### Example Migration

```sql
-- drizzle/0001_add_posts_table.sql
CREATE TABLE IF NOT EXISTS "posts" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "content" text,
  "author_id" integer REFERENCES "users"("id"),
  "created_at" timestamp DEFAULT now() NOT NULL
);
```

## Programmatic Migration

```typescript
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './db';

async function runMigrations() {
  console.log('Running migrations...');

  await migrate(db, {
    migrationsFolder: './drizzle',
  });

  console.log('Migrations complete!');
}

runMigrations().catch(console.error);
```

## Custom Migrations

For complex changes, create custom SQL:

```sql
-- drizzle/custom/0001_data_migration.sql
-- Migrate existing data
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Add constraint after data cleanup
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
```

## Rollback Strategy

Drizzle doesn't have built-in rollback. Options:

### 1. Reverse Migration

Create a new migration that undoes changes:

```bash
# Original migration added column
# New migration removes it
npx drizzle-kit generate
```

### 2. Database Backup

```bash
# Before migration
pg_dump $DATABASE_URL > backup.sql

# If migration fails
psql $DATABASE_URL < backup.sql
```

### 3. Point-in-Time Recovery

Use database provider's backup/restore features.

## CI/CD Integration

```yaml
# GitHub Action example
- name: Run migrations
  run: npx drizzle-kit migrate
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Best Practices

1. **Always review generated SQL** before running
2. **Test migrations on staging** before production
3. **Backup database** before large migrations
4. **Use transactions** for data migrations
5. **Small, incremental changes** are safer than large ones
