# Changelog

Development history of the portfolio site (benediktweishaupt.com, formerly 360degre.es).

---

## Feb 28 — Audience system & publishing (`b9e8153`, pending)

**Audience system**

- Replaced `type: project/entry` + `audience` with two audience fields: `thumbnailAudience` and `projectAudience`
- `thumbnailAudience` controls who sees the row/card on the index page
- `projectAudience` controls who can open the full project page (or whether a page exists at all)
- Added `projectAudience: 'none'` — no page generated, no link rendered, no case study card shown
- Default is now `projectAudience: 'none'` (safe starting state)
- Secret URL parameters (`?v=song-lyric`) store audience tier in `localStorage` (sticky across sessions)
- Client-side filtering in WorkIndex, access checks in project layouts
- Audience hierarchy: `family` (master key) > `academic` > `clients` > `all`
- Documented in `docs/conventions/content-status.md`

**Table simplification**

- Removed Type column (field no longer exists)
- Removed Category, Format, Status, Access, Cover, Desc, Body columns
- Table now shows 4 columns: thumbnail, title, institution, year
- Institution hidden below `sm` breakpoint
- Non-linkable rows (`projectAudience: 'none'`) render as plain text without hover effect
- Added sort indicator `<span>` to all column headers (was missing on Title and Institution)

**Status**

- All 95 projects set to `status: public`
- 3 reteach case studies set to `projectAudience: family`
- All other projects set to `projectAudience: none`

## Feb 27 — Image pipeline & conventions (`4abcdab`, `3ca911a`)

**Astro native image pipeline**

