# Webhooks

## Local Development

### Forward Webhooks

```bash
# Start listener
stripe listen --forward-to localhost:3000/api/webhooks

# Output shows webhook signing secret:
# > Ready! Your webhook signing secret is whsec_xxx
```

### Trigger Test Events

```bash
# Common events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
stripe trigger checkout.session.completed

# List all available events
stripe trigger --help
```

## Webhook Handler (Next.js)

### App Router

```typescript
// app/api/webhooks/route.ts
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

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
    console.error('Webhook signature verification failed');
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle events
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Error handling webhook:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
```

### Event Handlers

```typescript
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  // Get customer and subscription IDs
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Find user by customer ID or email
  const user = await db.query.users.findFirst({
    where: or(
      eq(users.stripeCustomerId, customerId),
      eq(users.email, session.customer_email!)
    ),
  });

  if (!user) {
    throw new Error(`No user found for customer ${customerId}`);
  }

  // Update user with Stripe IDs
  await db.update(users)
    .set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'active',
    })
    .where(eq(users.id, user.id));
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await db.update(users)
    .set({
      subscriptionStatus: subscription.status,
      subscriptionPriceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    })
    .where(eq(users.stripeCustomerId, subscription.customer as string));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db.update(users)
    .set({
      subscriptionStatus: 'canceled',
      stripeSubscriptionId: null,
    })
    .where(eq(users.stripeCustomerId, subscription.customer as string));
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Send email, show banner, etc.
  const customerId = invoice.customer as string;

  await db.update(users)
    .set({ subscriptionStatus: 'past_due' })
    .where(eq(users.stripeCustomerId, customerId));

  // Optionally send notification
  await sendPaymentFailedEmail(customerId);
}
```

## Production Setup

### Configure in Stripe Dashboard

1. Go to Developers > Webhooks
2. Add endpoint: `https://yoursite.com/api/webhooks`
3. Select events to receive
4. Copy signing secret to environment

### Environment Variables

```env
# Local development
STRIPE_WEBHOOK_SECRET=whsec_xxx # From stripe listen

# Production
STRIPE_WEBHOOK_SECRET=whsec_xxx # From Stripe Dashboard
```

### Essential Events

| Event | When | Action |
|-------|------|--------|
| `checkout.session.completed` | Checkout success | Activate subscription |
| `customer.subscription.created` | New subscription | Record in database |
| `customer.subscription.updated` | Plan/status change | Update database |
| `customer.subscription.deleted` | Subscription ended | Revoke access |
| `invoice.payment_succeeded` | Renewal success | Extend access |
| `invoice.payment_failed` | Renewal failed | Notify user |

## Best Practices

1. **Always verify signatures** - Never trust webhook data without verification
2. **Return 200 quickly** - Do async work after acknowledging receipt
3. **Handle duplicates** - Stripe may retry, make handlers idempotent
4. **Log everything** - Record event IDs for debugging
5. **Test thoroughly** - Use CLI triggers before going live
