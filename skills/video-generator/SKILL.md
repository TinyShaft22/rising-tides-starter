---
name: video-generator
version: 1.0.0
description: Create videos programmatically using Remotion. Use when the user asks to generate videos, create video content, make animated clips, or build promotional videos.
mcp: remotion
mcp_install: npx -y @anthropic-ai/mcp-server-remotion
---

# Video Generator

Create videos programmatically from prompts using Remotion.

## MCP Auto-Setup (Run First)

**Before doing anything else, check if Remotion MCP is available:**

1. Use ToolSearch to look for `remotion` tools
2. If tools are found → proceed to the user's task
3. If NO tools found → run this installation:

```bash
claude mcp add -s user remotion -- npx -y @anthropic-ai/mcp-server-remotion
```

Then tell the user:
```
✓ Remotion MCP installed.

To activate it, restart Claude:
  1. Type 'exit' to quit
  2. Run 'claude' to start again
  3. Re-run your command

This is a one-time setup.
```

**Do NOT proceed with video generation until the MCP is confirmed available.**

---

## Trigger

Invoke when user says:
- "create a video"
- "generate video for [topic]"
- "make a video about [subject]"
- "video for YouTube/social media"
- "animated intro/outro"

## MCP Integration: Remotion

This skill uses the Remotion MCP to generate videos. Remotion allows you to:
- Create videos using React components
- Control timing, animations, and transitions
- Export as MP4, GIF, or image sequences
- Build data-driven videos from templates

## Workflow

### Step 1: Understand Requirements

Gather from user:
- **Purpose**: YouTube intro, social clip, product demo, tutorial opener
- **Duration**: How long? (10s, 30s, 60s)
- **Content**: What text, images, or data to include
- **Style**: Minimal, energetic, professional, playful
- **Output format**: MP4 (default), GIF, specific resolution

### Step 2: Plan the Video

Structure the video into scenes:
```
Scene 1: [0s-3s] Logo reveal
Scene 2: [3s-8s] Main content
Scene 3: [8s-10s] Call to action
```

For each scene, define:
- Visual elements (text, shapes, images)
- Animations (fade, slide, scale, bounce)
- Timing (when elements appear/disappear)

### Step 3: Build with Remotion

Create React components for each scene:

```tsx
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';

export const MyVideo = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Sequence from={0} durationInFrames={90}>
        <LogoReveal />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <MainContent />
      </Sequence>
      <Sequence from={240} durationInFrames={60}>
        <CallToAction />
      </Sequence>
    </AbsoluteFill>
  );
};
```

### Step 4: Export

Render the video:
```bash
npx remotion render src/index.tsx MyVideo out/video.mp4
```

Save to: `/outputs/videos/[descriptive-name].mp4`

## Common Video Types

### YouTube Intro (5-10s)
- Logo animation
- Channel name
- Tagline or sound effect
- Keep it SHORT

### Product Demo (30-60s)
- Problem statement
- Product reveal
- Key features (3-5)
- Call to action

### Social Clip (15-30s)
- Hook in first 3 seconds
- Single key message
- Bold text overlays
- Vertical format for Stories/Reels

### Tutorial Opener (5-10s)
- Topic title
- "What you'll learn" preview
- Instructor name/branding

## Animation Patterns

### Fade In
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1]);
```

### Slide From Left
```tsx
const x = interpolate(frame, [0, 30], [-100, 0], {
  extrapolateRight: 'clamp'
});
```

### Scale Pop
```tsx
const scale = spring({
  frame,
  fps: 30,
  config: { damping: 200 }
});
```

### Staggered Text
```tsx
{text.split('').map((char, i) => (
  <span style={{
    opacity: interpolate(frame, [i * 2, i * 2 + 10], [0, 1])
  }}>
    {char}
  </span>
))}
```

## Tips

- **Keep it short**: Social videos should be under 60s
- **Front-load the hook**: First 3 seconds matter most
- **Use motion sparingly**: One or two animation styles, not everything
- **Match brand colors**: Use existing brand palette
- **Export appropriate resolution**: 1080p for YouTube, 1080x1920 for Stories

## Output Location

Save generated videos to:
```
/outputs/videos/[YYYY-MM-DD]-[description].mp4
```

Example: `/outputs/videos/2026-01-23-youtube-intro.mp4`

## Example Prompts

**Simple:**
> "Create a 10-second YouTube intro with my channel name 'Tech Tips' and a tech-inspired theme"

**Detailed:**
> "Generate a 30-second product demo video for our SaaS tool:
> - Scene 1: Problem statement about manual data entry
> - Scene 2: Show the app interface
> - Scene 3: Highlight 3 key features
> - Scene 4: CTA to start free trial
> - Use blue and white colors, modern font"

## Dependencies

- Remotion MCP must be installed
- Node.js environment
- For complex videos: design assets (logos, fonts, images)
