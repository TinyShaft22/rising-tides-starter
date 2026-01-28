---
name: github-workflow
description: "Full GitHub lifecycle using gh CLI. Use when user needs to create repos, push to remote, manage releases/tags, create PRs, manage issues, or interact with GitHub Actions. Triggers on: 'push to GitHub', 'create release', 'create repo', 'make PR', 'GitHub Actions', 'tag version', 'gh'."
---

# GitHub Workflow

Full GitHub lifecycle management using the `gh` CLI.

## Prerequisites

**Install GitHub CLI:**
```bash
# macOS
brew install gh

# Windows (winget)
winget install --id GitHub.cli

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh
```

**Authenticate:**
```bash
gh auth login
```

**Verify:**
```bash
gh auth status
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Create repo | `gh repo create [name] --public/--private` |
| Clone repo | `gh repo clone owner/repo` |
| Create PR | `gh pr create --title "..." --body "..."` |
| View PR | `gh pr view [number]` |
| Merge PR | `gh pr merge [number]` |
| Create release | `gh release create v1.0.0 --title "..." --notes "..."` |
| Create issue | `gh issue create --title "..." --body "..."` |
| List issues | `gh issue list` |
| Run workflow | `gh workflow run [name]` |

---

## Core Workflows

### 1. New Repository Setup

```bash
# Create new repo (with README)
gh repo create my-project --public --add-readme

# Or create from existing local folder
cd my-project
git init
gh repo create --source=. --public --push
```

### 2. Feature PR Workflow

```bash
# Create branch
git checkout -b feature/my-feature

# Make changes, commit
git add .
git commit -m "feat: add feature"

# Push and create PR
git push -u origin feature/my-feature
gh pr create --title "feat: add feature" --body "Description of changes"
```

### 3. Release Workflow

```bash
# Tag the release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Create GitHub release with auto-generated notes
gh release create v1.0.0 --generate-notes

# Or with custom notes
gh release create v1.0.0 --title "v1.0.0" --notes "Release notes here"
```

### 4. Issue Management

```bash
# Create issue
gh issue create --title "Bug: description" --label "bug" --body "Details..."

# Assign issue
gh issue edit 123 --add-assignee @me

# Close issue
gh issue close 123
```

---

## GitHub Actions

```bash
# List workflows
gh workflow list

# View workflow runs
gh run list

# Trigger workflow manually
gh workflow run deploy.yml

# View run details
gh run view [run-id]

# Watch running workflow
gh run watch [run-id]
```

---

## Reference Files

- `references/repo-operations.md` — Create, clone, fork, settings
- `references/release-management.md` — Tags, releases, assets
- `references/pr-workflow.md` — Create, review, merge PRs
- `references/issue-management.md` — Issues, labels, milestones
- `references/actions-basics.md` — View/trigger workflows

---

## When to Use

- Starting a new project and need a GitHub repo
- Ready to create a PR for code review
- Releasing a new version
- Managing issues and project tracking
- Checking CI/CD status
