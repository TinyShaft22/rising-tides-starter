# Prerequisites Guide

Before installing Claude Code, you need these foundational tools installed on your system.

> **TIP:** Use the automated setup scripts instead of manual installation!
> - Mac: `./scripts/setup-mac.sh`
> - Linux: `./scripts/setup-linux.sh`
> - Windows: `.\scripts\setup-windows.ps1`
>
> See [PREREQUISITES-SUMMARY.md](../PREREQUISITES-SUMMARY.md) for the complete prerequisites reference.

---

## Required Software

| Software | Version | Purpose | Installed By Script |
|----------|---------|---------|---------------------|
| Node.js | 18+ | Runtime for Claude Code | Yes |
| npm | 8+ | Package manager (comes with Node.js) | Yes (bundled) |
| npx | 8+ | Run MCP servers (comes with Node.js) | Yes (bundled) |
| Git | 2.30+ | Version control, cloning repos | Yes |

## Build Tools (Required for Native npm Packages)

| Software | Purpose | Installed By Script |
|----------|---------|---------------------|
| Python 3 | Required by node-gyp | Yes |
| gcc/g++ (Linux) | C/C++ compiler | Yes |
| make (Linux) | Build automation | Yes |
| Xcode CLI (Mac) | Build tools bundle | Yes |

## Optional but Recommended

| Software | Purpose | Installed By Script |
|----------|---------|---------------------|
| curl | Download files, API calls | Yes (Linux) |
| jq | JSON processing | Yes (Mac) |
| VS Code | Code editor with terminal integration | No |
| Homebrew (Mac) | Package manager for easy installs | Yes |
| Windows Terminal | Better terminal experience on Windows | No |

---

## Installation by Platform

### Windows

#### Option A: Using winget (Recommended)

Open PowerShell as Administrator:

```powershell
# Install Node.js LTS
winget install OpenJS.NodeJS.LTS

# Install Git
winget install Git.Git

# Restart PowerShell, then verify
node --version
npm --version
git --version
```

#### Option B: Manual Download

1. **Node.js:** Download from [nodejs.org](https://nodejs.org/) (LTS version)
   - Run the installer
   - Check "Add to PATH" during installation

2. **Git:** Download from [git-scm.com](https://git-scm.com/download/win)
   - Run the installer
   - Use default options

#### Option C: Using Chocolatey

```powershell
# Install Chocolatey first (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Then install packages
choco install nodejs-lts git -y
```

---

### macOS

#### Option A: Using Homebrew (Recommended)

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and Git
brew install node@20 git

# Add Node to PATH (if using node@20)
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
node --version
npm --version
git --version
```

#### Option B: Using nvm (Node Version Manager)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then install Node
nvm install 20
nvm use 20
nvm alias default 20

# Install Git via Homebrew
brew install git
```

---

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt-get update

# Install Git
sudo apt-get install -y git

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
git --version
```

### Linux (Fedora/RHEL)

```bash
# Install Git
sudo dnf install git

# Install Node.js
sudo dnf install nodejs npm

# Verify
node --version
npm --version
git --version
```

---

### WSL2 (Windows Subsystem for Linux)

If you're on Windows and prefer a Linux environment:

```powershell
# In PowerShell as Administrator
wsl --install

# After restart, open Ubuntu and run:
sudo apt-get update
sudo apt-get install -y git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Verification

After installation, verify everything works:

```bash
# Check Node.js (should be 18+)
node --version

# Check npm (should be 8+)
npm --version

# Check Git (should be 2.30+)
git --version
```

**Expected output:**
```
v20.x.x
10.x.x
git version 2.4x.x
```

---

## Troubleshooting

### "command not found" after installation

**Windows:** Close and reopen PowerShell/Terminal

**Mac/Linux:** Run `source ~/.bashrc` or `source ~/.zshrc`

### Node.js version too old

If you have an older version:

```bash
# Mac with Homebrew
brew upgrade node

# Linux
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
winget upgrade OpenJS.NodeJS.LTS
```

### npm permission errors (Mac/Linux)

Option 1 - Fix permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

Option 2 - Use nvm (recommended):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart terminal
nvm install 20
```

### Git not recognizing user

Configure your Git identity:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Next Step

Once all prerequisites are verified, proceed to [Install Claude Code](INSTALL-CLAUDE-CODE.md).
