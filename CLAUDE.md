# CLAUDE.md

## What This Project Is

Astro static site. Currently a blog at 360degre.es. Being extended into a portfolio with case studies, about page, and later a project archive.

**Read `PRD.md` first** — it has the full technical spec for what needs to be built.

## Commands

```bash
npm install
npm run dev       # dev server
npm run build     # static build → ./dist/
npm run preview   # preview production build
```

## Constraints

- **Static only.** `output: 'static'` in astro config. No SSR, no runtime JS.
- **No Node.js on server.** Hostinger shared hosting, Apache, FTP deploy.
- **Tailwind 3.4 only.** No custom CSS unless Tailwind can't cover it — flag it if so.
- **No frameworks.** No React, no Vue. Astro components only.
- **Preserve `/blog/*` routes.** They work and must not break.

## Stack

Astro 5 · Tailwind 3.4 · MDX · sharp · TypeScript
Custom fonts: SangBleu Empire (display), SangBleu Republic (body)
Deploy: GitHub Actions → FTP → Hostinger

## Key Files

- `PRD.md` — full spec for portfolio extension
- `astro.config.mjs` — site config (static, directory format)
- `src/content.config.ts` — content collection schemas
- `tailwind.config.js` — font families + typography plugin
- `.github/workflows/deploy.yml` — CI/CD pipeline
- `public/.htaccess` — Apache URL rewrites

## Migration Source

The Nuxt project at `../Projects-Website/` has working implementations of:
- Story/project content components (`components/content/`)
- About page content (`content/about.md`)
- Audience/auth system (`README_AUDIENCE_SYSTEM.md`)
- Content schemas and types (`types/project.ts`, `content.config.ts`)

Port the logic, not the framework. Vue → Astro components.

## Content Structure

```
src/content/
  blog/             → existing, untouched
  projects/
    clients/        → case study MDX files (new)
  about.md          → bio + exhibitions + teaching + clients (new)

public/
  video/projects/   → .mp4 files per case study
  image/projects/   → .png/.jpg files per case study
```

## Routes

```
/                    → landing page (project links)
/projects            → project list
/projects/[slug]     → case study / project detail
/about               → bio + lists
/blog/[slug]         → existing blog posts (untouched)
```
