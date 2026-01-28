---
name: playwright
description: Browser automation for testing and web interaction. Use for E2E testing, screenshot capture, form filling, and automated browser workflows.
mcp: playwright
---

# Playwright (Browser Automation)

Control browsers programmatically for testing and automation.

## Trigger

Invoke when:
- "automate browser [action]"
- "test this page"
- "playwright [action]"
- "browser automation for [task]"
- E2E testing scenarios

## How It Works

Playwright MCP provides browser automation capabilities:
- Navigate to URLs
- Click elements
- Fill forms
- Take screenshots
- Assert page state
- Handle multiple browser contexts

## Usage Patterns

### Basic: Navigate and Capture
```
Navigate to https://example.com and take a screenshot
```

### Forms: Fill and Submit
```
Go to the login page
Fill email: test@example.com
Fill password: ******
Click the submit button
```

### Testing: Verify Content
```
Navigate to /dashboard
Wait for the data table to load
Verify "Welcome back" text is visible
```

### Complex: Multi-step Flow
```
1. Go to checkout page
2. Fill shipping address
3. Select payment method
4. Verify order summary
5. Click "Place Order"
6. Capture confirmation screenshot
```

## Common Use Cases

| Scenario | Actions |
|----------|---------|
| E2E testing | Navigate, interact, assert |
| Screenshot capture | Navigate, wait, screenshot |
| Form testing | Fill inputs, submit, verify |
| Visual regression | Navigate, capture, compare |
| Data scraping | Navigate, extract, process |
| Login flow testing | Fill creds, submit, verify session |

## Example Workflow

1. **User asks:** "Test the signup flow"
2. **Use Playwright to:**
   - Navigate to /signup
   - Fill in test user details
   - Submit the form
   - Verify redirect to dashboard
   - Capture success screenshot

## Tips

- Always wait for elements before interacting
- Use specific selectors (data-testid preferred)
- Handle loading states explicitly
- Take screenshots at key points for debugging
- Clean up test data after runs

## When NOT to Use

- Simple unit tests (use Jest/Vitest instead)
- API testing (use fetch/axios)
- When Claude-in-Chrome tools are more appropriate
- Static analysis tasks
