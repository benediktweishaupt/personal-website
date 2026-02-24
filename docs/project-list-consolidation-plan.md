# Proposal: Unified Project List — Consolidation of All Source Documents

## 1. The Four Sources

### A. HFBK-Hamburg_2023-Portfolio.pdf (78 pages)
**Best source for:** polished English descriptions, image captions, visual structure.
**Structure:** Four sections — DESIGN (client/art direction), EDUCATION: SEMINARS, EDUCATION: GRADUATION WORKS, RESEARCH.
**Contains:** ~35 projects with multi-page visual spreads. Each has: title, description, format, team, institution, and captioned images (2–6 per project).
**Unique value:** Image captions that describe what's shown. These become `alt` text and `caption` fields on the website.

### B. CV_2023.pdf (6 pages)
**Best source for:** complete chronological record, education, residencies/grants.
**Structure:** CV proper + Appendix (List of Teaching 2pp, List of Works 2pp).
**Contains:** Many small client jobs NOT in any other source (Schloss Falkenlust, SMAC Chemnitz, Studio Achtviertel, DOK Eisenhüttenstadt, Leiter am Waal, Gruppe Unterberger, Piggy Poof, Hotel Rebel, Dennerlein Brands, Novum, Mister Spex, Lufthansa/SunExpress/wirDesign, Institut für Berufsintegrierende, Roosje Klap). Also has Education and Residencies/Grants sections.
**Unique value:** Items no other source mentions. The underlined items mark "part of portfolio."

### C. Portfolio Tabelle CSV (Notion export, ~60 entries)
**Best source for:** structured metadata, bilingual EN/DE descriptions, `part_of_portfolio` flag.
**Contains:** richest metadata per entry: category, format, institution, year, collaborators, curators, credits, media references. Has EN and DE descriptions for ~40 entries.
**Unique value:** German descriptions, curator credits, `_toDos` notes about missing documentation.

### D. Auflistung Arbeiten letzten 10 Jahre.ods (invoice list)
**Best source for:** freelance client chronology, proof-of-work status.
**Structure:** Year | Client | Role | Evidence type | Portfolio flag.
**Contains:** 35 entries (2012–2022). Mostly overlaps with CV + CSV but confirms roles and dates. Two columns of interest: `Nachweis` (proof type: Rechnung/invoice, Rahmenvertrag/contract, Einladung/invitation, Förderbestätigung/grant confirmation) and a portfolio flag column.

### Plus: 6 existing MDX case studies
Already in `src/content/projects/`: reteach-design-system, reteach-ai-course-creation, reteach-compliance-workflows, closed-ecommerce, museum-digital, algorithmic-film.

---

## 2. Complete Master List — All Projects Across All Sources

Cross-referencing all four documents, here is every unique item. Sources marked as: **P** = Portfolio PDF, **C** = CV, **N** = Notion CSV, **O** = ODS, **M** = existing MDX.

### RESEARCH (~20 items)

