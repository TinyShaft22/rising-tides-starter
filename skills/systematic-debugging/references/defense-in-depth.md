# Defense in Depth

## The Layered Defense Strategy

Don't rely on a single point of validation. Add checks at multiple layers.

```
User Input
    ↓
[Layer 1: Client validation]
    ↓
[Layer 2: API validation]
    ↓
[Layer 3: Business logic validation]
    ↓
[Layer 4: Database constraints]
    ↓
Stored Data
```

Each layer catches different types of errors.

## Layer Implementation

### Layer 1: Client Validation

For immediate user feedback:

```typescript
// Form validation
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

// Validate before submission
const result = schema.safeParse(formData);
if (!result.success) {
  showErrors(result.error.issues);
  return;
}
```

**Purpose:** Fast feedback, better UX
**Trust level:** Zero (can be bypassed)

### Layer 2: API Validation

Validate ALL incoming data:

```typescript
// API route
export async function POST(req: Request) {
  const body = await req.json();

  // Never trust client data
  const validated = schema.parse(body);

  // Proceed with validated data
  return await createUser(validated);
}
```

**Purpose:** Security boundary
**Trust level:** This is your firewall

### Layer 3: Business Logic

Validate business rules:

```typescript
async function createUser(data: UserInput) {
  // Business rule: email must be unique
  const existing = await db.user.findByEmail(data.email);
  if (existing) {
    throw new Error('Email already registered');
  }

  // Business rule: age must meet minimum
  if (data.age < 18) {
    throw new Error('Must be 18 or older');
  }

  return await db.user.create(data);
}
```

**Purpose:** Enforce business rules
**Trust level:** Trusted internal code

### Layer 4: Database Constraints

The final safety net:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INTEGER CHECK (age >= 0 AND age <= 150),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Data integrity guarantee
**Trust level:** Absolute (enforced by DB)

## Defensive Coding Patterns

### Null Checks at Boundaries

```typescript
// At service boundary
async function getUser(id: string): Promise<User> {
  const user = await db.user.find(id);

  // Explicit null check
  if (!user) {
    throw new NotFoundError(`User ${id} not found`);
  }

  return user; // Type is now User, not User | null
}
```

### Default Values

```typescript
function formatName(user?: User): string {
  return user?.name ?? 'Anonymous';
}
```

### Type Guards

```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj
  );
}

// Usage
if (isUser(data)) {
  // data is now typed as User
  console.log(data.email);
}
```

### Assertion Functions

```typescript
function assertUser(obj: unknown): asserts obj is User {
  if (!isUser(obj)) {
    throw new TypeError('Expected User object');
  }
}

// Usage
assertUser(data);
// data is now typed as User
console.log(data.email);
```

## When to Add Defense

Add validation at:
1. **System boundaries** — User input, API calls, file reads
2. **Module boundaries** — Public function parameters
3. **After external calls** — API responses, database queries

Don't add validation:
1. **Internal private functions** — Trust your own code
2. **Hot paths** — Performance-critical loops
3. **Already-validated data** — Don't re-validate
