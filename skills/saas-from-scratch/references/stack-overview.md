# Stack Overview

## Technology Decisions

### Framework: Next.js 14+ (App Router)

**Why:**
- Server Components reduce client bundle
- Built-in API routes
- Excellent Vercel integration
- Industry standard for React apps

### Database: PostgreSQL + Drizzle ORM

**Why PostgreSQL:**
- Reliable, battle-tested
- Excellent Vercel Postgres / Neon integration
- ACID compliance for payments

**Why Drizzle:**
- Type-safe queries
- Lightweight (no query builder runtime)
- Great DX with migrations
- SQL-like syntax

### Auth: NextAuth.js

**Why:**
- Battle-tested OAuth integration
- Database adapters included
- Session management built-in
- Easy to extend

### Payments: Stripe

**Why:**
- Industry standard
- Excellent developer experience
- Webhooks for automation
- Customer portal included

### Styling: Tailwind CSS + shadcn/ui

**Why Tailwind:**
- Utility-first = fast iteration
- No CSS-in-JS runtime
- Excellent documentation

**Why shadcn/ui:**
- Copy-paste components (own your code)
- Accessible by default
- Highly customizable
- Not a dependency

### Hosting: Vercel

**Why:**
- Zero-config Next.js deployment
- Automatic preview deployments
- Built-in analytics
- Edge functions

## Alternative Choices

| Choice | Alternative | When to Consider |
|--------|-------------|------------------|
| PostgreSQL | MySQL, SQLite | Existing infrastructure |
| Drizzle | Prisma | Need relation queries |
| NextAuth | Clerk, Auth0 | Need managed auth |
| Stripe | Paddle, LemonSqueezy | Different payment models |
| shadcn/ui | Chakra, MUI | Need more components |
| Vercel | Netlify, Railway | Cost or features |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Vercel                               │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │   Next.js App   │  │  Vercel Postgres │                  │
│  │  (App Router)   │──│   (or Neon)      │                  │
│  └────────┬────────┘  └─────────────────┘                   │
│           │                                                  │
└───────────┼──────────────────────────────────────────────────┘
            │
   ┌────────┴────────┐
   │                 │
┌──▼───┐        ┌────▼────┐
│Stripe│        │  OAuth  │
│ API  │        │Providers│
└──────┘        └─────────┘
```

## Data Flow

1. **User visits** → Next.js serves page
2. **User signs in** → NextAuth handles OAuth → Creates user in DB
3. **User subscribes** → Checkout session → Stripe processes → Webhook updates DB
4. **User accesses features** → Check subscription status → Allow/deny
