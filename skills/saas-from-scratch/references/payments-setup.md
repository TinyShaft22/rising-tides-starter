# Payments Setup

## Stripe Client

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});
```

## Create Checkout Session

```typescript
// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { getUserById } from '@/lib/db/queries';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserById(session.user.id);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: user?.stripeCustomerId || undefined,
    customer_email: user?.stripeCustomerId ? undefined : session.user.email!,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
```

## Customer Portal

```typescript
// src/app/api/portal/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { getUserById } from '@/lib/db/queries';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserById(session.user.id);

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: 'No subscription' }, { status: 400 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/settings`,
  });

  return NextResponse.json({ url: portalSession.url });
}
```

## Webhook Handler

```typescript
// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;

      if (userId) {
        await db.update(users).set({
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        }).where(eq(users.id, userId));
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const subscription = event.data.object;

      await db.update(users).set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      }).where(eq(users.stripeCustomerId, subscription.customer as string));
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;

      await db.update(users).set({
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      }).where(eq(users.stripeCustomerId, subscription.customer as string));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

## Pricing Page

```typescript
// src/app/(marketing)/pricing/page.tsx
'use client';

import { Button } from '@/components/ui/button';

export default function PricingPage() {
  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing</h1>
      <div className="max-w-sm mx-auto border rounded-lg p-8">
        <h2 className="text-2xl font-bold">Pro Plan</h2>
        <p className="text-4xl font-bold mt-4">$9<span className="text-lg">/month</span></p>
        <ul className="mt-6 space-y-2">
          <li>✓ Unlimited access</li>
          <li>✓ Priority support</li>
          <li>✓ All features</li>
        </ul>
        <Button onClick={handleCheckout} className="w-full mt-8">
          Get Started
        </Button>
      </div>
    </div>
  );
}
```

## Check Subscription

```typescript
// src/lib/subscription.ts
import { getUserById } from './db/queries';

export async function isPro(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user?.stripeCurrentPeriodEnd) return false;
  return user.stripeCurrentPeriodEnd > new Date();
}
```
