# How the Website Works

Architecture and conventions for the portfolio site (benediktweishaupt.de / bewe.is).

Astro 5 static site. Originally a blog, extended into a full portfolio with case studies, project archive, and about page.

---

## Routes

| Route              | Template                   | Notes                                        |
| ------------------ | -------------------------- | -------------------------------------------- |
| `/`                | `index.astro`              | WorkIndex: cards + sortable/filterable table  |
| `/projects/[slug]` | `projects/[...slug].astro` | Case study or simple project layout           |
| `/blog/[slug]`     | `blog/[...slug].astro`     | Blog post (two-column prose + sticky images)  |
| `/about`           | `about.astro`              | Bio, exhibitions, teaching, clients           |

`/projects` and `/blog` redirect to `/` via `.htaccess` (301).

---

## Content Collections

### Projects schema (`src/content.config.ts`)

```typescript
const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    status: z.enum(["public", "draft", "hidden"]).default("draft"),
    thumbnailAudience: z.enum(["all", "clients", "academic", "family"]).default("all"),
    projectAudience: z.enum(["none", "all", "clients", "academic", "family"]).default("none"),
    template: z.enum(["case-study", "project"]).optional(),
    order: z.number().default(99),
    cover: z.object({
      image: image(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    }).optional(),
    meta: z.object({
      category: z.enum(["clients", "research", "teaching"]),
      format: z.string().optional(),
      team: z.string().optional(),
      institution: z.string().optional(),
      year: z.string().optional(),
      role: z.string().optional(),
    }),
    description: z.string().optional(),
    description_de: z.string().optional(),
    collaborators: z.string().optional(),
    curators: z.string().optional(),
    credits_image: z.string().optional(),
    student: z.string().optional(),
  }),
});
```

### Content numbers

| Metric                                   | Count  |
| ---------------------------------------- | ------ |
| Total project files                      | 95     |
| — Clients                                | 38     |
| — Research                               | 24     |
| — Teaching                               | 33     |
| Case studies (`template: case-study`)    | 6      |
| Projects with pages (audience != none)   | 3      |
| Thumbnail-only (`projectAudience: none`) | 92     |

### Content structure

```
src/content/
  blog/             → existing blog posts
  projects/
    clients/        → client project .md/.mdx files
    research/       → research project .md files
    teaching/       → teaching project .md files
```

---

## Visibility System

Documented in detail in `docs/conventions/content-status.md`. Two orthogonal layers:

### Layer 1 — Status (environment visibility)

| Status   | `npm run dev` | `npm run build` (deployed) |
| -------- | ------------- | -------------------------- |
| `public` | Visible       | Visible                    |
| `draft`  | Visible       | Excluded entirely          |
| `hidden` | Excluded      | Excluded entirely          |

Enforced at build time in `WorkIndex.astro`, `projects/[...slug].astro`, `blog/[...slug].astro`.

### Layer 2 — Audience (access visibility)

- `thumbnailAudience` — who sees the row/card on the index page
- `projectAudience` — who can open the full project page

| `projectAudience` | Page generated? | Link in table? | Card in case studies? |
| ----------------- | --------------- | -------------- | --------------------- |
| `none`            | No              | No (plain text)| No                    |
| `all`             | Yes             | Yes            | Yes (if case-study)   |
| `clients`         | Yes             | Yes            | Yes (if case-study)   |
| `academic`        | Yes             | Yes            | Yes (if case-study)   |
| `family`          | Yes             | Yes            | Yes (if case-study)   |

Audience hierarchy:

```
family   → sees everything (master key)
academic → sees 'all' + 'academic'
clients  → sees 'all' + 'clients'
(none)   → sees 'all' only
```

Visitors unlock tiers via secret URL parameters (song lyrics, stored in `localStorage`):

| URL Parameter                         | Audience   |
| ------------------------------------- | ---------- |
| (none)                                | `all`      |
| `?v=just-tell-me-what-you-want`       | `clients`  |
| `?v=say-my-name-say-my-name`          | `academic` |
| `?v=words-dont-come-easy-to-me`       | `family`   |

