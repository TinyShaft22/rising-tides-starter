---
name: saas-starter-setup
description: "Quick SaaS setup using the official Next.js SaaS Starter (15k+ stars). Teams, roles, Stripe, auth — all pre-built. Clone and customize in minutes. Triggers on: 'saas starter', 'start saas', 'new saas project', 'saas template', 'quick saas', 'nextjs saas'."
---

# SaaS Starter Setup

Get a production-ready SaaS running in minutes using the official Next.js SaaS Starter.

> **Want more control?** Use `/saas-from-scratch` to build piece-by-piece with full customization.

---

## Why This Template?

| Feature | Included |
|---------|----------|
| **Auth** | Email/password with JWT |
| **Teams** | Multi-user team management |
| **Roles** | Owner and Member permissions |
| **Payments** | Stripe subscriptions + Customer Portal |
| **Dashboard** | User and team CRUD operations |
| **Activity Log** | Built-in event tracking |
| **Landing Page** | Marketing page with pricing |

**Source:** [github.com/nextjs/saas-starter](https://github.com/nextjs/saas-starter) (15k+ stars, maintained by Vercel)

---

## Quick Start

### 1. Clone the Template

```bash
git clone https://github.com/nextjs/saas-starter.git my-saas
cd my-saas
npm install
```

### 2. Set Up Database

Create a PostgreSQL database (Vercel Postgres, Neon, Supabase, or local).

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env`:
```env
POSTGRES_URL=postgres://user:pass@host:5432/dbname
```

Push the schema:
```bash
npm run db:push
```

### 3. Configure Stripe

1. Create products in [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Get your API keys from [Stripe API Keys](https://dashboard.stripe.com/apikeys)
3. Add to `.env`:

```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_PRICE_ID=price_xxx
```

4. Set up webhook endpoint in Stripe → `/api/webhooks/stripe`

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
my-saas/
├── app/
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── dashboard/
│   │   └── settings/
│   ├── (marketing)/         # Public marketing pages
│   │   ├── page.tsx         # Landing page
│   │   └── pricing/
│   ├── api/
│   │   ├── auth/            # Auth endpoints
│   │   └── webhooks/stripe/ # Stripe webhooks
│   └── layout.tsx
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── ...
├── lib/
│   ├── db/
│   │   ├── drizzle.ts       # Database client
│   │   └── schema.ts        # Database schema
│   ├── auth/                # Auth utilities
│   ├── payments/            # Stripe utilities
│   └── ...
└── drizzle.config.ts
```

---

## Common Customizations

### Add OAuth Providers

Edit `lib/auth/config.ts`:
```typescript
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
};
```

### Change Pricing Tiers

Edit your Stripe products and update the price IDs in `.env`:
```env
STRIPE_PRICE_ID_BASIC=price_xxx
STRIPE_PRICE_ID_PRO=price_xxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxx
```

### Add New Database Tables

Edit `lib/db/schema.ts`:
```typescript
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').references(() => teams.id),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

Then push:
```bash
npm run db:push
```

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add POSTGRES_URL production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
# ... etc

# Deploy to production
vercel --prod
```

**Important:** Update your Stripe webhook URL to your production domain.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `POSTGRES_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random string for JWT signing |
| `NEXTAUTH_URL` | Your app URL (http://localhost:3000 for dev) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRICE_ID` | Default Stripe price ID |

---

## When to Use

- **Starting a new SaaS quickly** — Teams, auth, payments ready in minutes
- **Need multi-user support** — Team management built-in
- **Want battle-tested code** — 15k+ stars, maintained by Vercel
- **Standard SaaS patterns** — Follows best practices

---

## When to Use `/saas-from-scratch` Instead

- **Need different auth** — OAuth only, no email/password
- **Don't need teams** — Simpler single-user setup
- **Want to learn** — Understand every piece of the stack
- **Highly custom requirements** — Non-standard architecture
