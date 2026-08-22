# Font licensing

The site uses commercial fonts. This file records what is licensed, what isn't, and
what is still open. Status as of 22 Aug 2026.

## What ships

| Font | Role | Licence | Status |
|---|---|---|---|
| Matter Regular | `font-sans` | Displaay Type Foundry, order 405097 — Web usage, perpetual, worldwide | ✅ licensed |
| SangBleu Empire Regular | `font-serif-display` | Swiss Typefaces — **trial** | ⚠️ **open** |

`font-serif` in `tailwind.config.mjs` names "Old Standard TT", which is never loaded —
it silently falls back to Georgia. Pre-existing; decide whether to load it or drop it.

## Why the binaries are not in this repo

The public repo used to contain the font files, which made them downloadable by anyone.
The Displaay licence permits self-hosting on own domains (§08 Web) but forbids
distribution and third-party copying:

> §06 — "in no way for any sale, transfer or distribution of the Fonts or the License
> in whole or in part"
>
> §10 — "You are not allowed or allow any third party to copy the Fonts."
>
> Termination — "Any breach of this Agreement terminates your License with immediate
> effect upon the occurrence of the breach and you have to stop using the Fonts."

Serving Matter from bewe.is is fine. Mirroring the file in a public repo is not, and a
breach would void the licence that was paid for.

The binaries therefore live in the private `benediktweishaupt/personal-website-fonts`
repo. `.github/workflows/deploy.yml` clones it at build time with the read-only
`FONTS_DEPLOY_KEY` deploy key and copies the files into `public/fonts/`.
`.gitignore` blocks font binaries and `docs/DP_*` so nothing lands here by accident.

**Local development:** clone the private fonts repo and copy `fonts/*.woff2` into
`public/fonts/`. They are gitignored.

## Open items

### 1. SangBleu Empire is still a trial — live in production

`SangBleuEmpire-Regular-WebTrial.woff2` is served on bewe.is as `font-serif-display`.
Trial licences cover internal evaluation only, not public production use. This was
already the case while the repo was private; going public did not create it.

**Fix:** buy the licence from Swiss Typefaces, or replace the face.

### 2. Old objects are still reachable on GitHub

History was rewritten on 22 Aug 2026 (`git filter-repo`, purging `public/fonts/`), so
`main` is clean. But GitHub does not immediately garbage-collect unreachable objects,
and the old commit SHAs are publicly listed via the Actions runs and deployments API.
Measured right after the rewrite, without any authentication:

- `Matter-Regular.woff2` — reachable at 1 old SHA (`c8242383e6c0`)
- `SangBleuEmpire-Regular-WebTrial.woff2` — reachable at 24 old SHAs
- `RelevantTrial-Normal.otf` — reachable at 23 old SHAs

At the time of the rewrite the repo had 0 forks, 0 clones and 0 views, so nothing is
known to have been fetched.

**Options, deliberately deferred:**
- Delete the old Actions runs and deployments (removes SHA discoverability), and open a
  GitHub Support ticket asking them to garbage-collect unreachable objects
- Delete and recreate the repo (instant and total; Pages, the custom domain and the
  deploy-key secret must be set up again)
- Make the repo private again (needs GitHub Pro, otherwise Pages stops working)

### 3. Housekeeping

- `RelevantTrial-Normal.otf` is untracked but still sits in `public/fonts/` locally.
  Unused — nothing references it.
- `FTP_USERNAME` / `FTP_PASSWORD` still exist as Actions secrets from an earlier hosting
  setup and are referenced nowhere. Dead credentials; worth deleting.
