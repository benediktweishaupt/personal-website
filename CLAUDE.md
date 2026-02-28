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
- **No Node.js on server.** Hostinger shared hosting, Apache, FTP deploy.
- **Tailwind 3.4 only.** No custom CSS unless Tailwind can't cover it — flag it if so.
- **No frameworks.** No React, no Vue. Astro components only.
- **Preserve `/blog/*` routes.** They work and must not break.

## Stack

Astro 5 · Tailwind 3.4 · MDX · sharp · TypeScript
Custom fonts: Relevant (sans), SangBleu Empire (display), SangBleu Republic (body)
Deploy: GitHub Actions → FTP → Hostinger
