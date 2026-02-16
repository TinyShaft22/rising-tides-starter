---
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.
license: Complete terms in LICENSE.txt
mcp: playwright
mcp_install: npx -y @playwright/mcp
---

# Web Application Testing

## MCP Setup (First Run)

Before starting work, check if Playwright tools are available:

1. Use ToolSearch to look for `playwright` tools
2. If tools are found → proceed directly to the user's task
3. If tools are NOT found → set up the MCP:

   a. Run: `claude mcp add playwright -- npx -y @playwright/mcp`
      (This adds the MCP to the current project, not globally)
   b. Tell the user: "Playwright MCP has been added to this project.
      Please restart Claude to activate it (type 'exit', then run 'claude')."
   c. Give the user a **resume prompt** they can paste after restarting:
      "After restarting, paste this to continue where you left off:"
      Then generate a prompt that summarizes what the user was asking for, e.g.:
      `I was working on [user's task]. Playwright MCP should now be active. Please continue.`
   d. STOP — do not continue until user restarts and MCP is available

   If the user prefers to do it themselves, give them:
   - Command: `claude mcp add playwright -- npx -y @playwright/mcp`
   - Or: they can add it to `.mcp.json` manually

IMPORTANT: Never use `-s user` or `--scope user`. Project scope is the default
and keeps MCPs contained to where they're needed.

---

## MCP Integration: Playwright

When the Playwright MCP is available, you can use it for browser automation instead of writing Python scripts. The MCP provides direct browser control:

**Available via MCP:**
- Navigate to URLs
- Click elements, fill forms
- Take screenshots
- Wait for elements/network
- Extract page content

**When to use MCP vs Python scripts:**
- **MCP**: Quick interactive testing, simple flows, screenshot captures
- **Python scripts**: Complex test suites, CI/CD integration, reusable test files

**Example MCP workflow:**
```
1. Navigate to http://localhost:3000
2. Wait for network idle
3. Click the login button
4. Fill email: test@example.com
5. Take screenshot of the result
```

---

To test local web applications, write native Python Playwright scripts.

**Helper Scripts Available**:
- `scripts/with_server.py` - Manages server lifecycle (supports multiple servers)

**Always run scripts with `--help` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is abslutely necessary. These scripts can be very large and thus pollute your context window. They exist to be called directly as black-box scripts rather than ingested into your context window.

## Decision Tree: Choosing Your Approach

```
User task → Is it static HTML?
    ├─ Yes → Read HTML file directly to identify selectors
    │         ├─ Success → Write Playwright script using selectors
    │         └─ Fails/Incomplete → Treat as dynamic (below)
    │
    └─ No (dynamic webapp) → Is the server already running?
        ├─ No → Run: python scripts/with_server.py --help
        │        Then use the helper + write simplified Playwright script
        │
        └─ Yes → Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Take screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
```

## Example: Using with_server.py

To start a server, run `--help` first, then use the helper:

**Single server:**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**Multiple servers (e.g., backend + frontend):**
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

To create an automation script, include only Playwright logic (servers are managed automatically):
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode
    page = browser.new_page()
    page.goto('http://localhost:5173') # Server already running and ready
    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute
    # ... your automation logic
    browser.close()
```

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM**:
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   ```

2. **Identify selectors** from inspection results

3. **Execute actions** using discovered selectors

## Common Pitfall

❌ **Don't** inspect the DOM before waiting for `networkidle` on dynamic apps
✅ **Do** wait for `page.wait_for_load_state('networkidle')` before inspection

## Best Practices

- **Use bundled scripts as black boxes** - To accomplish a task, consider whether one of the scripts available in `scripts/` can help. These scripts handle common, complex workflows reliably without cluttering the context window. Use `--help` to see usage, then invoke directly. 
- Use `sync_playwright()` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: `text=`, `role=`, CSS selectors, or IDs
- Add appropriate waits: `page.wait_for_selector()` or `page.wait_for_timeout()`

## Reference Files

- **examples/** - Examples showing common patterns:
  - `element_discovery.py` - Discovering buttons, links, and inputs on a page
  - `static_html_automation.py` - Using file:// URLs for local HTML
  - `console_logging.py` - Capturing console logs during automation