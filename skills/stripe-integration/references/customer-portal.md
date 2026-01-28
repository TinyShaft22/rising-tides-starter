# Customer Portal

## Overview

The Stripe Customer Portal is a pre-built page where customers can:
- Update payment methods
- View billing history
- Cancel or modify subscriptions
- Update billing information

## Create Portal Session

```typescript
const session = await stripe.billingPortal.sessions.create({
  customer: 'cus_xxx',
  return_url: 'https://yoursite.com/account',
});

// Redirect to session.url
```

## Next.js Integration

### API Route

```typescript
// app/api/portal/route.ts
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's Stripe customer ID
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: 'No billing account' },
      { status: 400 }
    );
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/account`,
  });

  return NextResponse.json({ url: portalSession.url });
}
```

### Client Component

```typescript
'use client';

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    const res = await fetch('/api/portal', { method: 'POST' });
    const { url } = await res.json();

    window.location.href = url;
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Manage Subscription'}
    </button>
  );
}
```

## Configure Portal

### Via Dashboard

1. Go to Settings > Billing > Customer portal
2. Configure allowed actions:
   - Update payment methods
   - Cancel subscriptions
   - Switch plans
   - View invoices

### Via API

```typescript
const configuration = await stripe.billingPortal.configurations.create({
  business_profile: {
    headline: 'Manage your subscription',
  },
  features: {
    customer_update: {
      enabled: true,
      allowed_updates: ['email', 'address'],
    },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    subscription_cancel: {
      enabled: true,
      mode: 'at_period_end',
      proration_behavior: 'none',
    },
    subscription_update: {
      enabled: true,
      default_allowed_updates: ['price'],
      proration_behavior: 'create_prorations',
      products: [
        {
          product: 'prod_xxx',
          prices: ['price_monthly', 'price_annual'],
        },
      ],
    },
  },
});
```

## Common Patterns

### Portal Link in Email

```typescript
// Include portal link in emails
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: 'https://yoursite.com',
});

await sendEmail({
  to: customerEmail,
  subject: 'Manage your subscription',
  body: `Click here to manage: ${portalSession.url}`,
});
```

### Show Billing Info

```typescript
// Display current subscription info before portal redirect
async function getBillingInfo(customerId: string) {
  const [customer, subscriptions, invoices] = await Promise.all([
    stripe.customers.retrieve(customerId),
    stripe.subscriptions.list({ customer: customerId, limit: 1 }),
    stripe.invoices.list({ customer: customerId, limit: 5 }),
  ]);

  return {
    email: customer.email,
    subscription: subscriptions.data[0],
    recentInvoices: invoices.data,
  };
}
```

## Portal Events

Handle portal-triggered events:

```typescript
switch (event.type) {
  case 'customer.subscription.updated':
    // Plan changed via portal
    break;

  case 'customer.subscription.deleted':
    // Canceled via portal
    break;

  case 'payment_method.attached':
    // New payment method added
    break;

  case 'customer.updated':
    // Customer info updated
    break;
}
```
