# Media Assets

## Images

**Location:** `src/assets/projects/<project-group>/<project-name>/`
- Images here go through Astro's sharp pipeline at build time → automatic WebP, compression, width/height, srcset
- `public/` is NOT used for project images (bypasses optimization)

**Naming:** kebab-case, descriptive, no spaces or timestamps
- `cover.jpg` — cover image (one per project)
- `risk-reward-mapping.png` — descriptive content name
- Never: `Screenshot 2026-02-26 at 14.16.10.png`

**Format:** Keep source as `.jpg` or `.png`. Astro converts to WebP at build time.

**Usage in MDX:**
- Cover images: referenced via frontmatter `image: ../../../assets/projects/.../cover.jpg` — processed by `image()` schema helper
- Body images: static imports at top of MDX file, passed as `ImageMetadata` to `ProjectMediaGrid`
```mdx
import riskReward from '../../../assets/projects/reteach/ai-course/risk-reward-mapping.png';

<ProjectMediaGrid columns={1} items={[
  { type: "image", src: riskReward, alt: "...", caption: "..." },
]} />
```

**Oversized images:** Sharp has a ~268 megapixel limit. Resize anything over ~5000px wide with `sips --resampleWidth 3200` before committing.

## Videos

**Location:** `public/video/projects/<project-group>/<project-name>/`
- Videos stay in `public/` — Astro has no video pipeline
- Referenced as string paths in MDX: `src: "/video/projects/reteach/compliance/demo.mp4"`

**Format:** Always `.mp4` (H.264). Convert `.mov` files with:
```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -an -movflags +faststart output.mp4
```
- `-an` strips audio (screen recordings don't need it)
- `-movflags +faststart` enables progressive loading

**Naming:** Same kebab-case convention as images. `demo.mp4`, `timeline-visualisation.mp4`, etc.

## Components

- `ProjectMediaGrid` — main grid, supports `columns={1|2|3|4}`, accepts `string | ImageMetadata` for src
- `ProjectFullWidthImage` — single full-width image, same `string | ImageMetadata` pattern
- Both use `<Image>` from `astro:assets` for `ImageMetadata`, plain `<img>` for string paths (TODO placeholders)
