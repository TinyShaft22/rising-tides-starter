---
name: saas-from-scratch
description: "Build a SaaS from scratch, piece by piece. Next.js + PostgreSQL + Drizzle + Stripe + Vercel. Use when you want full control over your stack or want to learn how everything connects. Triggers on: 'build saas from scratch', 'custom saas', 'learn saas stack', 'saas tutorial', 'manual saas setup'."
---

# SaaS From Scratch

Build a complete SaaS application step-by-step with full control over every piece.

> **Want a faster start?** Use `/saas-starter-setup` to clone the official Next.js SaaS Starter with teams, roles, and Stripe already wired up.

## The Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Database** | PostgreSQL + Drizzle ORM |
| **Auth** | NextAuth.js with OAuth |
| **Payments** | Stripe (subscriptions) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Hosting** | Vercel |

---

## Quick Start

### 1. Create Project

```bash
npx create-next-app@latest my-saas --typescript --tailwind --app --eslint
cd my-saas
```

### 2. Install Dependencies

```bash
npm install drizzle-orm postgres @auth/drizzle-adapter next-auth stripe @stripe/stripe-js
npm install -D drizzle-kit
```

### 3. Add shadcn/ui

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label
```

---

## Project Structure

```
my-saas/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── webhooks/stripe/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               # shadcn components
│   └── ...
├── lib/
│   ├── db/
│   │   ├── index.ts      # Drizzle client
│   │   └── schema.ts     # Database schema
│   ├── auth.ts           # NextAuth config
│   └── stripe.ts         # Stripe client
├── drizzle/              # Migrations
└── drizzle.config.ts
```

---

## Database Setup

### Schema

```typescript
// lib/db/schema.ts
import { pgTable, text, timestamp, serial, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripePriceId: text('stripe_price_id'),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripePriceId: text('stripe_price_id'),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  status: text('status'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Environment

```env
DATABASE_URL=postgres://...

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=xxx

GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx
```

---

## Auth Setup

```typescript
// lib/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: { ...session.user, id: user.id },
    }),
  },
});
```

---

## Stripe Integration

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Create checkout session
export async function createCheckoutSession(userId: string, priceId: string) {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: undefined, // or pass email
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: { userId },
  });
}
```

---

## Deployment

```bash
# Push database
npx drizzle-kit push

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel
vercel env add DATABASE_URL production
vercel env add STRIPE_SECRET_KEY production
# ... etc
```

---

## Reference Files

- `references/stack-overview.md` — Technology decisions
- `references/project-setup.md` — Scaffolding steps
- `references/database-setup.md` — Schema and migrations
- `references/auth-setup.md` — NextAuth configuration
- `references/payments-setup.md` — Stripe integration
- `references/deployment-setup.md` — Vercel deployment

---

## When to Use

- Starting a new SaaS product from scratch
- Need user auth + payments quickly
- Want modern, production-ready architecture
- Building subscription-based applications
