---
name: oauth-setup
description: "OAuth provider configuration. Google, GitHub, Discord with NextAuth.js. Use when setting up social login or OAuth authentication. Triggers on: 'oauth', 'google login', 'github login', 'social auth', 'NextAuth', 'social login'."
---

# OAuth Setup

Configure OAuth providers for social authentication.

## Supported Providers

- Google
- GitHub
- Discord
- Apple
- Twitter/X
- Facebook
- LinkedIn

---

## NextAuth.js Setup

### Install

```bash
npm install next-auth
```

### Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

DISCORD_CLIENT_ID=xxx
DISCORD_CLIENT_SECRET=xxx
```

---

## Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Go to APIs & Services > Credentials
4. Create OAuth client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github`

### Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. New Application
3. OAuth2 > Redirects:
   - `http://localhost:3000/api/auth/callback/discord`

---

## Client Usage

### Sign In

```typescript
import { signIn, signOut, useSession } from 'next-auth/react';

// Sign in with provider
signIn('google');
signIn('github');
signIn('discord');

// Sign out
signOut();
```

### Session Provider

```typescript
// app/providers.tsx
'use client';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### Get Session

```typescript
// Client component
'use client';
import { useSession } from 'next-auth/react';

export function Profile() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;

  return <div>Signed in as {session.user.email}</div>;
}
```

```typescript
// Server component
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession();
  return <div>Hello {session?.user?.name}</div>;
}
```

---

## Reference Files

- `references/google-oauth.md` — Google OAuth setup
- `references/github-oauth.md` — GitHub OAuth setup
- `references/discord-oauth.md` — Discord OAuth setup
- `references/nextauth-integration.md` — NextAuth.js patterns

---

## When to Use

- Adding social login to your app
- Need Google/GitHub/Discord authentication
- Building user authentication system
- Integrating with OAuth 2.0 providers
