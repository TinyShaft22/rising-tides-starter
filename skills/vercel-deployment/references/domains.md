# Domains

## Add Domain

```bash
vercel domains add example.com
vercel domains add www.example.com
```

## List Domains

```bash
vercel domains ls
```

## DNS Configuration

### A Record (Root Domain)

```
Type: A
Name: @
Value: 76.76.21.21
```

### CNAME (Subdomain)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Using Vercel DNS

```bash
# Add DNS record
vercel dns add example.com @ A 76.76.21.21
vercel dns add example.com www CNAME cname.vercel-dns.com

# List records
vercel dns ls example.com
```

## SSL Certificates

SSL certificates are automatically provisioned.

```bash
# Check certificate status
vercel certs ls
```

## Remove Domain

```bash
vercel domains rm example.com
```

## Assign to Project

```bash
# In project directory
vercel domains add example.com

# Or with project flag
vercel domains add example.com --project my-project
```

## Redirects

In `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

## www Redirect

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.example.com" }],
      "destination": "https://example.com/:path*",
      "permanent": true
    }
  ]
}
```
