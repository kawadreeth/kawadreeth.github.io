# Spec: Extend update_site.py — Sync Experiences & Projects from Career Doc

**Date:** 2026-06-10
**Status:** Approved

---

## Goal

Extend `update_site.py` so it syncs `const EXPERIENCE` and `const PROJECTS` in `data/site-data.js`
from the master career `.docx`, in addition to the existing bio and skills sync.

Two behaviours:
1. **Sync existing entries** — update all doc-derivable fields for entries already in `site-data.js`
2. **Detect new entries** — print a ready-to-paste JS scaffold for entries in the doc with no matching slug

---

## Scope

### What is synced from the doc

**Experiences:**
- `company`, `role`, `dates`, `location`
- Per subproject: `title`, `tools[]`
- Per subproject STAR: `situation`, `task`, `action[]`, `result[]`

**Standalone projects:**
- `title`, `tags[]` (from tools line)
- STAR: `situation`, `task`, `action[]`, `result[]`

### What is preserved (manual-only, never touched)

**Experiences:** `slug`, `logo`, `zone`, `bullets[]`
Per subproject: `gallery`

**Projects:** `slug`, `zone`, `thumb`, `gallery`, `links`

### Not in scope

- FireWarden and CWC/AEE are treated as **PROJECTS** (not EXPERIENCE) — matching current `site-data.js`
- `ABOUT`, `SKILLS` sync unchanged
- No HTML file generation for new entries

---

## Doc Structure

The career `.docx` body interleaves paragraphs (`w:p`) and tables (`w:tbl`). The parser must
walk `doc.element.body` children in XML order, not just `doc.paragraphs`.

### Experience entry (in doc)

```
[paragraph]  "GrayMatter Robotics  —  Robotics Systems & Applications Intern"
[paragraph]  "Jan 2026 – May 2026  |  Robotic surface finishing & automation  |  Torrance, CA"
[paragraph]  "Project 1: Production-Ready Universal Sanding Fixture"
[paragraph]  tools line: "SolidWorks · MeshLab · ROS2 · ..."
[table]      row 0: cell["S"] | cell["SITUATION  The initial ..."]
             row 1: cell["T"] | cell["TASK  Redesign ..."]
[paragraph]  "ACTION"
[paragraphs] action bullet items
[paragraph]  "RESULT"
[paragraphs] result bullet items
[paragraph]  "Project 2: ..."
...
```

Experiences with a single `Project N:` block produce the **flat star** layout in `site-data.js`
(`star: { situation, task, action, result }`).

Experiences with multiple `Project N:` blocks produce the **subprojects** layout
(`subprojects: [{ title, tools, gallery, star: {...} }]`).

### Standalone project entry (in doc)

```
[paragraph]  "Adaptive Pitch Control — H-Type Vertical Axis Wind Turbine"
[paragraph]  tools line: "Bayesian Optimisation · PID Control · ..."
[table]      row 0: "S" | "SITUATION ..."
             row 1: "T" | "TASK ..."
[paragraph]  "ACTION"
[paragraphs] action bullets
[paragraph]  "RESULT"
[paragraphs] result bullets
```

---

## Parsing Algorithm

### Element walker

```python
def iter_body_elements(doc):
    """Yield (kind, obj) for each paragraph or table in document order."""
    from docx.oxml.ns import qn
    for child in doc.element.body:
        tag = child.tag.split('}')[-1]  # 'p' or 'tbl'
        if tag == 'p':
            yield ('paragraph', Paragraph(child, doc))
        elif tag == 'tbl':
            yield ('table', Table(child, doc))
```

### Tokenisation

Classify each element into one of these token types:

