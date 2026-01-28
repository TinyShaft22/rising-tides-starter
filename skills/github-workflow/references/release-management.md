# Release Management

## Create Release

```bash
# Create release with auto-generated notes
gh release create v1.0.0 --generate-notes

# Create with title and notes
gh release create v1.0.0 --title "Version 1.0.0" --notes "Release notes here"

# Create from notes file
gh release create v1.0.0 --notes-file CHANGELOG.md

# Create draft release
gh release create v1.0.0 --draft

# Create pre-release
gh release create v1.0.0-beta.1 --prerelease

# Create release with assets
gh release create v1.0.0 ./dist/*.zip ./dist/*.tar.gz
```

## Tag Management

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push tag
git push origin v1.0.0

# Push all tags
git push origin --tags

# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0

# List tags
git tag -l "v1.*"
```

## View Releases

```bash
# List releases
gh release list

# View specific release
gh release view v1.0.0

# View in browser
gh release view v1.0.0 --web

# Download release assets
gh release download v1.0.0
```

## Edit Release

```bash
# Edit title
gh release edit v1.0.0 --title "New Title"

# Edit notes
gh release edit v1.0.0 --notes "Updated notes"

# Convert draft to published
gh release edit v1.0.0 --draft=false

# Add assets to existing release
gh release upload v1.0.0 ./new-asset.zip
```

## Delete Release

```bash
# Delete release (keeps tag)
gh release delete v1.0.0

# Delete release and tag
gh release delete v1.0.0 --cleanup-tag
```

## Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes (backward compatible)

Examples:
- 1.0.0 → 2.0.0: Breaking API change
- 1.0.0 → 1.1.0: New feature added
- 1.0.0 → 1.0.1: Bug fix
```