- Moved all project images from `public/image/projects/` to `src/assets/projects/`
- Updated all frontmatter `cover.image` paths from strings to import-compatible relative paths
- Schema `cover.image` changed from `z.string()` to `image()` (Astro's schema helper)
- All images now optimized at build time via sharp → served as WebP through `/_astro/` endpoint
- `dist/` went from 341 MB to 90 MB
- Removed `public/image/projects/` directory (119 MB)

**Video conversion**

- Converted `.mov` files to `.mp4` using ffmpeg (H.264, `-crf 28`, `-preset slow`)
- Removed original `.mov` files (132 MB)
- Videos remain in `public/video/projects/` (not processed by Astro)

**Sharp pixel limit fix**

- `expand-all/cover.jpg` was 24000x13500 pixels (324M pixels), exceeding sharp's ~268 megapixel limit
- Resized to 3200x1800 using `sips --resampleWidth 3200`

**Draft status filtering**

- `draft` status now visible in dev (`npm run dev`) but excluded from production build
- Added `!(import.meta.env.PROD && p.data.status === 'draft')` filter in:
  - `src/components/WorkIndex.astro`
  - `src/pages/projects/[...slug].astro`
  - `src/pages/blog/[...slug].astro`

**Compliance case study media**

- Replaced single form exploration image with 4-column grid of drawer variant images
- Added `columns={4}` support to `ProjectMediaGrid` component
- Converted and placed timeline visualization video

**Site identity**

- Renamed site from "360degrees" to "Benedikt Weishaupt" (`src/consts.ts`)
- Replaced Astro logo favicon with BW monogram SVG

**Conventions documented**

- Created `docs/conventions/media-assets.md` — image/video storage, naming, conversion
- Created `docs/conventions/content-status.md` — public/draft/hidden + audience system
- Updated `.gitignore` to only ignore `docs/images-to-place/` and `docs/reference-data/`

## Feb 24 — Scale-up (`3f076d5`, `b910fa7`)

**85 project content files generated**

- Created `scripts/generate-project-files.mjs` to generate `.md` files from CSV/CV/portfolio sources
- Split Digital Campfire into 3 separate workshops (I/II/III)
- Split Drei, Drie, Three into exhibition (clients) + 3x3 workshop (teaching)
- Added More Free Wifi as research project
- Moved reference data (PDFs, CSV, ODS) to `docs/reference-data/`

**Schema extension**

- Added `type` field: `'project'` (gets a page) vs `'entry'` (table-only, no route)
- Added `template` field: `'case-study'` (rich MDX layout) vs `'project'` (simple layout)
- Added fields: `description_de`, `collaborators`, `curators`, `credits_image`, `student`, `meta.role`
- Cover field made optional (was required)

**CMS-style project table**

- Added `WorkIndexRow.astro` component with stretched-link clickable rows
- Added CMS columns: Status, Audience, Cover, Desc, Body (visible at xl+)
- Sortable headers with data attributes for all columns
- Filter pills: All, Clients, Research, Teaching (client-side JS)
- Initial sort: year descending, then by sort weight (case-study > project > entry)

**Template routing**

- `ProjectSimpleLayout.astro` for non-case-study project pages (title, meta, description, cover, prose)
- `[...slug].astro` routes to `ProjectLayout` (case-study) or `ProjectSimpleLayout` (project)
- Entries (`type: 'entry'`) excluded from route generation entirely

**23 cover images placed**

- Converted and placed cover images from `docs/images-to-place/` into `public/image/projects/{slug}/cover.jpg`
- Updated 23 project frontmatter files with `cover.image` paths
- PNG to JPG conversion using `sips` where needed (reteach covers)

## Feb 24–27 — Navigation simplification

**SiteHeader rewrite**

- Removed hamburger menu, full-screen WorkIndex overlay, and all associated JS
- Removed `NavArrow.astro` component (prev/next buttons)
- Simplified to 3-item centered pill: `[pageTitle] | [Index] | [About]`
- Title truncation: `max-w-[200px]` mobile, `max-w-[300px]` desktop
- Active state on Index/About links (matches hover style: `bg-gray-100/20`)
- On `/projects` and `/about` pages, title shows `SITE_NAME` instead of page title
- View Transitions preserved (`transition:name="site-nav"`, `transition:animate="morph"`)

**Layout cleanup**

- Removed `currentPostId` from `PostLayout.astro`
- Removed prev/next computation and `getCollection` imports from `ProjectLayout.astro` and `ProjectSimpleLayout.astro`

**Table thumbnail polish**

- Added 54px cover thumbnail column to project table (4:3 aspect)
- Grayscale by default, color on row hover (`group` / `group-hover:grayscale-0`)
- Case study cards: opacity-80 default, opacity-100 on hover

## Feb 23 — Content & pages (`3ae5047`, `3f11dee`, `a1c2ef8`)

**6 case studies added**

- `clients/reteach-design-system.mdx` — full case study with media grid
- `clients/reteach-ai-course-creation.mdx` — full case study with media grid
- `clients/reteach-compliance-workflows.mdx` — full case study with media grid
- `clients/closed-ecommerce.mdx` — full case study with media grid
- `clients/museum-digital.mdx` — full case study with media grid
- `research/algorithmic-film.mdx` — full case study with media grid

**Schema & layout evolution**

- Added `status` + `audience` fields to blog schema; `audience` to projects
- Added `status: public/hidden` to blog posts; filter `status !== 'hidden'` in all consumers
- Unified `PostLayout` to use `BaseLayout` with `slot="header"` pattern
- Cover images in WorkIndex project cards (3:4 aspect ratio)
- Cover image 75vh on project detail pages
- Horizontal scroll for case study cards (snap-x)

**About page**

- Ported from Nuxt as `src/pages/about.astro` (static, no collection)
- Added `AboutTextSection.astro` + `AboutItemList.astro` (CSS marquee-on-hover animation)
- Sections: bio, exhibitions, teaching, clients

**View Transitions**

- Enabled Astro `ClientRouter` for smooth page transitions
- `transition:name="site-nav"` + `transition:animate="morph"` on the nav pill
- Fixed scripts for `astro:page-load` lifecycle

**Navigation**

- Added `NavArrow.astro` component for prev/next project navigation (DRY)

## Feb 20 — Foundation (`d856047`, `06918c2`, `7b0dbeb`)

**Projects route & case study system**

- Added `projects` content collection with Zod schema (title, status, order, cover, meta)
- Ported first case study from Nuxt: `reteach-design-system` (MDC to Astro JSX)
- Created 10 project content components (`ProjectSection`, `ProjectDescription`, `ProjectTextBlock`, `ProjectSectionHeading`, `ProjectTag`, `ProjectTagList`, `ProjectMediaGrid`, `ProjectFullWidthImage`, `ProjectCaption` + barrel `index.ts`)
- Created `ProjectLayout.astro` and `BaseLayout.astro` (named `slot="header"` pattern)
- Added `/projects` index and `/projects/[...slug]` dynamic route
- Copied reteach design-system videos and images to `public/`

**Navigation & typography refactor**

- Created `WorkIndex` component (was `NavigationContent`) with filter modes (all/blog/projects)
- Created `/blog/index.astro` — landing page no longer redirects to latest post
- SiteHeader overlay using WorkIndex for full navigation
- Added `Relevant` as default sans-serif font (`font-sans`); Empire only for display headlines
- Replaced all `zinc-` with `gray-` across codebase
- Merged `ProjectImageGrid` into `ProjectMediaGrid` (type="image")

**Component rename for consistency**

- `BlogHeader` to `SiteHeader` (used site-wide)
- `NavigationContent` to `WorkIndex`
- `BlogPost` layout to `PostLayout`
- `UiCaption` to `ProjectCaption`
- Deleted dead files: `Header.astro`, `BlogNavigation.astro`
- Added `project/index.ts` barrel + MDX component prop injection