| Token | Detection rule |
|---|---|
| `COMPANY_HEADER` | paragraph text contains a name from `KNOWN_COMPANIES` |
| `DATE_LINE` | paragraph text matches `r'\w+ \d{4}\s*[–-]'` |
| `SUBPROJECT_HEADER` | paragraph text matches `r'^Project \d+:\s*'` |
| `TOOLS_LINE` | paragraph text contains `·` or `\xb7` bullet separator |
| `STAR_TABLE` | 2-row table where `row[0].cells[0].text.strip() == 'S'` |
| `ACTION_HEADER` | paragraph text stripped == `'ACTION'` |
| `RESULT_HEADER` | paragraph text stripped == `'RESULT'` |
| `BULLET_ITEM` | list paragraph (non-empty, not matching above) inside ACTION/RESULT state |
| `STANDALONE_TITLE` | paragraph text in `PROJECT_TITLE_SLUGS` keys |

### State machine

```
IDLE
  → COMPANY_HEADER        → IN_EXPERIENCE
  → STANDALONE_TITLE      → IN_PROJECT

IN_EXPERIENCE
  → DATE_LINE             → capture dates/location
  → SUBPROJECT_HEADER     → IN_SUBPROJECT (append previous subproject if any)
  → COMPANY_HEADER        → emit experience, restart IN_EXPERIENCE
  → STANDALONE_TITLE      → emit experience, → IN_PROJECT

IN_SUBPROJECT
  → TOOLS_LINE            → capture tools
  → STAR_TABLE            → capture situation, task
  → ACTION_HEADER         → IN_ACTION
  → RESULT_HEADER         → IN_RESULT
  → SUBPROJECT_HEADER     → emit subproject, restart IN_SUBPROJECT
  → COMPANY_HEADER        → emit subproject+experience, → IN_EXPERIENCE

IN_ACTION
  → BULLET_ITEM           → append to action[]
  → RESULT_HEADER         → IN_RESULT
  → SUBPROJECT_HEADER     → emit subproject, → IN_SUBPROJECT

IN_RESULT
  → BULLET_ITEM           → append to result[]
  → SUBPROJECT_HEADER     → emit subproject, → IN_SUBPROJECT
  → COMPANY_HEADER        → emit subproject+experience, → IN_EXPERIENCE
  → STANDALONE_TITLE      → emit subproject+experience, → IN_PROJECT

IN_PROJECT  (standalone)
  → TOOLS_LINE            → capture tags
  → STAR_TABLE            → capture situation, task
  → ACTION_HEADER         → IN_PROJECT_ACTION
  → RESULT_HEADER         → IN_PROJECT_RESULT
  → STANDALONE_TITLE      → emit project, restart IN_PROJECT

IN_PROJECT_ACTION
  → BULLET_ITEM           → append to action[]
  → RESULT_HEADER         → IN_PROJECT_RESULT

IN_PROJECT_RESULT
  → BULLET_ITEM           → append to result[]
  → STANDALONE_TITLE      → emit project, → IN_PROJECT
```

---

## Data Models

```python
@dataclass
class SubProject:
    title: str
    tools: list[str]
    situation: str
    task: str
    action: list[str]
    result: list[str]

@dataclass
class Experience:
    company: str
    role: str
    dates: str
    location: str
    subprojects: list[SubProject]   # len==1 → flat star layout

@dataclass
class Project:
    title: str
    tags: list[str]
    situation: str
    task: str
    action: list[str]
    result: list[str]
```

---

## Matching: doc entries → site-data.js slugs

### Experiences

`SLUG_MAP` already maps company name → slug. No changes needed.

### Standalone projects

New constant in `update_site.py`:

```python
PROJECT_TITLE_SLUGS = {
    "Adaptive Pitch Control — H-Type Vertical Axis Wind Turbine": "vawt",
    "Turbine Airfoil CFD Optimization": None,          # new — no slug yet
    "Honeycomb Flow Straightener Wind Tunnel Study": "windtunnel",
    "Smart Alarm Clock with REM Sleep Monitoring": "alarm",
    "Walkane — Collapsible Walker-Cane Hybrid": "walkane",
    "FireWarden — Wildfire Defense System": "firewarden",
    "USC Collegiate Wind Competition": "cwc",
    "FSAE Projects": "fsae",
    "8 DoF Robotic Hand": "dexhand",
    # Other Projects (Summary) entries map to existing slugs
    "Truss Bridge Optimisation": "bridge",
    "2-DOF Bluetooth-Controlled Car": "kothcar",
    "Water Rocket Flight Optimisation": "waterrocket",
    "Drone CAD & FEA": "drone",
    "Automated Monopoly Board": "monopoly",
}
```

