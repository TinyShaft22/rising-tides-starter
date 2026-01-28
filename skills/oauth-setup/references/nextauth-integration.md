# NextAuth.js Integration

## Installation

```bash
npm install next-auth
```

## Basic Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};
```

## Session Provider

```typescript
// app/providers.tsx
'use client';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Client-Side Usage

```typescript
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return <button onClick={() => signIn()}>Sign in</button>;
}
```

## Server-Side Usage

```typescript
// Server component
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please sign in</div>;
  }

  return <div>Hello {session.user?.name}</div>;
}
```

## Callbacks

```typescript
export const authOptions: NextAuthOptions = {
  providers: [...],
  callbacks: {
    // Add user ID to session
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    // Store access token
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Control sign in
    async signIn({ user, account }) {
      // Return true to allow, false to deny
      return true;
    },
    // Redirect after sign in
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};
```

## Database Adapter

```typescript
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [...],
  session: {
    strategy: 'database', // or 'jwt'
  },
};
```

## Protected Routes

### Middleware

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};
```

### Server-Side Check

```typescript
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <div>Dashboard</div>;
}
```
