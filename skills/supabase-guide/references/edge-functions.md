# Edge Functions

## Overview

Supabase Edge Functions are server-side TypeScript functions that run on Deno at the edge.

## Create Function

```bash
supabase functions new my-function
```

Creates:
```
supabase/functions/my-function/
└── index.ts
```

## Basic Function

```typescript
// supabase/functions/my-function/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { name } = await req.json();

  return new Response(
    JSON.stringify({ message: `Hello, ${name}!` }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

## Local Development

```bash
# Serve all functions
supabase functions serve

# Serve specific function
supabase functions serve my-function

# With env file
supabase functions serve --env-file .env.local
```

## Deploy

```bash
# Deploy single function
supabase functions deploy my-function

# Deploy all functions
supabase functions deploy
```

## Invoke Function

### From Client

```typescript
const { data, error } = await supabase.functions.invoke('my-function', {
  body: { name: 'World' },
});
```

### From cURL

```bash
curl -X POST \
  'https://your-project.supabase.co/functions/v1/my-function' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"name": "World"}'
```

## With Supabase Client

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data, error } = await supabase
    .from('users')
    .select('*');

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

## Secrets

### Set Secret

```bash
supabase secrets set MY_SECRET=value
```

### List Secrets

```bash
supabase secrets list
```

### Use in Function

```typescript
const secret = Deno.env.get('MY_SECRET');
```

## CORS

```typescript
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  // Your function logic
  return new Response(JSON.stringify({ data: 'hello' }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});
```

## Scheduled Functions

```typescript
// Run on a schedule via pg_cron or external scheduler
// Call the function via HTTP from your scheduler

// Example: Daily cleanup
serve(async (req) => {
  const supabase = createClient(/*...*/);

  // Delete old records
  await supabase
    .from('logs')
    .delete()
    .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

  return new Response(JSON.stringify({ success: true }));
});
```