A `None` slug means "new entry — no existing match". These trigger the scaffold output.

---

## JS Generation

### patch_experiences

```python
def patch_experiences(js_text, experiences, existing_js_text):
    ...
    # For each experience:
    #   - look up existing entry by slug to get manual fields
    #   - build JS object string
    # Regenerate full const EXPERIENCE = [...] block
    patched = re.sub(r'const EXPERIENCE = \[.*?\];', new_block, js_text, flags=re.DOTALL)
    return patched
```

**Single-subproject experience** → flat `star` layout:
```js
{
  slug: "tutr",
  company: "TuTr Hyperloop",
  logo: "",             // preserved
  role: "...",          // from doc
  dates: "...",         // from doc
  location: "...",      // from doc
  zone: "hardware",     // preserved
  bullets: [...],       // preserved
  star: {
    situation: "...",   // from doc
    task: "...",        // from doc
    action: [...],      // from doc
    result: [...]       // from doc
  }
}
```

**Multi-subproject experience** → `subprojects` layout:
```js
{
  slug: "graymatter",
  company: "GrayMatter Robotics",
  logo: "",             // preserved
  role: "...",          // from doc
  dates: "...",         // from doc
  location: "...",      // from doc
  zone: "robotics",     // preserved
  bullets: [...],       // preserved
  subprojects: [
    {
      title: "...",     // from doc
      tools: [...],     // from doc
      gallery: [],      // preserved
      star: {
        situation: "...",
        task: "...",
        action: [...],
        result: [...]
      }
    }
  ]
}
```

### patch_projects

Same pattern — regenerates full `const PROJECTS = [...]` block, preserving `slug`, `zone`,
`thumb`, `gallery`.

### New entry scaffold output

When a doc entry has no matching slug (or `None` slug), print to stdout:

```
⚠  New project detected: "Turbine Airfoil CFD Optimization"
   Paste into site-data.js and fill in // TODO fields:

  {
    slug: "TODO_slug",
    title: "Turbine Airfoil CFD Optimization",
    zone: "TODO_zone",          // cleantech | robotics | hardware
    thumb: "TODO_thumb_path",
    tags: ["Star-CCM+", "MATLAB", ...],
    gallery: [],
    star: {
      situation: "...",
      task: "...",
      action: [...],
      result: [...]
    }
  },
```

Do **not** modify `site-data.js` for new entries.

---

## main() Changes

```python
print("Parsing experiences ...")
experiences = parse_experiences(paragraphs_and_tables)
print(f"  Found {len(experiences)} experience(s).")

print("Parsing projects ...")
projects = parse_projects(paragraphs_and_tables)
print(f"  Found {len(projects)} project(s).")

print("Patching experiences ...")
js_text = patch_experiences(js_text, experiences, original)

print("Patching projects ...")
js_text = patch_projects(js_text, projects, original)
```

The existing `parse_bio` / `parse_skills` use `get_paragraphs()` which returns only paragraph
text. The new parser needs the raw element walk. A new `get_body_elements(doc)` function
replaces the `get_paragraphs` call for the new parsers; the old parsers remain unchanged.

---

## Error Handling

- Unknown company in doc (not in `KNOWN_COMPANIES`): skip, print warning
- STAR table not found for an entry: keep existing `situation`/`task` from site-data.js, print warning
- Entry in `site-data.js` not found in doc: keep as-is, print warning
- Missing manual fields for existing entries (e.g. `zone` not in existing JS): use empty string default

---

## Testing Approach

1. Run `update_site.py` and verify `git diff data/site-data.js` shows only expected changes
2. Check that manual fields (zone, thumb, gallery, etc.) are unchanged in the diff
3. Verify at least one new entry produces a scaffold warning to stdout
4. Revert: `git checkout data/site-data.js`
