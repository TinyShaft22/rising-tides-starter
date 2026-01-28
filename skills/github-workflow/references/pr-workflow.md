# Pull Request Workflow

## Create PR

```bash
# Interactive PR creation
gh pr create

# With title and body
gh pr create --title "feat: add feature" --body "Description"

# Create draft PR
gh pr create --draft --title "WIP: feature"

# Specify base branch
gh pr create --base develop --title "Feature"

# Assign reviewers
gh pr create --reviewer user1,user2

# Add labels
gh pr create --label "enhancement" --label "priority:high"

# Use template
gh pr create --template feature.md
```

## View PR

```bash
# View PR details
gh pr view 42

# View in browser
gh pr view 42 --web

# View diff
gh pr diff 42

# View checks status
gh pr checks 42

# List all PRs
gh pr list

# List your PRs
gh pr list --author @me

# List PRs needing review
gh pr list --search "review-requested:@me"
```

## Review PR

```bash
# Checkout PR locally
gh pr checkout 42

# Add review comment
gh pr review 42 --comment --body "Looks good, minor suggestion..."

# Approve PR
gh pr review 42 --approve

# Request changes
gh pr review 42 --request-changes --body "Please fix X"
```

## Update PR

```bash
# Edit PR
gh pr edit 42 --title "New title"

# Add reviewers
gh pr edit 42 --add-reviewer user1

# Add labels
gh pr edit 42 --add-label "bug"

# Mark as ready for review
gh pr ready 42

# Convert to draft
gh pr ready 42 --undo
```

## Merge PR

```bash
# Merge (default method)
gh pr merge 42

# Squash merge
gh pr merge 42 --squash

# Rebase merge
gh pr merge 42 --rebase

# Merge and delete branch
gh pr merge 42 --delete-branch

# Auto-merge when checks pass
gh pr merge 42 --auto --squash
```

## Close PR

```bash
# Close without merging
gh pr close 42

# Close with comment
gh pr close 42 --comment "Closing: superseded by #43"
```

## PR Comments

```bash
# Add comment
gh pr comment 42 --body "Thanks for the contribution!"

# Edit comment (by ID)
gh api repos/{owner}/{repo}/issues/comments/{id} -f body="Updated comment"
```
