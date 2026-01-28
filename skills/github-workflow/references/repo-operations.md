# Repository Operations

## Create Repository

```bash
# Interactive creation
gh repo create

# Create public repo with README
gh repo create my-project --public --add-readme

# Create private repo
gh repo create my-project --private

# Create from template
gh repo create my-project --template owner/template-repo

# Create from local directory
cd existing-project
gh repo create --source=. --public --push
```

## Clone Repository

```bash
# Clone by name
gh repo clone owner/repo

# Clone to specific directory
gh repo clone owner/repo ./my-directory

# Clone with SSH
gh repo clone owner/repo -- --config core.sshCommand="ssh -i ~/.ssh/my-key"
```

## Fork Repository

```bash
# Fork to your account
gh repo fork owner/repo

# Fork and clone
gh repo fork owner/repo --clone

# Fork to organization
gh repo fork owner/repo --org my-org
```

## Repository Settings

```bash
# View repo info
gh repo view owner/repo

# View in browser
gh repo view owner/repo --web

# Edit description
gh repo edit owner/repo --description "New description"

# Change visibility
gh repo edit owner/repo --visibility private

# Enable/disable features
gh repo edit owner/repo --enable-issues --enable-wiki
```

## Delete Repository

```bash
# Delete repo (requires confirmation)
gh repo delete owner/repo --yes
```

## List Repositories

```bash
# Your repos
gh repo list

# Organization repos
gh repo list my-org

# With filters
gh repo list --language typescript --limit 20
```
