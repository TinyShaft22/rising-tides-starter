---
name: remotion
description: Create videos programmatically using React components. Use for YouTube intros, product demos, social clips, and animated content.
mcp: remotion
---

# Remotion (Video Generation)

Create videos programmatically from prompts and scripts.

## Trigger

Invoke when:
- "create a video"
- "generate video for [topic]"
- "remotion [video request]"
- "make a video about [subject]"
- Video content creation tasks

## How It Works

Remotion allows you to create videos using React components:
- Define scenes as React components
- Control timing and animations
- Add text, images, audio
- Export as MP4, GIF, or image sequences

## Usage Patterns

### Basic: Simple Text Video
```
Create a 10-second video with the text "Welcome to our channel"
- White text on dark background
- Fade in at start, fade out at end
```

### Intermediate: Multi-Scene
```
Create a product intro video:
- Scene 1 (3s): Logo reveal with bounce animation
- Scene 2 (5s): Product screenshot with feature callouts
- Scene 3 (2s): Call to action "Try it free"
```

### Advanced: Dynamic Content
```
Create a YouTube thumbnail video:
- Big bold title: "5 AI Tools You Need"
- Animated number counter
- Background with subtle gradient motion
- Add excitement particles
```

## Common Use Cases

| Scenario | Output |
|----------|--------|
| YouTube intro | Animated logo + channel name |
| Product demo | Feature showcase with captions |
| Social clip | Short, punchy promotional video |
| Tutorial opener | Title card + topic preview |
| Testimonial | Quote with customer photo |
| Announcement | Event/launch countdown |

## Video Components Available

- **Text** — Animated typography
- **Images** — Static and animated
- **Shapes** — Geometric elements
- **Audio** — Background music, voiceover
- **Transitions** — Fade, slide, scale
- **Charts** — Animated data visualization

## Example Workflow

1. **User asks:** "Create a video announcing our new feature"
2. **Build components:**
   - Title scene with product name
   - Feature highlight with icon
   - Before/after comparison
   - Call-to-action with link
3. **Export** as MP4 at 1080p

## Tips

- Keep videos short (30-60 seconds max for social)
- Use consistent color palette from brand
- Add subtle motion to keep interest
- Front-load the hook (first 3 seconds matter)
- Export at appropriate resolution for platform

## Output Locations

Save generated videos to:
```
/outputs/videos/[descriptive-name].mp4
```

## When NOT to Use

- Long-form video editing (use Premiere/DaVinci)
- Live streaming
- Screen recordings
- Heavy video effects (After Effects territory)
