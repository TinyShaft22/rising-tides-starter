# CLI Setup

## Installation

### macOS

```bash
brew install supabase/tap/supabase
```

### Windows

```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### npm (Any Platform)

```bash
npm install -g supabase
```

### Docker (Required for Local Dev)

Supabase CLI requires Docker for local development.

## Authentication

```bash
# Login (opens browser)
supabase login

# Verify
supabase projects list
```

## Project Initialization

```bash
# Create new project directory
mkdir my-project && cd my-project

# Initialize Supabase
supabase init
```

This creates:
```
supabase/
├── config.toml       # Local config
├── migrations/       # SQL migrations
└── seed.sql          # Seed data
```

## Link to Remote

```bash
# Get project ref from Supabase Dashboard URL
# https://app.supabase.com/project/[project-ref]

supabase link --project-ref your-project-ref
```

## Common Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database (re-run migrations)
supabase db reset

# Generate types
supabase gen types typescript --local > types/database.ts

# Push migrations to remote
supabase db push

# Pull remote schema
supabase db pull
```

## Configuration

### supabase/config.toml

```toml
[api]
port = 54321

[db]
port = 54322

[studio]
port = 54323

[auth]
site_url = "http://localhost:3000"
additional_redirect_urls = ["http://localhost:3000"]

[auth.email]
enable_signup = true
```
