# Hypothesis Testing

## The Scientific Method for Debugging

Don't guess. Form hypotheses and test them systematically.

## Step 1: Form a Clear Hypothesis

Bad: "Something is wrong with the database"
Good: "The query times out because the users table lacks an index on email"

A good hypothesis:
- States a specific cause
- Predicts observable behavior
- Can be proven false

## Step 2: Design a Test

Your test must be **falsifiable** — it should prove the hypothesis wrong if it is wrong.

| Hypothesis | Test | Expected if true | Expected if false |
|------------|------|------------------|-------------------|
| Missing index | Check index exists | No index on email | Index exists |
| Query timeout | Time the query | > 30 seconds | < 1 second |
| Data volume | Count rows | > 1M rows | < 10K rows |

## Step 3: Execute One Test at a Time

Don't change multiple things. One variable at a time.

```bash
# Test 1: Check for index
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
# Result: Seq Scan (no index) ✓ Hypothesis supported

# Test 2: Time the query
\timing
SELECT * FROM users WHERE email = 'test@example.com';
# Result: 45 seconds ✓ Confirms slowness

# Test 3: Add index and retest
CREATE INDEX users_email_idx ON users(email);
SELECT * FROM users WHERE email = 'test@example.com';
# Result: 2ms ✓ Hypothesis confirmed
```

## Step 4: Document Results

```markdown
## Debugging Session: User lookup timeout

### Hypothesis 1: Missing index on email column
**Test:** EXPLAIN SELECT * FROM users WHERE email = '...'
**Result:** Seq Scan on users, no index
**Conclusion:** Confirmed

### Fix Applied
Added index: CREATE INDEX users_email_idx ON users(email)

### Verification
Query time: 45s → 2ms
```

## Common Hypothesis Types

### 1. Data Hypothesis
"The bug occurs because [data condition]"

Tests:
```sql
-- Check for nulls
SELECT COUNT(*) FROM users WHERE email IS NULL;

-- Check for duplicates
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

-- Check for edge cases
SELECT * FROM users WHERE LENGTH(email) > 100;
```

### 2. Timing Hypothesis
"The bug occurs because [timing condition]"

Tests:
```typescript
// Add timing logs
console.time('operation');
await doSomething();
console.timeEnd('operation');

// Check for race conditions
await Promise.all([
  operation1(), // Do these complete in expected order?
  operation2(),
]);
```

### 3. State Hypothesis
"The bug occurs because [state condition]"

Tests:
```typescript
// Log state at each step
console.log('Before:', JSON.stringify(state));
doOperation();
console.log('After:', JSON.stringify(state));

// Add invariant checks
function assertValidState(state) {
  if (state.count < 0) throw new Error('Invalid: negative count');
}
```

### 4. Integration Hypothesis
"The bug occurs because [external system condition]"

Tests:
```bash
# Test API directly
curl -v https://api.example.com/endpoint

# Check network
ping api.example.com

# Verify credentials
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/me
```

## Decision Tree

```
Hypothesis formed?
├─ No → Gather more information
└─ Yes → Design test
         ├─ Test passes → Hypothesis likely true → Fix and verify
         └─ Test fails → Hypothesis false → Form new hypothesis
```

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Change random things | Form specific hypothesis |
| Change multiple things at once | Test one variable |
| Skip verification | Always confirm the fix |
| Forget to document | Write down what you tried |
| Assume without testing | Every assumption is a hypothesis |
