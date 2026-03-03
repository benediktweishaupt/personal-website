# bewe.is

Portfolio site — selected work across clients, research, and teaching.

## What this is

My personal portfolio. Built with Astro 5, deployed to GitHub Pages. Around 90 projects spanning product design, algorithmic film, and teaching.

## What's interesting about how it's built

**Audience system.** Not all work is for everyone. Projects carry a `projectAudience` (all, clients, academic, family) that controls visibility. A secret URL parameter sets the audience level in localStorage. The index page, case study cards, and table rows all respect it — so the same site shows different depths depending on who's looking.

**Content architecture.** 90+ projects live in Astro Content Collections with a shared schema: title, status, template, cover image, meta (category, format, team, institution, year, role), descriptions in English and German. Six of them are full case studies in MDX with custom layout components. The rest are table entries.

**Image pipeline.** 74 images run through Astro's `image()` helper for automatic WebP conversion and responsive srcsets. The dist folder went from 341MB to 90MB. Video files were converted from .mov to .mp4 (132MB to 18.6MB).

**Typography.** Two sizes (text-xl for prose, text-sm for data), two colors (gray-900 active, gray-400 inactive), warm gray palette. No decorative typefaces, no font-weight variation beyond regular.

## Stack

Astro 5, MDX, Tailwind CSS, TypeScript, GitHub Pages.

## Run locally

```
npm install
npm run dev
```