Detection script in `src/layouts/BaseLayout.astro`. Access checks in `ProjectLayout.astro` and `ProjectSimpleLayout.astro`.

---

## Media

Conventions documented in `docs/conventions/media-assets.md`.

- **Images:** `src/assets/projects/` — optimized at build time via sharp, served as WebP through `/_astro/` endpoint. Use Astro `<Image>` component.
- **Videos:** `public/video/projects/` — MP4 (H.264, crf 28), not processed by Astro. Referenced as `/video/projects/...` paths.

---

## Components

| Component                | Location                  | Purpose                                                                                                 |
| ------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `SiteHeader.astro`       | `src/components/`         | Centered pill nav: title + Index + About, active states                                                 |
| `WorkIndex.astro`        | `src/components/`         | Case study cards (horizontal scroll) + sortable project table                                           |
| `WorkIndexRow.astro`     | `src/components/`         | Table row: thumbnail, title, institution, year. Plain text if no page                                   |
| `BaseHead.astro`         | `src/components/`         | `<head>` meta tags                                                                                      |
| `Footer.astro`           | `src/components/`         | Page footer                                                                                             |
| `FormattedDate.astro`    | `src/components/`         | Date formatter                                                                                          |
| `HeaderLink.astro`       | `src/components/`         | Nav link helper                                                                                         |
| 9 Project components     | `src/components/project/` | MDX content: Section, Heading, TextBlock, Description, MediaGrid, FullWidthImage, Tag, TagList, Caption |
| `AboutTextSection.astro` | `src/components/about/`   | Bio text section                                                                                        |
| `AboutItemList.astro`    | `src/components/about/`   | Year-list with marquee animation                                                                        |

## Layouts

| Layout                      | Used by          | Notes                                                        |
| --------------------------- | ---------------- | ------------------------------------------------------------ |
| `BaseLayout.astro`          | All pages        | HTML shell, named `slot="header"`, audience detection script  |
| `ProjectLayout.astro`       | Case studies     | 75vh cover image, audience access check                       |
| `ProjectSimpleLayout.astro` | Regular projects | Title, meta line, description, cover, audience check          |
| `PostLayout.astro`          | Blog posts       | Two-column prose + sticky image sidebar                       |

---

## Typography

### Fonts configured

- **Relevant** — default sans-serif (`font-sans`)
- **SangBleu Empire** — display headlines (`font-serif-display`)
- **SangBleu Republic** — body serif (`font-serif`)
- **SangBleu Kingdom** — available in `public/fonts/` but unused

### Type scale (approximate)

- Story title: `text-7xl` to `text-9xl` (responsive)
- Section heading: `text-base md:text-xl`
- Body text: `text-base md:text-xl`
- Description/lead: `text-2xl md:text-3xl lg:text-4xl`
- Caption: `text-sm`
- Tags: `text-xs uppercase tracking-wide` (default) or `text-sm tracking-wide` (large)

---

## Deployment

```
GitHub push → Actions (withastro/action) → GitHub Pages
```

- Config: `.github/workflows/deploy.yml`
- Output: `./dist/`
- Hosting: GitHub Pages (static CDN, auto-HTTPS)
- Custom domain: `bewe.is` (via `public/CNAME`)
- Redirects: `benediktweishaupt.de` → `bewe.is`, `360degre.es` → `bewe.is`

---

## Constraints

- **Static only.** `output: 'static'` in Astro config. No SSR, no server-side JS. Client-side `<script>` and Astro Islands are fine.
- **No server-side processing.** GitHub Pages serves static files only. No `.htaccess`, no server rewrites.
- **Tailwind 3.4 only.** No custom CSS unless Tailwind can't cover it.
- **No frameworks.** No React, no Vue. Astro components only.
- **Preserve `/blog/*` routes.** They work and must not break.
