# Deployment Setup

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create my-saas --public --push
```

### 2. Connect to Vercel

```bash
vercel link
```

Or connect via Vercel Dashboard.

### 3. Set Environment Variables

```bash
# Database
vercel env add DATABASE_URL production

# Auth
vercel env add NEXTAUTH_URL production
# Set to your production URL: https://my-saas.vercel.app
vercel env add NEXTAUTH_SECRET production

# OAuth
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production

# Stripe
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add STRIPE_PRO_PRICE_ID production
```

### 4. Deploy

```bash
vercel --prod
```

## Database Setup

### Option A: Vercel Postgres

1. Go to Vercel Dashboard > Storage
2. Create Postgres database
3. Copy connection string to DATABASE_URL

### Option B: Neon

1. Create account at neon.tech
2. Create project
3. Copy connection string

### Run Migrations

```bash
# After setting DATABASE_URL
npm run db:push
```

## Stripe Webhook Setup

### 1. Create Webhook in Stripe Dashboard

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://my-saas.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy signing secret

### 2. Update Environment

```bash
vercel env add STRIPE_WEBHOOK_SECRET production
```

## OAuth Redirect URIs

Update OAuth provider settings:

### Google

Add redirect URI:
```
https://my-saas.vercel.app/api/auth/callback/google
```

### GitHub

Update callback URL:
```
https://my-saas.vercel.app/api/auth/callback/github
```

## Domain Setup

### Add Custom Domain

```bash
vercel domains add yourdomain.com
```

### Update NEXTAUTH_URL

```bash
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Enter: https://yourdomain.com
```

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard > Analytics

### Error Tracking (Optional)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Deployment Checklist

- [ ] Database created and migrated
- [ ] All env vars set in Vercel
- [ ] OAuth redirect URIs updated
- [ ] Stripe webhook configured
- [ ] Custom domain added
- [ ] NEXTAUTH_URL updated
- [ ] SSL certificate active
- [ ] Test signup flow
- [ ] Test payment flow
- [ ] Test subscription management