| # | Title | Sources | Best text | Has images | Depth |
|---|---|---|---|---|---|
| 1 | **False Colours** | P, C, N | P (long + captions) | Yes (P: 10+ pages) | project |
| 2 | — Training | P, N | P (caption) | Yes | sub-item of #1 |
| 3 | — S.T.A.R.T.U.P. | P, N | P (caption) | Yes | sub-item of #1 |
| 4 | — In the Field | P, N | P (caption) | Yes | sub-item of #1 |
| 5 | — The Jury | P, N | P (caption) | Yes | sub-item of #1 |
| 6 | — Membrane | P, N | P (caption) | Yes | sub-item of #1 |
| 7 | **False Colours: An Image Reading** | P, N | P | Yes (6 slides) | talk (linked to #1) |
| 8 | **No Exit** | P, N | P+N (both rich) | Yes (P: 4 pages) | project |
| 9 | **Sanity is Something Better Outsourced** | P, C, N | P (very long) | Yes (P: 12+ pages) | project |
| 10 | — Figure of Teach | P, N | P (long) | Yes | sub-item of #9 |
| 11 | — Triple Digest: Creative Destruction | P, N | P (long + script) | Yes | sub-item of #9 |
| 12 | — Reft to Light | P, N | P (long) | Yes | sub-item of #9 |
| 13 | — Circular Metabolism BBQ | P, N | P (long) | Yes | sub-item of #9 |
| 14 | **Power of Mesh** | P, N | P+N (both) | Yes (P: 4 pages) | project |
| 15 | **More Free Wifi** | P, N | P+N (both) | Yes (P: 3 pages) | project |
| 16 | **Item to Item** | P, N | P+N (both) | Yes (P: 4 pages) | project |
| 17 | **Landing Platform for Flir Systems** | N | N | No | entry |
| 18 | **edition Weißensee** | N | — | No | entry |
| 19 | Be the first person to like this | N | N (EN only) | No | entry |
| 20 | Neo Lythic | N | N (EN only) | No | entry |
| 21 | Liquid Assemblage | N | N (EN only) | No | entry |
| 22 | Out in the Open | N | N (EN only) | No | entry |
| 23 | WIFIpendenceday | N | — | No | entry |
| 24 | This is the Design Displacement Group | N | — | No | entry |

### CLIENTS (~30 items)

| # | Title | Sources | Best text | Has images | Depth |
|---|---|---|---|---|---|
| 25 | **reteach Design System** | M | MDX (deep) | Yes | case-study |
| 26 | **reteach AI Course Creation** | M | MDX (deep) | Yes | case-study |
| 27 | **reteach Compliance Workflows** | M | MDX (deep) | Yes | case-study |
| 28 | **CLOSED (e-commerce)** | M, N | MDX (deep) | Yes | case-study |
| 29 | **Museum Utopie und Alltag Digital** | M, P, N, O | MDX (deep) | Yes | case-study |
| 30 | **closed.com (Design System)** | N | — | No | project |
| 31 | **Hard Copy IV** | N | N (short) | Yes (N: 1 img) | project |
| 32 | **KABK Graduation Festival** | P, N | P (long + captions) | Yes (P: 6 pages) | project |
| 33 | **schwulesmuseum.de** | P, C, N, O | P+N | Yes (P: 3 pages) | project |
| 34 | **Sandberg Institute (identity)** | P, N | P (long + captions) | Yes (P: 4 pages) | project |
| 35 | **Sandberg Manifesto** | P, N | P+N | Yes (P: 4 pages) | project |
| 36 | **Sandberg Graduation Show** | P, N | P (long + captions) | Yes (P: 4 pages) | project |
| 37 | **Institute for Human Activities** | P, N | P+N | Yes (P: 2 pages) | project |
| 38 | **Open Lobby** | P, N | P+N (both long) | Yes (P: 6 pages) | project |
| 39 | **Studium Generale** | P, N | P+N | Yes (P: 2 pages) | project |
| 40 | **Voith** | P, N, O | P (short) | Yes (P: 2 pages) | project |
| 41 | **Drei, Drie, Three** (= 3×3) | P, N | P+N (long) | Yes (P: 4 pages) | project |
| 42 | **Expand All** | N | — | No | entry |
| 43 | **Here to Support** | N | N (EN+DE) | No | entry |
| 44 | Sandberg Announcements/Open Day | N | N (short) | Yes (N: 1 img) | entry |
| 45 | andreasmeichsner.de | N, O | — | Yes (N: 1 mockup) | entry |
| 46 | Tatwerk | N, O | — | No | entry |
| 47 | Amelie Losier | N, O | — | No | entry |
| 48 | Erik Andrisse | N | — | No | entry |
| 49 | DOK Eisenhüttenstadt | C, O | — | No | entry |
| 50 | Schloss Falkenlust | C, O | — | No | entry |
| 51 | Studio Achtviertel | C, O | — | No | entry |
| 52 | Leiter am Waal | C, O | — | No | entry |
| 53 | Gruppe Unterberger | C, O | — | No | entry |
| 54 | Piggy Poof | C, O | — | No | entry |
| 55 | Hotel Rebel | C, O | — | No | entry |
| 56 | Dennerlein Brands | C, O | — | No | entry |
| 57 | Novum | O | — | No | entry |
| 58 | Mister Spex | C, O | — | No | entry |
| 59 | Institut für Berufsintegrierende | C, O | — | No | entry |
| 89 | SMAC Chemnitz Katalog | C | — | No | entry |
| 90 | KABK Research Group | C | — | No | entry |
| 91 | Roosje Klap / Jan van Eyck | C | — | No | entry |

### TEACHING (~25 items)

| # | Title | Sources | Best text | Has images | Depth |
|---|---|---|---|---|---|
| 60 | **Event/Horizon** | P, N | P (long + captions) | Yes (P: 4 pages) | project |
| 61 | **All Watched Over by Machines of Loving Grace** | P, N | P+N (long) | Yes (P: 4 pages) | project |
| 62 | **Orte / Sichtweisen** | P, N | P+N (long) | Yes (P: 4 pages) | project |
| 63 | **Corona Awareness Campaign** | P, N | P+N (long) | Yes (P: 2 pages) | project |
| 64 | **Pictures of an Exhibition** | P, N (×2) | P (long + captions) | Yes (P: 4 pages) | project |
| 65 | **Jitsi Bitsi Spider** | P, N | P+N | Yes (P: 4 pages) | project |
| 66 | **weissensee.tv** | P, N | P+N | Yes (P: 2 pages) | project |
| 67 | **Open Day Campaign (mehr...als...)** | P, N | P+N (long) | Yes (P: 2 pages) | project |
| 68 | **Bender Gallery** | P, N | P+N | Yes (P: 2 pages) | project |
| 69 | **Radiosowjo** | P, N | P+N | Yes (P: 2 pages) | project |
| 70 | **The Invisible Cities** | P, N | P+N | Yes (P: 2 pages) | project |
| 71 | **Modern Talking** | P, N | P+N | Yes (P: 2 pages) | project |
| 72 | **Don't do it yourself** | P, N | P+N | Yes (P: 2 pages) | project |
| 73 | **Digital Campfire** (merged I/II/III) | P, N (×3) | P+N | Yes (P: 2 pages) | project |
| 74 | **Digital Design** (merged I/II/III) | P, N (×3) | P | Yes (P: 2 pages) | project |
| 75 | **Green Screen** | P | P (long + captions) | Yes (P: 4 pages) | project |
| 76 | **False Colours** (as seminar) | P | P | Yes (P: 2 pages) | special (see below) |
| 77 | **Fachgebiets-Katalog KHW** | N | N (short) | No | entry |
| 78 | **Archive for Youth Culture** | N | N (long) | Yes (N: 1 img) | project |
| 79 | XDXD Desktopmovies | N | N (short) | No | entry |
| 80 | We vs. Virus | N | N (long) | No | entry |
| 81 | Moving Membranes | N, C, O | — | No | entry |
| 82 | weißensee website | N | — | No | entry |
| 93 | Images in Disguise | C | — | No | entry |

### TEACHING: GRADUATION WORKS (~6 items, supervised students)

| # | Title | Sources | Best text | Has images | Depth |
|---|---|---|---|---|---|
| 83 | **Open the Black Box** (Sarah Schögler) | P, N | P+N (long) | Yes (P: 2 pages) | graduation |
| 84 | **MA(CHI)NE** (Carolin Lei) | P, N | P+N (long) | Yes (P: 2 pages) | graduation |
| 85 | **Wir müssen reden** (Anna Bierler) | P, N | P+N (long) | Yes (P: 2 pages) | graduation |
| 86 | **Synästhetische Wahrnehmungsform** (K. Raasch) | P, N | P+N | Yes (P: 2 pages) | graduation |
| 87 | **Water Stories** (C. Breidenbach) | P, N | P+N (long) | Yes (P: 2 pages) | graduation |
| 88 | **Ein gespenst geht um** (Merle Dammhayn) | P, N | P+N (long) | Yes (P: 2 pages) | graduation |

### CLIENTS — additional from CV "List of Works" appendix

These items appear ONLY in the CV appendix (not in CSV, PDF, or ODS) and must be included:

| # | Title | Year | Role (from CV) | Depth |
|---|---|---|---|---|
| 89 | **SMAC Chemnitz Katalog** | 2021 | Grafik Design | entry |
| 90 | **KABK Research Group** | 2019 | Design Research | entry |
| 91 | **Roosje Klap / Jan van Eyck Academy** | 2016 | Design Research | entry |
| 92 | **Wir Design** (= Voith context) | 2016 | UX/UI Design | entry (or merge with Voith) |

Note: schwules museum appears in CV for both 2017 AND 2018 — two years of work, already captured as one project.

### TEACHING — additional from CV "List of Teaching" appendix

| # | Title | Year | Institution | Depth |
|---|---|---|---|---|
| 93 | **Images in Disguise** | 2021 | HTW Berlin School of Design and Culture | entry |

### EXHIBITIONS & LECTURES from CV (separate appearances of existing projects)

These are NOT new projects but exhibition/lecture appearances of existing projects. They should be captured as **venues** within the parent project, not as separate files:

| Appearance | Year | Venue | Parent project |
|---|---|---|---|
| Power of Mesh lecture | 2014 | HDK Gothenburg | Power of Mesh |
| Power of Mesh lecture | 2014 | FH Düsseldorf | Power of Mesh |
| Power of Mesh lecture | 2014 | Danish Design School | Power of Mesh |
| Power of Mesh exhibition | 2014 | Biennale Chaumont | Power of Mesh |
| No Exit screening | 2016 | Biennale Brno, Prague | No Exit |
| No Exit screening | 2016 | GDFG Glasgow | No Exit |
| Quantified Meditations lecture | 2016 | RCA London (Eady Forum) | DDG / entry |
| De Balie screening + panel | 2014 | De Balie, Amsterdam | Open Lobby / We Are Here |
| False Colours performance | 2019 | Forecast Forum Berlin | False Colours |
| False Colours lecture | 2019 | Fault Lines, KABK | False Colours |
| False Colours lecture | 2020 | Stroom Den Haag | False Colours |
| Moving Membranes lecture | 2019 | Video Vortex 12, Malta | Moving Membranes |
| Moving Membranes lecture | 2019 | LCC London (with Schuppli) | Moving Membranes |
| Modern Talking lecture | 2021 | HTW Berlin | Modern Talking |

→ These venues should appear as a "shown at" list within the parent project's body or metadata.

### NON-PROJECT ITEMS (from CV — belong on /about, not in projects)

| Item | Type | Year |
|---|---|---|
| BA Visual Communication, FH Mainz | education | 2008–2013 |
| MA in the Arts, Sandberg Instituut | education | 2013–2015 |
| Certificate of Teaching, Berliner Zentrum für Hochschullehre | education | since 2018 |
| Diptych in Love | residency | 2020 |
| Creative Industries Fund NL (Moving Membranes) — start-up grant | grant | 2018 |
| Creative Industries Fund NL (Moving Membranes) — project grant | grant | 2019 |
| KABK/Leiden, Lectorate Design and the Deep Future (Alice Twemlow) | research position | since 2018 |
| Dialogfelder Chemnitz (Sanity is Something Better Outsourced) | residency | 2018 |

---

## 3. Decisions: Duplicates and Merges

| Problem | Resolution |
|---|---|
| `Drei, Drie, Three` (CSV:clients) + `3×3 — 100 Jahre De Stijl` (CSV:teaching) | **One project** in teaching. The client entry (Dutch Embassy) was an exhibition context for the workshop. Use title "Drei, Drie, Three" with both descriptions merged. |
| `Pictures of an Exhibition` (CSV: teaching + research) | **One project** in teaching, note that it resulted in a publication (book). The research entry adds the "book" format. |
| `Digital Campfire I/II/III` (3 CSV entries) | **One project**, venues listed in institution field, year "2014–2016". |
| `Digital Design I/II/III` (3 CSV entries) | **One project**, year "2017–2018". |
| `False Colours` in research + teaching | **Two separate entries.** Research = the installation itself. Teaching = the seminar where students explored the same material. Link them via a `related` field. |
| `Sandberg Institute` (identity) + `Sandberg Open Day` + `Sandberg Announcements` | **One project** "Sandberg Institute Identity" encompassing all the identity work. Sub-entries not needed — it was one continuous engagement. |
| `closed.com` (CSV) vs `closed-ecommerce.mdx` (existing) | **Two separate projects.** The MDX is about the e-commerce platform. `closed.com` is the design system work (2023). Also `Hard Copy IV` is a third CLOSED project (the magazine). |

---

## 4. Proposed Architecture: Four Tiers

### Tier 1: Case Study (`depth: case-study`)
Full MDX narrative with sections, images, videos, custom components. The 6 existing files + any future promotions. Gets a rich `/projects/[slug]` page.

### Tier 2: Project (`depth: project`)
Markdown file with frontmatter + 1–3 paragraph description (taken from portfolio PDF = best text). Gets its own `/projects/[slug]` page with a simpler prose layout. Shows in the project grid with cover image.
**~25 items** have enough text and images to be projects.

### Tier 3: Graduation Work (`depth: graduation`)
Like a project, but rendered differently — credits the student prominently, shows the supervisor role. Gets a page but is visually distinct (not "my" work, but supervised work).
**6 items** from HFBK portfolio.

### Tier 4: Entry (`depth: entry`)
Frontmatter only. Title, year, format, institution, role. **No dedicated page.** Appears only in the archive/list view as a compact row. This handles:
- Minor freelance jobs (Piggy Poof, Hotel Rebel, Dennerlein, etc.)
- Sub-items (False Colours performances, Dialogfelder sub-pieces)
- Works without documentation
- Talks/lectures
**~30 items.**

---

## 5. "Not-Project" Solutions

### Sub-performances → `parent` field
False Colours has 5 sub-pieces (Training, S.T.A.R.T.U.P., In the Field, The Jury, Membrane). Rather than 6 separate files, model this as:
- `false-colours.md` (depth: project) — main description + images of all pieces
- The sub-pieces are listed in the body text with their own descriptions and images, not as separate files. The portfolio PDF already presents them this way (one project, multiple sub-sections).

Same for Sanity is Something Better Outsourced → Figure of Teach, Triple Digest, Reft to Light, Circular Metabolism BBQ are described within the parent's body.

**This means: NO `parent` field needed.** Sub-items live inside the parent's markdown body, not as separate collection entries. Simpler schema, less file clutter.

Only create separate entry files for sub-items if they need to appear independently in the archive list.

### Iterations → merge into one
- Digital Campfire I/II/III → one file, institution lists all three venues
- Digital Design I/II/III → one file

### Talks/lectures → entry with `format: lecture`
- False Colours: An Image Reading → entry, linked to False Colours via body text
- Video Vortex, ISEA 2016 → entries

### Supervised graduation works → `depth: graduation`
These aren't the artist's own projects but supervised student work. The `graduation` depth makes the relationship clear. On the page: "Supervised by Benedikt Weishaupt" rather than "By Benedikt Weishaupt."

### Residencies/grants → NOT in projects collection
Education, residencies, and grants belong on the `/about` page (which already exists), not in the project list. They provide context for projects but aren't projects themselves. The about page's `AboutItemList` component already handles year-based lists.

### Dual-category projects → pick the primary, note the other
"Drei, Drie, Three" is both a client job (embassy) and teaching (workshop). Pick teaching as primary. Add a `secondary_category` or just note it in the description.

---

## 6. Schema Changes

```typescript
const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    status: z.enum(['public', 'draft', 'hidden']).default('draft'),
    audience: z.enum(['all', 'clients', 'academic', 'family']).default('all'),

    // NEW: rendering tier
    depth: z.enum(['case-study', 'project', 'graduation', 'entry']).default('entry'),

    order: z.number().default(99),

    // Make cover optional (entries won't have one)
    cover: z.object({
      image: z.string(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    }).optional(),

    meta: z.object({
      category: z.enum(['clients', 'research', 'teaching']),
      format: z.string().optional(),
      team: z.string().optional(),
      institution: z.string().optional(),
      year: z.string().optional(),
      // NEW: role (for entries where it matters)
      role: z.string().optional(),
    }),

    description: z.string().optional(),
    description_de: z.string().optional(),

    // NEW: credits
    collaborators: z.string().optional(),
    curators: z.string().optional(),
    // NEW: for graduation works
    student: z.string().optional(),
  }),
});
```

Key changes from current schema:
- `depth` field (4 values)
- `cover` becomes optional
- `meta.role` added (UX/UI Design, Webdevelopment, etc. — from ODS)
- `description_de` for German texts
- `collaborators`, `curators`, `student` fields
- No `parent` field (sub-items are inlined in parent body)

---

## 7. Data Flow: Which Source Feeds What

| Field | Primary source | Fallback |
|---|---|---|
| `title` | Portfolio PDF | CSV |
| `description` (EN) | Portfolio PDF (most polished) | CSV |
| `description_de` | CSV (only source for DE) | — |
| `meta.category` | CSV | Portfolio PDF section |
| `meta.format` | CSV (structured) | Portfolio PDF |
| `meta.institution` | CSV or Portfolio PDF | ODS |
| `meta.year` | CSV | ODS |
| `meta.team` | CSV | Portfolio PDF |
| `meta.role` | ODS | — |
| `collaborators` | CSV | Portfolio PDF |
| `curators` | CSV | — |
| `student` | Portfolio PDF | CSV |
| `cover.image` | Portfolio PDF spread | CSV `media_mainImg` |
| Image captions | Portfolio PDF (unique) | — |

---

## 8. Text Sourcing Strategy

The portfolio PDF has the **best English texts** — they are polished, publication-ready, and include image captions. These should be the primary source for project descriptions.

The CSV has the **only German texts** and sometimes longer/different English descriptions (e.g. No Exit has extra paragraphs about Brexit context in CSV that PDF omits).

Strategy:
1. Use PDF text as primary English description
2. Add CSV-unique English paragraphs where they add value
3. Store CSV German text in `description_de` for future bilingual support
4. Use PDF image captions as `alt`/`caption` text for images

---

## 9. Image Sourcing

The portfolio PDF contains high-quality project images with captions. These need to be extracted and placed in `public/image/projects/`.

The CSV references Notion-hosted images (`Portfolio%20Tabelle/...`) — these are likely lower quality exports and may not be accessible. Check if the original images exist locally.

For the ~25 "project" depth items that appear in the PDF, each has 2–6 images that should be extracted from the PDF as high-res exports. Image names should follow the pattern: `projects/{category}/{slug}/01.jpg`, `02.jpg`, etc.

For "entry" depth items — no images needed.

---

## 10. File Structure

```
src/content/projects/
  clients/
    # Case studies (existing MDX)
    reteach-design-system.mdx
    reteach-ai-course-creation.mdx
    reteach-compliance-workflows.mdx
    closed-ecommerce.mdx
    museum-digital.mdx
    # Projects (from portfolio PDF)
    kabk-graduation-festival.md
    schwules-museum.md
    sandberg-identity.md          ← merged: identity + open day + announcements
    sandberg-manifesto.md
    sandberg-graduation-show.md
    institute-human-activities.md
    open-lobby.md
    studium-generale.md
    voith.md
    hard-copy.md
    closed-design-system.md
    # Entries (from CV/ODS — no description, just metadata)
    here-to-support.md
    expand-all.md
    andreas-meichsner.md
    tatwerk.md
    amelie-losier.md
    erik-andrisse.md
    dok-eisenhuettenstadt.md
    schloss-falkenlust.md
    studio-achtviertel.md
    leiter-am-waal.md
    gruppe-unterberger.md
    piggy-poof.md
    hotel-rebel.md
    dennerlein-brands.md
    novum.md
    mister-spex.md
    institut-berufsintegrierende.md
    smac-chemnitz.md
    kabk-research-group.md
    roosje-klap.md
  research/
    # Case study (existing MDX)
    algorithmic-film.mdx
    # Projects
    false-colours.md              ← sub-pieces (Training etc.) described in body
    no-exit.md
    sanity-is-something-better-outsourced.md  ← sub-pieces in body
    power-of-mesh.md
    more-free-wifi.md
    item-to-item.md
    # Entries
    false-colours-image-reading.md
    landing-platform-flir.md
    edition-weissensee.md
    be-first-person-to-like.md
    neo-lythic.md
    liquid-assemblage.md
    out-in-the-open.md
    wifipendenceday.md
    design-displacement-group.md
  teaching/
    # Projects
    event-horizon.md
    all-watched-over.md
    orte.md
    corona-awareness-campaign.md
    pictures-of-an-exhibition.md
    jitsi-bitsi-spider.md
    weissensee-tv.md
    open-day-campaign.md
    bender-gallery.md
    radiosowjo.md
    invisible-cities.md
    modern-talking.md
    dont-do-it-yourself.md
    digital-campfire.md           ← merged I/II/III
    digital-design.md             ← merged I/II/III
    green-screen.md
    drei-drie-three.md            ← merged with 3×3
    archive-youth-culture.md
    false-colours-seminar.md
    fachgebiets-katalog.md
    # Entries
    xdxd-desktopmovies.md
    we-vs-virus.md
    moving-membranes.md
    weissensee-website.md
    images-in-disguise.md
    # Graduation works
    open-the-black-box.md
    machine.md
    wir-muessen-reden.md
    synaesthetische-wahrnehmungsform.md
    water-stories.md
    ein-gespenst-geht-um.md
```

**Total: ~90 files** (6 existing MDX + ~25 project MD + 6 graduation MD + ~53 entry MD)

---

## 11. Rendering Rules (DECIDED)

Only ONE list at `/projects`. No separate `/archive`. Case studies are highlighted via the existing case-study card view.

| Depth | In project list | Own `/projects/[slug]` page |
|---|---|---|
| case-study | Yes — cover card (highlighted) | Yes — rich MDX layout |
| project | Yes — cover card or row | Yes — prose layout with images |
| graduation | Yes — under teaching, credited to student | Yes — prose layout + student credit |
| entry | Yes — compact row (non-clickable) | No — no page built |

Graduation works are part of the teaching category, listed under a "Graduation Works" subsection. They are NOT a separate tier — they use `depth: graduation` but belong to `meta.category: teaching`.

---

## 12. Decisions (Resolved)

1. **Graduation works** → part of teaching. Listed in the project list under teaching with student credit.
2. **One list only** → `/projects` shows everything. Case study cards are the highlight, not a separate view.
3. **German texts** → yes, store in `description_de` for future bilingual support.
4. **Entry pages** → no page. Entries are non-clickable rows in the project list.
5. **Images** → prioritize ~25 project-depth items first. Source from local folder (see §13).
6. **"More Free Wifi" + "Power of Mesh"** → two phases of one project. Merge into "Power of Mesh" with "More Free Wifi" as earlier phase described in body.

---

## 13. Image Source: Local Work Documentation

Images do NOT need to be extracted from the PDF. A comprehensive local archive exists at:

```
/Users/benediktweishaupt/Documents/10_pictures/01_work_documentation/
  01_personal_projects/    (~1,920 files across 41 folders)
  02_teaching/             (~1,724 files across 36 folders)
  03_clients/              (~330 files across 23 folders)
```

### Image folder → Project mapping

**Research (01_personal_projects/)**

| Project | Image folder | File count |
|---|---|---|
| False Colours | `2019_CoT_false colours/` | 340 |
| False Colours: An Image Reading | `2019_CoT_false colours lecture/` | 144 |
| Sanity is Something Better Outsourced | `2018_CoT_SISBO/` | 356 |
| No Exit | `2015_DDG_Glasgow/` + `2017_DDG-Brno/` | 36 + 3 |
| Power of Mesh (+ More Free Wifi) | `2014_POM_Chaumont/` + `2014_POM_Athens/` + `2014_POM_Cloudsuits/` + `2014_POM_Dish/` + `2015_POM_Athens/` | 49 + 13 + 56 + 84 + 14 |
| Item to Item | `2015_item-to-item_dibond/` + `2015_item_to-Item_installation/` | 42 + 60 |
| Open Lobby | `2014_open-lobby/` | 16 |
| edition Weißensee | `2019_Edition_Weissensee/` | 4 |
| Landing Platform (Nailing It) | `2019_Nailing it_Press Kit/` | 10 |
| DDG misc | `_DDG/`, `2013_DDG_Servicegarage/`, `2014_DDG-Manifesfest/`, `2016_DDG-RCA/` | 10 + 9 + 5 + 19 |
| De Balie panel | `2013_We-are-here-panel-de-balie/` | 9 |
| Youtube experiments (Neo Lythic etc.) | `2014_Youtube experiments/` | 18 |

**Teaching (02_teaching/)**

| Project | Image folder | File count |
|---|---|---|
| Event/Horizon | `2019_CoT_Event-Horizon/` | 181 |
| All Watched Over | `2018_WS_All watched over.../` | 110 |
| Orte | `2017_WS_Orte/` | 31 |
| Corona Awareness Campaign | `2021_WS_Corona_Campagne/` | 60 |
| Pictures of an Exhibition | `2019_CoT_Workshop_LCC/` | 284 |
| Jitsi Bitsi Spider | `0_alle_Semester_jitsi-bitsi-spider/` | 51 |
| weissensee.tv | `2020_WS_weissensee-tv/` | 169 |
| Open Day Campaign (mehr...als...) | `2019_SS_mehr-als_Rundgangskampagne/` | 17 |
| Bender Gallery | `0_alle_Semester_Bender/` | 8 |
| Radiosowjo | `2019_WS_Radio-Sowjo/` | 39 |
| Invisible Cities | `2018_SS_Die-Unsichtbaren-Staedte/` | 7 |
| Modern Talking | `2017_WS_Modern-Talking/` | 28 |
| Don't do it yourself | `2017_WS_Dont do it yourself/` | 5 |
| Digital Campfire (I/II/III) | `2015_DDG_Cambrai/` + `2015_DDG_JVE Summer School/` | 92 + 29 |
| Digital Design | `2017_WS_BTK_Digital_Design_Processbook/` + `2018_WS_BTK_Digital_Design/` + `2018_BTK_Dokimages/` | 3 + 6 + 13 |
| Green Screen | `2019_CoT_Workshop_BTK/` | 118 |
| Drei, Drie, Three (3×3) | `2016_WS_de-Stijl/` | 81 |
| Archive for Youth Culture | `2017_SS_Archiv-der-Jugendkulturen/` | 13 |
| Fachgebiets-Katalog | `2017_SS_Rundgang Leitsystem/` (partial) | 120 |
| XDXD Desktopmovies | `2019_WS_XDXD/` | 9 |
| We vs. Virus | `2020_SS_We-vs-Virus/` | 17 |
| Graduation: Open the Black Box | `2020_SS_MA-Abschluss_Sarah-Schoegler/` | 4 |
| Graduation: MA(CHI)NE | `2020_SS_BA-Abschluss_Caroline-Lei/` | 21 |
| Graduation: Wir müssen reden | `2018_WS_Anna-Bierler_Abschluss-BA/` | 5 |
| Graduation: Synästhetische Wahrnehmungsform | `2017_WS_Kathleen-Raasch_abschluss-MA/` | 56 |
| Graduation: Water Stories | `2019_SS_MA_Caroline-Breidenbach_Wasserstories/` | 36 |
| Graduation: Ein gespenst geht um | `2020_BA_Merle Dammhayn/` | 12 |

**Clients (03_clients/)**

| Project | Image folder | File count |
|---|---|---|
| KABK Graduation Festival | `2014_Graduation Festival KABK/` | 31 |
| schwulesmuseum.de | `2018_Schwules Museum/` | 35 |
| Sandberg Identity | `2014_Sandberg Open Day/` + `2014_Sandberg Various/` | 33 + 9 |
| Sandberg Manifesto | `2015_Sandberg_Catalog/` | 12 |
| Sandberg Graduation Show | `2014_Sandberg Graduation Campaign/` | 6 |
| Institute for Human Activities | `2015_Institute-for-human-activities/` | 37 |
| Studium Generale | `2015_Studium Generale KABK/` | 32 |
| Voith | `2016_Voith/` | 7 |
| Hard Copy | `2019_Hard-Copy/` | 5 |
| CLOSED Design System | `2023_closed/` | 18 |
| Here to Support | `2014_Here to Support Identity/` | 8 |
| Expand All | `2021_Expand-All/` | 2 |
| Andreas Meichsner | `2019_Andreas Meichsner - Photography/` | 5 |
| Hotel Rebel | `2015_Hotel Rebel/` | 4 |
| Museum Utopie und Alltag | `2022_utopie-und-alltag-digital/` | 16 |

### Image migration strategy
1. For each project-depth item, select 3–6 best images from the local folder
2. Copy to `public/image/projects/{slug}/` as `01.jpg`, `02.jpg`, etc.
3. Use portfolio PDF captions as `alt` text where available
4. First image becomes the `cover.image` in frontmatter

---

## 14. Migration Steps

1. **Extend schema** — add `depth`, `student`, `description_de`, `collaborators`, `curators`, `meta.role`; make `cover` optional
2. **Update existing 6 MDX files** — add `depth: case-study` to frontmatter
3. **Create ~25 "project" files** — use portfolio PDF English text, CSV German text as `description_de`
4. **Create 6 "graduation" files** — from HFBK portfolio "Graduation Works" section, `meta.category: teaching`
5. **Create ~53 "entry" files** — frontmatter only from CSV + CV + ODS
6. **Merge duplicates** — Drei/3×3, Pictures of Exhibition, Sandberg identity items, Digital Campfire I/II/III, Digital Design I/II/III, Power of Mesh + More Free Wifi
7. **Copy images** from local work documentation folder → `public/image/projects/`
8. **Update WorkIndex** — single list showing all depths appropriately
9. **Delete `prd.txt`** — confirmed obsolete
