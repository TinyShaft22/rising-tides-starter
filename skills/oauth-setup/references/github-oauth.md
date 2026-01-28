# GitHub OAuth Setup

## Create OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Application name
   - Homepage URL
   - Authorization callback URL

## Configure Callback URL

### Development

```
http://localhost:3000/api/auth/callback/github
```

### Production

```
https://yourdomain.com/api/auth/callback/github
```

## Get Credentials

After creating:
- Client ID: visible on app page
- Client Secret: generate one (shown only once)

## Environment Variables

```env
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

## NextAuth Configuration

```typescript
import GitHubProvider from 'next-auth/providers/github';

GitHubProvider({
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
})
```

## Additional Scopes

```typescript
GitHubProvider({
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: 'read:user user:email repo',
    },
  },
})
```

## Common Scopes

| Scope | Access |
|-------|--------|
| `read:user` | Read user profile |
| `user:email` | Read user email |
| `repo` | Full repository access |
| `public_repo` | Public repositories only |
| `read:org` | Read organization membership |

## Access Token for API

```typescript
callbacks: {
  async jwt({ token, account }) {
    if (account) {
      token.accessToken = account.access_token;
    }
    return token;
  },
}

// Use in API calls
const response = await fetch('https://api.github.com/user/repos', {
  headers: {
    Authorization: `Bearer ${session.accessToken}`,
  },
});
```

## GitHub App vs OAuth App

| Feature | OAuth App | GitHub App |
|---------|-----------|------------|
| Installation | User authorizes | Org/user installs |
| Permissions | Broad scopes | Fine-grained |
| Rate limits | Per user | Higher limits |
| Use case | Simple auth | Advanced integrations |

For basic social login, OAuth App is sufficient.
