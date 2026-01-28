---
name: stripe-integration
description: "Stripe payments using Stripe CLI. Setup, products, checkout, subscriptions, webhooks. Use when integrating payments, setting up Stripe, or handling subscriptions. Triggers on: 'stripe', 'payments', 'checkout', 'subscription', 'billing', 'payment integration'."
---

# Stripe Integration

Payment integration using the Stripe CLI and SDK.

## Prerequisites

### 1. Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (scoop)
scoop install stripe

# Linux
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe
```

### 2. Login to Stripe

```bash
stripe login
```

### 3. Verify Setup

```bash
stripe config --list
```

---

## Quick Reference

| Task | Command |
|------|---------|
| List products | `stripe products list` |
| Create product | `stripe products create --name="Product"` |
| Create price | `stripe prices create --product=prod_xxx --unit-amount=1999 --currency=usd` |
| Listen for webhooks | `stripe listen --forward-to localhost:3000/api/webhooks` |
| Trigger test event | `stripe trigger payment_intent.succeeded` |

---

## Setup Workflow

### 1. Install Stripe SDK

```bash
npm install stripe
```

### 2. Create Stripe Client

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});
```

### 3. Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Core Integrations

### Create Checkout Session

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment', // or 'subscription'
  line_items: [
    {
      price: 'price_xxx',
      quantity: 1,
    },
  ],
  success_url: 'https://yoursite.com/success',
  cancel_url: 'https://yoursite.com/cancel',
});

// Redirect to session.url
```

### Create Subscription

```typescript
const subscription = await stripe.subscriptions.create({
  customer: 'cus_xxx',
  items: [{ price: 'price_xxx' }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
});
```

### Handle Webhooks

```typescript
// app/api/webhooks/route.ts (Next.js App Router)
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook error', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful payment
      break;
    case 'customer.subscription.updated':
      // Handle subscription change
      break;
  }

  return new Response('OK', { status: 200 });
}
```

---

## Local Development

### Forward Webhooks

```bash
# Terminal 1: Start your app
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks
```

### Test Events

```bash
# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

---

## Optional: MCP Enhancement

If using the stripe-plugin, the MCP provides richer API integration:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    }
  }
}
```

The MCP allows Claude to make direct Stripe API calls for complex operations.

---

## Reference Files

- `references/cli-setup.md` — Install, login, test mode
- `references/products-prices.md` — Create products and prices
- `references/checkout.md` — Checkout sessions
- `references/subscriptions.md` — Subscription lifecycle
- `references/webhooks.md` — Webhook setup and handling
- `references/customer-portal.md` — Customer self-service

---

## When to Use

- Adding payments to a web application
- Setting up subscription billing
- Creating a checkout flow
- Testing payment webhooks locally
- Managing products and prices
