# CLI Setup

## Installation

### macOS

```bash
brew install stripe/stripe-cli/stripe
```

### Windows

```bash
# Using scoop
scoop install stripe

# Using chocolatey
choco install stripe-cli
```

### Linux

```bash
# Debian/Ubuntu
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe

# Other Linux (direct download)
curl -L https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_x86_64.tar.gz | tar xz
sudo mv stripe /usr/local/bin/
```

## Authentication

```bash
# Login to Stripe (opens browser)
stripe login

# Check login status
stripe config --list

# Logout
stripe logout
```

## Test Mode vs Live Mode

```bash
# CLI defaults to test mode
stripe products list  # Uses test API key

# Specify live mode (careful!)
stripe products list --live

# Check which mode
stripe config --list | grep api_key
```

## Configuration

### View Config

```bash
stripe config --list
```

### Set Default Project

```bash
# If you have multiple Stripe accounts
stripe config --project my-project
```

### Environment Variables

```bash
# Set API key directly (bypasses login)
export STRIPE_API_KEY=sk_test_...

# Use specific key for command
STRIPE_API_KEY=sk_test_... stripe products list
```

## Useful Commands

### Quick Reference

```bash
# List resources
stripe products list
stripe prices list
stripe customers list
stripe subscriptions list

# Get specific resource
stripe products retrieve prod_xxx
stripe customers retrieve cus_xxx

# Create resource
stripe products create --name="Product Name"

# Delete resource
stripe products delete prod_xxx

# Get help
stripe --help
stripe products --help
```

### Logs and Events

```bash
# View recent API requests
stripe logs tail

# View specific log
stripe logs tail --filter "status=400"

# List events
stripe events list

# View event
stripe events retrieve evt_xxx
```

### Debugging

```bash
# Verbose output
stripe products list --verbose

# JSON output
stripe products list --json

# Pretty print
stripe products list | jq
```

## Webhook Testing

```bash
# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks

# Get webhook signing secret (shown when listen starts)
# whsec_xxx...

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed
```

## Shell Completion

```bash
# Bash
stripe completion bash > /etc/bash_completion.d/stripe

# Zsh
stripe completion zsh > "${fpath[1]}/_stripe"

# Fish
stripe completion fish > ~/.config/fish/completions/stripe.fish
```
