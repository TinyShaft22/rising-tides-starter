# Root Cause Tracing

## The Backward Trace Method

When you find a bug, trace backward through the execution path to find its origin.

### Step 1: Start at the Symptom

```
Error: Cannot read property 'email' of undefined
  at UserProfile.render (UserProfile.tsx:42)
```

**Document:**
- What is the error?
- Where does it occur?
- What is undefined/wrong?

### Step 2: Trace the Data

Work backward asking "Where did this value come from?"

```
UserProfile.render receives props.user
  ↑
UserProfile receives user from parent Dashboard
  ↑
Dashboard gets user from useUser() hook
  ↑
useUser() fetches from /api/user
  ↑
API returns null when session expired
```

### Step 3: Find the Gap

Look for where the assumption breaks:

| Layer | Assumption | Reality |
|-------|------------|---------|
| UserProfile | `props.user` is defined | `undefined` passed |
| Dashboard | useUser returns user | Returns `null` |
| useUser | API always returns user | Returns `null` on expired session |
| API | Session is valid | Session expired |

**Root Cause:** No handling for expired sessions in the data flow.

### Step 4: Verify

Ask: "If I fix this, would the bug still be possible?"

- Handling null in UserProfile? No — masks the real issue
- Handling null in useUser? Better — one place to fix
- Preventing session expiry silently? Best — addresses root cause

## Call Stack Analysis

### Reading Stack Traces

```
Error: Connection refused
    at Socket.connect (net.js:939)
    at DatabaseClient.connect (db.ts:42)
    at UserRepository.findById (user-repo.ts:15)
    at UserService.getUser (user-service.ts:28)
    at UserController.show (user-controller.ts:12)
```

**Read bottom-up:**
1. `UserController.show` called
2. Which called `UserService.getUser`
3. Which called `UserRepository.findById`
4. Which tried to connect via `DatabaseClient`
5. Socket connection failed

**Root cause:** Database connection issue, not code bug.

### Async Stack Traces

Modern runtimes preserve async context:

```
Error: Not found
    at UserService.getUser (user-service.ts:30)
    at async UserController.show (user-controller.ts:15)
    at async Router.handle (router.ts:42)
```

If async trace is missing, add explicit error handling:

```typescript
try {
  const user = await userService.getUser(id);
} catch (err) {
  err.context = { userId: id, action: 'getUser' };
  throw err;
}
```

## Common Root Cause Patterns

### 1. Timing Issues
- Race conditions
- Unhandled promise rejections
- Stale closures

### 2. State Issues
- Shared mutable state
- Uninitialized state
- State synchronization

### 3. Input Issues
- Unexpected null/undefined
- Type coercion
- Edge cases (empty arrays, special characters)

### 4. Integration Issues
- API contract changes
- Timeout handling
- Network failures

## Documentation Template

```markdown
## Bug Report

**Symptom:** [What went wrong]
**Location:** [File:line where error occurred]

**Trace:**
1. [First function in trace]
2. [Second function]
3. ...
n. [Root cause location]

**Root Cause:** [Why this happened]

**Fix Location:** [Where to fix it]

**Prevention:** [How to prevent similar bugs]
```
