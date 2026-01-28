# Products and Prices

## Concepts

- **Product**: What you're selling (e.g., "Pro Plan", "API Credits")
- **Price**: How much it costs, with billing details (e.g., "$10/month", "$0.01/unit")

One product can have multiple prices (monthly vs annual, different currencies).

## CLI Commands

### Products

```bash
# List products
stripe products list

# Create product
stripe products create \
  --name="Pro Plan" \
  --description="Access to all features"

# Create with metadata
stripe products create \
  --name="Pro Plan" \
  --metadata[tier]=pro \
  --metadata[features]="unlimited,priority"

# Update product
stripe products update prod_xxx \
  --name="Pro Plan (Updated)"

# Archive product (soft delete)
stripe products update prod_xxx --active=false

# Delete product (only if no prices)
stripe products delete prod_xxx
```

### Prices

```bash
# List prices
stripe prices list

# Create one-time price
stripe prices create \
  --product=prod_xxx \
  --unit-amount=1999 \
  --currency=usd

# Create recurring price (subscription)
stripe prices create \
  --product=prod_xxx \
  --unit-amount=999 \
  --currency=usd \
  --recurring[interval]=month

# Annual price
stripe prices create \
  --product=prod_xxx \
  --unit-amount=9999 \
  --currency=usd \
  --recurring[interval]=year

# Metered price (usage-based)
stripe prices create \
  --product=prod_xxx \
  --unit-amount=1 \
  --currency=usd \
  --recurring[interval]=month \
  --recurring[usage_type]=metered
```

## SDK Examples

### Create Product with Price

```typescript
import { stripe } from './stripe';

// Create product
const product = await stripe.products.create({
  name: 'Pro Plan',
  description: 'Access to all features',
  metadata: {
    tier: 'pro',
  },
});

// Create monthly price
const monthlyPrice = await stripe.prices.create({
  product: product.id,
  unit_amount: 999, // $9.99
  currency: 'usd',
  recurring: {
    interval: 'month',
  },
  metadata: {
    plan: 'monthly',
  },
});

// Create annual price (2 months free)
const annualPrice = await stripe.prices.create({
  product: product.id,
  unit_amount: 9999, // $99.99
  currency: 'usd',
  recurring: {
    interval: 'year',
  },
  metadata: {
    plan: 'annual',
  },
});
```

### List Products with Prices

```typescript
const products = await stripe.products.list({
  active: true,
  expand: ['data.default_price'],
});

for (const product of products.data) {
  console.log(product.name, product.default_price);
}
```

### Usage-Based Pricing

```typescript
// Create metered product
const product = await stripe.products.create({
  name: 'API Calls',
});

// Create metered price
const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 1, // $0.01 per unit
  currency: 'usd',
  recurring: {
    interval: 'month',
    usage_type: 'metered',
    aggregate_usage: 'sum',
  },
});

// Report usage
await stripe.subscriptionItems.createUsageRecord(
  'si_xxx', // Subscription item ID
  {
    quantity: 100, // 100 API calls
    timestamp: Math.floor(Date.now() / 1000),
    action: 'increment',
  }
);
```

## Common Patterns

### Tiered Pricing

```typescript
const price = await stripe.prices.create({
  product: product.id,
  currency: 'usd',
  recurring: { interval: 'month' },
  billing_scheme: 'tiered',
  tiers_mode: 'graduated',
  tiers: [
    { up_to: 100, unit_amount: 10 },    // First 100: $0.10 each
    { up_to: 1000, unit_amount: 5 },    // 101-1000: $0.05 each
    { up_to: 'inf', unit_amount: 2 },   // 1001+: $0.02 each
  ],
});
```

### Multiple Currencies

```typescript
// USD price
await stripe.prices.create({
  product: product.id,
  unit_amount: 999,
  currency: 'usd',
  recurring: { interval: 'month' },
});

// EUR price
await stripe.prices.create({
  product: product.id,
  unit_amount: 899,
  currency: 'eur',
  recurring: { interval: 'month' },
});
```

### Free Trial

```typescript
const subscription = await stripe.subscriptions.create({
  customer: 'cus_xxx',
  items: [{ price: 'price_xxx' }],
  trial_period_days: 14, // 14-day free trial
});
```
