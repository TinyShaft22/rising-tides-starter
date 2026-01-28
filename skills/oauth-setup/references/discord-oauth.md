# Discord OAuth Setup

## Create Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name
4. Go to OAuth2 section

## Configure Redirects

In OAuth2 > Redirects, add:

### Development

```
http://localhost:3000/api/auth/callback/discord
```

### Production

```
https://yourdomain.com/api/auth/callback/discord
```

## Get Credentials

In OAuth2 > General:
- Client ID: shown on page
- Client Secret: click "Reset Secret" (shown only once)

## Environment Variables

```env
DISCORD_CLIENT_ID=xxx
DISCORD_CLIENT_SECRET=xxx
```

## NextAuth Configuration

```typescript
import DiscordProvider from 'next-auth/providers/discord';

DiscordProvider({
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
})
```

## Additional Scopes

```typescript
DiscordProvider({
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: 'identify email guilds',
    },
  },
})
```

## Common Scopes

| Scope | Access |
|-------|--------|
| `identify` | User ID, username, avatar |
| `email` | User email address |
| `guilds` | List of user's servers |
| `guilds.join` | Add user to a server |
| `guilds.members.read` | Read member info |

## Get User's Servers

```typescript
// Store access token
callbacks: {
  async jwt({ token, account }) {
    if (account) {
      token.accessToken = account.access_token;
    }
    return token;
  },
}

// Fetch guilds
const response = await fetch('https://discord.com/api/users/@me/guilds', {
  headers: {
    Authorization: `Bearer ${token.accessToken}`,
  },
});
const guilds = await response.json();
```

## Bot Integration

For server-side features, create a Bot:

1. Go to Bot section
2. Add Bot
3. Copy Bot Token
4. Add to server with OAuth2 URL Generator

## Troubleshooting

### Invalid OAuth2 redirect_uri

- Redirect must exactly match what's in Developer Portal
- Include protocol (http/https)
- No trailing slashes

### Access denied

- Check scopes are correct
- User must authorize the scopes
- Some scopes need verification for >100 servers
