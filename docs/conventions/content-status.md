# Content Status System

## Schema

```ts
status: z.enum(['public', 'draft', 'hidden']).default('draft')
```

Applies to both `projects` and `blog` collections.

## Behavior

| Status | `npm run dev` (localhost) | `npm run build` (deployed) |
|---|---|---|
| `public` | Visible in index + own page | Visible in index + own page |
| `draft` | Visible in index + own page | **Not in index, no page generated** |
| `hidden` | Not in index, no page generated | Not in index, no page generated |

## Where it's enforced

- `src/components/WorkIndex.astro` — filters project index listing
- `src/pages/projects/[...slug].astro` — filters static route generation
- `src/pages/blog/[...slug].astro` — filters blog route generation

All three use the same pattern:
```ts
p.data.status !== 'hidden' && !(import.meta.env.PROD && p.data.status === 'draft')
```

## Workflow

1. New content starts as `draft` (default) — visible locally for preview
2. When ready to publish: change to `public`
3. To remove from site without deleting: change to `hidden`
