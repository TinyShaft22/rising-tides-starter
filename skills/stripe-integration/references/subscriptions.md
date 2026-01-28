# Subscriptions

## Subscription Lifecycle

```
Created → Active → (Past Due) → Canceled/Expired
                 ↳ Paused
```

## Creating Subscriptions

### Via Checkout (Recommended)

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  customer: customerId,
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  success_url: 'https://yoursite.com/success',
  cancel_url: 'https://yoursite.com/cancel',
});
```

### Direct API

```typescript
const subscription = await stripe.subscriptions.create({
  customer: 'cus_xxx',
  items: [{ price: 'price_xxx' }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
});

// If payment required, use subscription.latest_invoice.payment_intent.client_secret
// to complete payment on frontend
```

### With Trial

```typescript
const subscription = await stripe.subscriptions.create({
  customer: 'cus_xxx',
  items: [{ price: 'price_xxx' }],
  trial_period_days: 14,
});
```

## Managing Subscriptions

### Retrieve

```typescript
const subscription = await stripe.subscriptions.retrieve('sub_xxx');

console.log(subscription.status); // 'active', 'past_due', 'canceled', etc.
console.log(subscription.current_period_end); // Unix timestamp
```

### List Customer Subscriptions

```typescript
const subscriptions = await stripe.subscriptions.list({
  customer: 'cus_xxx',
  status: 'active',
});
```

### Update

```typescript
// Change price (upgrade/downgrade)
const subscription = await stripe.subscriptions.update('sub_xxx', {
  items: [
    {
      id: subscription.items.data[0].id,
      price: 'price_new_xxx',
    },
  ],
  proration_behavior: 'create_prorations', // or 'none'
});
```

### Cancel

```typescript
// Cancel at period end (recommended)
const subscription = await stripe.subscriptions.update('sub_xxx', {
  cancel_at_period_end: true,
});

// Cancel immediately
const subscription = await stripe.subscriptions.cancel('sub_xxx');
```

### Pause

```typescript
// Pause collection
const subscription = await stripe.subscriptions.update('sub_xxx', {
  pause_collection: {
    behavior: 'void', // or 'keep_as_draft', 'mark_uncollectible'
  },
});

// Resume
const subscription = await stripe.subscriptions.update('sub_xxx', {
  pause_collection: '', // Empty to resume
});
```

## Handling Subscription Events

### Key Webhook Events

```typescript
switch (event.type) {
  case 'customer.subscription.created':
    // New subscription
    break;

  case 'customer.subscription.updated':
    // Status change, plan change, etc.
    break;

  case 'customer.subscription.deleted':
    // Subscription ended
    break;

  case 'invoice.payment_succeeded':
    // Successful renewal
    break;

  case 'invoice.payment_failed':
    // Failed payment - may need dunning
    break;

  case 'customer.subscription.trial_will_end':
    // Trial ending in 3 days
    break;
}
```

### Example Handler

```typescript
// Handle subscription updates
if (event.type === 'customer.subscription.updated') {
  const subscription = event.data.object;

  // Update your database
  await db.update(users)
    .set({
      subscriptionStatus: subscription.status,
      subscriptionPriceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    })
    .where(eq(users.stripeCustomerId, subscription.customer));
}
```

## Common Patterns

### Check Subscription Status

```typescript
async function hasActiveSubscription(customerId: string): Promise<boolean> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  return subscriptions.data.length > 0;
}
```

### Get Current Plan

```typescript
async function getCurrentPlan(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    expand: ['data.items.data.price.product'],
  });

  if (subscriptions.data.length === 0) return null;

  const subscription = subscriptions.data[0];
  const item = subscription.items.data[0];

  return {
    subscriptionId: subscription.id,
    status: subscription.status,
    priceId: item.price.id,
    productId: item.price.product,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  };
}
```

### Upgrade/Downgrade

```typescript
async function changePlan(subscriptionId: string, newPriceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}
```
