# Google OAuth Setup

## Create Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Enable OAuth consent screen:
   - User Type: External
   - App name, logo, support email
   - Scopes: email, profile, openid
4. Go to Credentials > Create Credentials > OAuth client ID
5. Application type: Web application

## Configure Redirect URIs

### Development

```
http://localhost:3000/api/auth/callback/google
```

### Production

```
https://yourdomain.com/api/auth/callback/google
```

## Get Credentials

After creating:
- Client ID: `xxx.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxx`

## Environment Variables

```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
```

## NextAuth Configuration

```typescript
import GoogleProvider from 'next-auth/providers/google';

GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})
```

## Additional Scopes

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly',
    },
  },
})
```

## Access Token for APIs

```typescript
callbacks: {
  async jwt({ token, account }) {
    if (account) {
      token.accessToken = account.access_token;
    }
    return token;
  },
  async session({ session, token }) {
    session.accessToken = token.accessToken;
    return session;
  },
}
```

## Troubleshooting

### "redirect_uri_mismatch"

Ensure redirect URI in Google Console exactly matches:
- No trailing slash differences
- Same protocol (http vs https)
- Same port

### "Access blocked"

- Publish OAuth consent screen
- Add test users during development
- Verify domain ownership for production
