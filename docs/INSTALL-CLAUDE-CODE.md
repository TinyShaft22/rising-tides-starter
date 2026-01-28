# Claude Code Installation Guide

This guide walks you through installing and authenticating Claude Code.

---

## Prerequisites Check

Before proceeding, verify you have the prerequisites installed:

```bash
node --version   # Should be 18+
npm --version    # Should be 8+
```

If not, see the [Prerequisites Guide](PREREQUISITES.md).

---

## Step 1: Install Claude Code

### All Platforms

```bash
npm install -g @anthropic-ai/claude-code
```

This installs Claude Code globally, making the `claude` command available anywhere.

### Verify Installation

```bash
claude --version
```

You should see output like:
```
claude-code version 1.x.x
```

---

## Step 2: Authenticate

Claude Code needs to connect to your Anthropic account.

### Login

```bash
claude auth login
```

This will:
1. Open your browser to Anthropic's login page
2. Ask you to authorize Claude Code
3. Return you to the terminal once authenticated

### Verify Authentication

```bash
claude auth status
```

You should see:
```
Authenticated as: your-email@example.com
```

---

## Step 3: First Run

Start Claude Code to verify everything works:

```bash
claude
```

You should see:
- Claude Code starts up
- A welcome message appears
- You can type messages to Claude

Try a simple test:
```
> Hello, are you working?
```

Press `Ctrl+C` or type `/exit` to quit.

---

## Installation Options

### Install Specific Version

```bash
npm install -g @anthropic-ai/claude-code@1.0.0
```

### Update to Latest

```bash
npm update -g @anthropic-ai/claude-code
```

### Uninstall

```bash
npm uninstall -g @anthropic-ai/claude-code
```

---

## Where Things Are Installed

| Item | Location |
|------|----------|
| CLI Binary | `npm prefix -g`/bin/claude |
| Settings | `~/.claude/settings.json` |
| Auth | `~/.claude/auth.json` |
| Project Config | `.claude/` in your project |

**Mac/Linux:** `~` is your home directory (`/Users/yourname` or `/home/yourname`)

**Windows:** `~` is `C:\Users\YourName`

---

## Troubleshooting

### "command not found: claude"

**Cause:** npm global bin directory not in PATH

**Fix:**
```bash
# Find where npm installs global packages
npm config get prefix

# Add that path + /bin to your PATH
# Mac/Linux: Add to ~/.bashrc or ~/.zshrc
export PATH="$(npm config get prefix)/bin:$PATH"

# Windows: Add to System Environment Variables
```

### "EACCES: permission denied" (Mac/Linux)

**Cause:** npm doesn't have permission to install globally

**Fix Option 1 - Change npm directory:**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @anthropic-ai/claude-code
```

**Fix Option 2 - Use nvm:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart terminal
nvm install 20
nvm use 20
npm install -g @anthropic-ai/claude-code
```

### "Authentication failed"

**Cause:** Token expired or invalid

**Fix:**
```bash
claude auth logout
claude auth login
```

### "Network error" during auth

**Cause:** Firewall or proxy blocking connection

**Fix:**
- Check your internet connection
- Disable VPN temporarily
- Check if your firewall allows outbound HTTPS

### Browser doesn't open during auth

**Fix:** Copy the URL from the terminal and paste it into your browser manually.

---

## Configuration Files

After installation, Claude Code creates these directories:

```
~/.claude/
├── settings.json    # Your preferences
├── auth.json        # Authentication token (don't share!)
└── logs/            # Debug logs
```

Your project can have its own config:

```
your-project/
└── .claude/
    └── settings.json   # Project-specific settings
```

---

## Next Step

Once Claude Code is installed and authenticated, proceed to [Configure Environment](CONFIGURE-ENVIRONMENT.md).
