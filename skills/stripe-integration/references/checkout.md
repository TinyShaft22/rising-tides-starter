# Checkout Sessions

## Overview

Stripe Checkout is a pre-built payment page. Redirect users there to collect payment.

## Creating Checkout Sessions

### One-Time Payment

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [
    {
      price: 'price_xxx', // Pre-created price
      quantity: 1,
    },
  ],
  success_url: 'https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://yoursite.com/cancel',
});

// Redirect to session.url
```

### Subscription

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [
    {
      price: 'price_xxx', // Recurring price
      quantity: 1,
    },
  ],
  success_url: 'https://yoursite.com/success',
  cancel_url: 'https://yoursite.com/cancel',
});
```

### With Customer

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  customer: 'cus_xxx', // Existing customer
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  success_url: 'https://yoursite.com/success',
  cancel_url: 'https://yoursite.com/cancel',
});
```

### Create Customer During Checkout

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  customer_email: 'user@example.com',
  customer_creation: 'always',
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  success_url: 'https://yoursite.com/success',
  cancel_url: 'https://yoursite.com/cancel',
});
```

## Customization

### Collect Billing Address

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  billing_address_collection: 'required',
  // ...
});
```

### Collect Shipping Address

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  shipping_address_collection: {
    allowed_countries: ['US', 'CA', 'GB'],
  },
  // ...
});
```

### Custom Fields

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  custom_fields: [
    {
      key: 'company',
      label: { type: 'custom', custom: 'Company Name' },
      type: 'text',
      optional: true,
    },
  ],
  // ...
});
```

### Metadata

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  metadata: {
    userId: 'user_123',
    orderId: 'order_456',
  },
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  // ...
});
```

## Next.js Integration

### API Route (App Router)

```typescript
// app/api/checkout/route.ts
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { priceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
```

### Client Component

```typescript
'use client';

export function CheckoutButton({ priceId }: { priceId: string }) {
  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <button onClick={handleCheckout}>
      Subscribe
    </button>
  );
}
```

## Retrieve Session

```typescript
// After successful payment, retrieve session details
const session = await stripe.checkout.sessions.retrieve(sessionId, {
  expand: ['customer', 'subscription'],
});

console.log(session.customer); // Customer object
console.log(session.subscription); // Subscription object
```

## Handle Success

```typescript
// app/success/page.tsx
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const session = await stripe.checkout.sessions.retrieve(
    searchParams.session_id
  );

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Customer: {session.customer_email}</p>
    </div>
  );
}
```
