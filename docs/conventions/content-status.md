# Content Visibility System

Two orthogonal layers control what visitors see.

## Layer 1 — Status (environment visibility)

```ts
status: z.enum(['public', 'draft', 'hidden']).default('draft')
```

| Status | `npm run dev` | `npm run build` (deployed) |
|---|---|---|
| `public` | Visible | Visible |
| `draft` | Visible | **Excluded entirely** |
| `hidden` | Excluded entirely | Excluded entirely |

Enforced at build time in:
- `src/components/WorkIndex.astro`
- `src/pages/projects/[...slug].astro`
- `src/pages/blog/[...slug].astro`

## Layer 2 — Audience (access visibility)

```ts
thumbnailAudience: z.enum(['all', 'clients', 'academic', 'family']).default('all')
projectAudience: z.enum(['none', 'all', 'clients', 'academic', 'family']).default('none')
```

- `thumbnailAudience` — who sees the row/card on the index page
- `projectAudience` — who can open the full project page

| `projectAudience` | Page generated? | Link in table? | Card in case studies? |
| --- | --- | --- | --- |
| `none` | No | No (plain text) | No |
| `all` | Yes | Yes | Yes (if case-study) |
| `clients` | Yes | Yes | Yes (if case-study) |
| `academic` | Yes | Yes | Yes (if case-study) |
| `family` | Yes | Yes | Yes (if case-study) |

### Hierarchy

```
family   → sees everything (master key)
academic → sees 'all' + 'academic'
clients  → sees 'all' + 'clients'
(none)   → sees 'all' only
```

`projectAudience` overrules `thumbnailAudience`: if `projectAudience: 'all'`, the page is accessible regardless of `thumbnailAudience`.

### How visitors unlock tiers

Secret URL parameters (song lyrics, easy to share):

| URL Parameter | Audience |
|---|---|
| (none) | `all` |
| `?v=just-tell-me-what-you-want` | `clients` |
| `?v=say-my-name-say-my-name` | `academic` |
| `?v=words-dont-come-easy-to-me` | `family` |

Stored in `localStorage` — sticky across sessions. Detected in `src/layouts/BaseLayout.astro`.

### Where it's enforced

- `src/components/WorkIndex.astro` — client-side JS filters rows and cards by `thumbnailAudience`
- `src/layouts/ProjectLayout.astro` — client-side redirect if `projectAudience` doesn't match
- `src/layouts/ProjectSimpleLayout.astro` — same redirect

### Common patterns

| Use case | `thumbnailAudience` | `projectAudience` |
|---|---|---|
| Thumbnail only, no page | `all` | `none` |
| Fully public | `all` | `all` |
| Thumbnail visible, page restricted to clients | `all` | `clients` |
| Only visible to family (old "entry") | `family` | `family` |
| Visible to all, page only for family | `all` | `family` |

## Workflow

1. New content starts as `status: draft`, `projectAudience: none`
2. Set `status: public` when ready for the live site
3. Set `projectAudience` to control who can open the page
4. Set `thumbnailAudience` to control who sees it in the index
