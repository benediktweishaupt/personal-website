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
      client: z.string().optional(),       // CV display name (overrides title for clients)
      funding: z.string().optional(),      // Research funding source
      partner: z.string().optional(),      // Collaborating institution (teaching)
      ongoing: z.boolean().optional(),     // Project is still active
      year: z.string().optional(),         // "2024" or "2025–2022" (higher year first)
      role: z.string().optional(),         // Job title (e.g. "Product Designer")
      copy: z.string().optional(),         // CV copy sentence (hand-written, no algorithm)
    }),
    description: z.string().optional(),
    description_de: z.string().optional(),
    collaborators: z.string().optional(),
    curators: z.string().optional(),
    credits_image: z.string().optional(),
    credits_video: z.string().optional(),
    student: z.string().optional(),        // If set, entry is a student graduation (filtered from CV)
    cvHidden: z.boolean().optional(),      // Hide from CV but keep project page
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

---

## CV Table (About Page)

The about page renders a CV table via `CVTable.astro` and `CVRow.astro`.

### Grid layout

```
Mobile:   grid-cols-[48px_1fr_48px]           → Year | Title | Spacer
Desktop:  grid-cols-[48px_1fr_2fr_72px_48px]  → Year | Title | Copy | Category | Spacer
```

Copy and category pill are hidden on mobile.

### CV filtering (`about.astro`)

Projects are excluded from the CV if any of these are true:
- `status: hidden` — excluded everywhere
- `status: draft` — excluded in production builds only
- `student` field is set — graduation projects supervised, not own work
- `cvHidden: true` — hidden from CV but project page still exists

### Title display

For client entries, `meta.client` overrides `title` in the CV title column. This allows the project page to keep its descriptive title (e.g. "Design System for e-commerce") while the CV shows the client name ("Closed"). Entries without `meta.client` fall back to `title` — used when the title IS the client name (e.g. "Amelie Losier").

### Copy sentences (`meta.copy`)

Every CV entry has a hand-written `meta.copy` string. There is no algorithmic generation — the copy column renders `meta.copy` directly. Each category follows its own CV convention:

- **Clients (business/tech):** Action verbs, deliverables, impact. "Designed and developed...", "Led...", "Art directed..."
- **Teaching (academic):** Structured, dry. "Format with co-teachers. Institution" — no articles, no prose.
- **Research (artist CV):** "Venue, City. Medium with collaborators (curated by Curator)"

### Major/minor signal

Derived from data: `isMajor = !!cover?.image && !!description`. Major titles get `font-medium`. No new field needed.

### Year format

Year ranges use en-dash with the higher year first: "2025–2024", "2020–2018". Single years: "2019". Sorting extracts all 4-digit numbers and uses the maximum.

### Category pill

Tiny uppercase pill: `text-[10px] uppercase tracking-wider border border-gray-900 rounded`.

### Consolidation decisions

Multiple entries for the same employer/client are consolidated into one CV row. The sub-entries are hidden via `cvHidden: true` (project pages preserved).

| Consolidated entry | Hidden entries | Reason |
|---|---|---|
| Reteach (design system) | AI course creation, compliance workflows | Same employer, one CV line listing all deliverables |
| Sandberg Instituut (manifesto) | Announcements, graduation show, open day | Same client 2014–2015, all with David Ortiz Juan |
| Wir Design (voith) | wir-design.md | Same agency, Voith was the end-client |
| Institute for Human Activities | metahaven-renzo-martens.md | Same project (IHA website built for Renzo Martens with Metahaven) |
| Algorithmic Film | — | Umbrella case study page; individual works (No Exit, etc.) appear separately |

### Other CV decisions

- **Roosje Klap / Jan van Eyck Academy** — deleted (file removed), too minor.
- **ISEA 2016** — moved from `clients` to `research` category. It's a symposium, not client work.
- **Diptych in Love, Knowledge Capital** — `status: hidden`. Removed from site entirely.
- **Student graduation projects** — filtered via `student` field. Not own work.
- **"Confusion of Tongues"** — capitalized as proper noun in all `team` fields.
- **Role values** — converted from activity-nouns to job titles (e.g. "UX/UI Design" → "Product Designer").

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

- **Matter** — default sans-serif (`font-sans`), licensed (Displaay, order 405097)
- **SangBleu Empire** — display headlines (`font-serif-display`), ⚠️ still a trial
- **Old Standard TT** — declared as `font-serif` in `tailwind.config.mjs` but never
  loaded, so `font-serif` currently falls back to Georgia

### Where the font files live

Font binaries are **not** in this repo. They are licensed for self-hosting on bewe.is
(Displaay §08 Web) but not for distribution or third-party copying (§06/§10), and this
repo is public.

They live in the private `benediktweishaupt/personal-website-fonts` repo and are pulled
into `public/fonts/` at build time by the "Fetch licensed fonts" step in
`.github/workflows/deploy.yml`, using the read-only `FONTS_DEPLOY_KEY` deploy key.

For local development, keep the files in `public/fonts/` — `.gitignore` blocks them from
being committed. To get them: clone the private fonts repo and copy `fonts/*.woff2` over.

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
