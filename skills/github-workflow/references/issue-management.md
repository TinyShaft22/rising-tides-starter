# Issue Management

## Create Issue

```bash
# Interactive creation
gh issue create

# With title and body
gh issue create --title "Bug: description" --body "Details..."

# With labels
gh issue create --title "Feature request" --label "enhancement"

# Assign to user
gh issue create --title "Task" --assignee @me

# Assign to milestone
gh issue create --title "Task" --milestone "v1.0"

# Use template
gh issue create --template bug_report.md
```

## View Issues

```bash
# List all open issues
gh issue list

# List closed issues
gh issue list --state closed

# List your issues
gh issue list --assignee @me

# Filter by label
gh issue list --label "bug"

# View specific issue
gh issue view 123

# View in browser
gh issue view 123 --web
```

## Update Issues

```bash
# Edit title
gh issue edit 123 --title "New title"

# Add labels
gh issue edit 123 --add-label "priority:high"

# Remove labels
gh issue edit 123 --remove-label "needs-triage"

# Assign user
gh issue edit 123 --add-assignee user1

# Add to milestone
gh issue edit 123 --milestone "v1.0"
```

## Close Issues

```bash
# Close issue
gh issue close 123

# Close with comment
gh issue close 123 --comment "Fixed in #456"

# Reopen issue
gh issue reopen 123
```

## Issue Comments

```bash
# Add comment
gh issue comment 123 --body "Working on this"

# List comments
gh issue view 123 --comments
```

## Labels

```bash
# List labels
gh label list

# Create label
gh label create "priority:high" --color "FF0000" --description "High priority"

# Edit label
gh label edit "bug" --color "0000FF"

# Delete label
gh label delete "old-label"
```

## Milestones

```bash
# List milestones
gh api repos/{owner}/{repo}/milestones

# Create milestone
gh api repos/{owner}/{repo}/milestones -f title="v1.0" -f due_on="2024-12-31T00:00:00Z"
```

## Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug Report
about: Report a bug
labels: bug
---

## Description
<!-- What happened? -->

## Steps to Reproduce
1.
2.
3.

## Expected Behavior
<!-- What should have happened? -->

## Environment
- OS:
- Version:
```
