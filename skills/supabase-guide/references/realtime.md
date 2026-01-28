# Realtime

## Enable Realtime

In Supabase Dashboard: Table Editor > Enable Realtime

Or via SQL:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

## Subscribe to Changes

### All Changes

```typescript
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();
```

### Insert Only

```typescript
const channel = supabase
  .channel('new-messages')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();
```

### With Filter

```typescript
const channel = supabase
  .channel('room-1-messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: 'room_id=eq.1',
    },
    (payload) => {
      console.log('Message in room 1:', payload.new);
    }
  )
  .subscribe();
```

## Unsubscribe

```typescript
// Remove specific channel
supabase.removeChannel(channel);

// Remove all channels
supabase.removeAllChannels();
```

## Broadcast (No Database)

### Send

```typescript
const channel = supabase.channel('room-1');

channel.send({
  type: 'broadcast',
  event: 'cursor-move',
  payload: { x: 100, y: 200 },
});
```

### Receive

```typescript
const channel = supabase
  .channel('room-1')
  .on('broadcast', { event: 'cursor-move' }, (payload) => {
    console.log('Cursor moved:', payload);
  })
  .subscribe();
```

## Presence

### Track User

```typescript
const channel = supabase.channel('room-1');

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({
      user_id: userId,
      online_at: new Date().toISOString(),
    });
  }
});
```

### Listen for Presence

```typescript
channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    console.log('Online users:', state);
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', newPresences);
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', leftPresences);
  })
  .subscribe();
```

## React Hook Example

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useMessages(roomId: string) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch initial messages
    supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at')
      .then(({ data }) => setMessages(data || []));

    // Subscribe to new messages
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return messages;
}
```
