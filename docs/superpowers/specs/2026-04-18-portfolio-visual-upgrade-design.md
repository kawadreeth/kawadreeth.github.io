# Portfolio Visual Upgrade — Design Spec
**Date:** 2026-04-18
**Scope:** Three visual upgrades to `reethkawad.github.io` — hero photo, experience timeline, project drawer expansion.

---

## 1. Hero Section — Centered Photo

**Change:** Add a 150px circular profile photo above the typing name in the hero section.

**Layout:**
- `profile_picture.png` centered, `150px × 150px`, `border-radius: 50%`, `object-fit: cover`
- Thin `2px` border using existing `--border` token
- Positioned above the `.hero-label` ("Mechanical Engineer")
- Photo also remains in the About section — no removal

**Zone portals:** Remove the `<span class="zone-count">` elements entirely (the "— projects" / "N projects" text). The count spans are rendered from JS (`id="count-cleantech"` etc.) — remove both the HTML elements and the JS lines that populate them.

**Data changes:** None.

---

## 2. Experience Section — Timeline + Mini Flowcharts

**Layout:** Vertical timeline replacing the current flat card list.
- Left-side spine: `2px` vertical line in `--border` color
- Each entry: dot on the spine (zone-colored, glowing), card to the right with zone-colored left border
- Card header: 40×40px company logo (existing `logo` asset), company name, role, dates, zone badge

**Mini flowchart:** Horizontal chain of nodes inside each card, below the header, above the bullet points.
- Zone-colored node boxes (rounded, small text) connected by `→` arrows
- Wraps naturally on narrow screens

**Data model change — `experience` entries in `data/projects.js`:**
Add a `flowchart` array of strings to each entry:

```js
flowchart: ["Node A", "Node B", "Node C"]
```

Each string becomes one node in the chain. Nodes are rendered left-to-right with `→` separators.

**Flowchart values per role:**
| Role | Nodes |
|------|-------|
| Lumindt Labs | Hot-wire DAQ → Electrolyzer Skid → Heat Exchanger Calc → Fuel Cell Frame → Python Automation |
| Baum Makerspace | CNC / Waterjet → 3D Printing → DFM Guidance |
| TuTr Hyperloop | Chassis Optimization → Structural Analysis → Air Gap Control → Simulink Model |
| RLD Lab | Leg Mechanism → Holding Frame → Motor Test Stand |
| NIWE | Blade CAD → Structural Analysis → Load Case Optimization |

**Bullet points:** Remain below the flowchart, same markup as today.

---

## 3. Project Drawer — 80% Width + Image Gallery

**Width:** Drawer expands to `80vw` on desktop (breakpoint ≥ 640px), capped at `900px max-width`. Mobile stays full-width bottom sheet (unchanged).

**Image gallery:** Clickable 3-image strip replaces the single `drawer-image`.
- Main image: full-width, `~220px` tall, `object-fit: cover`, rounded corners
- Thumbnail strip: 3 equal-width thumbnails below main image, `64px` tall
- Clicking a thumbnail swaps the main image (JS `click` handler updates `src`)
- Active thumbnail highlighted with zone-colored border; inactive thumbnails use `--border`
- If only 1 image (current `image` field, no `images` array), gallery renders as single image with no strip

**Data model change — `projects` entries in `data/projects.js`:**
Add an optional `images` array alongside the existing `image` field:

```js
image: "assets/primary.jpg",      // existing — used as card thumbnail + gallery[0] fallback
images: ["assets/img2.jpg", "assets/img3.jpg"]  // optional extra gallery images
```

The rendered gallery = `[project.image, ...(project.images ?? [])]`, capped at 3.

All existing projects get `images: []` initially — user adds paths when ready.

---

## Implementation Order (data-model first)

1. **`data/projects.js`** — add `images: []` to all projects; add `flowchart: [...]` to all experience entries
2. **`index.html`** — add hero photo markup; remove zone-count spans
3. **`script.js`** — update `renderExperience()` to render timeline + flowchart; update `openDrawer()` for gallery; remove zone-count population lines
4. **`style.css`** — add hero photo styles; add timeline styles; update drawer width + gallery styles

---

## What Does Not Change

- About section (photo stays there too)
- Project card grid layout
- Filter tabs and zone portal click behavior
- Skills section
- Mobile drawer behavior (bottom sheet, full width)
- All existing data fields (`id`, `title`, `zone`, `image`, `summary`, `description`, `tags`, `links`)
