# CLAUDE.md

## What This Project Is

Astro static site. Portfolio with case studies, project archive, about page, and blog.

**Key docs:**
- `how-the-website-works.md` — architecture, components, conventions
- `PRD.md` — planned work (next steps + backlog)
- `CHANGELOG.md` — development history
- `docs/conventions/` — content status system, media assets

## Commands

```bash
npm install
npm run dev       # dev server
npm run build     # static build → ./dist/
npm run preview   # preview production build
```

## Constraints

- **Static only.** `output: 'static'` in astro config. No SSR, no server-side JS. Client-side `<script>` and Astro Islands are fine.
- **No server-side processing.** GitHub Pages serves static files only.
- **Tailwind 3.4 only.** No custom CSS unless Tailwind can't cover it — flag it if so.
- **No frameworks.** No React, no Vue. Astro components only.
- **Preserve `/blog/*` routes.** They work and must not break.

## Stack

Astro 5 · Tailwind 3.4 · MDX · sharp · TypeScript
Custom fonts: Matter (sans, licensed), SangBleu Empire (display, trial)
Font binaries live in the private `personal-website-fonts` repo and are fetched at
build time — they are not in this repo and must never be committed (see .gitignore)
Deploy: GitHub Actions → GitHub Pages (bewe.is)
