# Project Setup

## Step 1: Create Next.js App

```bash
npx create-next-app@latest my-saas \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --src-dir \
  --import-alias "@/*"

cd my-saas
```

## Step 2: Install Dependencies

```bash
# Database
npm install drizzle-orm postgres
npm install -D drizzle-kit

# Auth
npm install next-auth @auth/drizzle-adapter

# Payments
npm install stripe @stripe/stripe-js

# UI
npm install lucide-react class-variance-authority clsx tailwind-merge
```

## Step 3: Add shadcn/ui

```bash
npx shadcn-ui@latest init

# Select:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Add components
npx shadcn-ui@latest add button card input label avatar dropdown-menu
```

## Step 4: Environment Setup

Create `.env.local`:

```env
# Database
DATABASE_URL=postgres://...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=openssl rand -base64 32

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
```

## Step 5: Project Structure

```bash
# Create directories
mkdir -p src/lib/db
mkdir -p src/app/api/auth/\[...nextauth\]
mkdir -p src/app/api/webhooks/stripe
mkdir -p src/app/\(auth\)/login
mkdir -p src/app/\(dashboard\)/dashboard
mkdir -p src/app/\(marketing\)/pricing
```

## Step 6: Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Step 7: Configure Tailwind

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // shadcn/ui configuration
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

## Step 8: Drizzle Config

Create `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Step 9: Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/webhooks/stripe"
  }
}
```

## Verification

```bash
# Start dev server
npm run dev

# In another terminal, start Stripe listener
npm run stripe:listen

# Visit http://localhost:3000
```
