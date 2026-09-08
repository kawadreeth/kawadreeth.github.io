# Portfolio Content Upgrade — Design Spec
**Date:** 2026-06-07
**Scope:** Full content refresh of `reethkawad.github.io` — richer detail pages, auto-gallery, skills restructure, NIWE/FireWarden/CWC entries, resume download, and a doc-to-site update script.

---

## 1. Goals

1. Main page shows projects and experiences as minimal cards (image + name + tags + subproject titles).
2. Each project and experience has a dedicated detail page with full STAR sections.
3. Experience detail pages show sub-projects, each with their own STAR + gallery.
4. Gallery images per project/experience are listed in `site-data.js`; all images in the list auto-render.
5. Skills section restructured from 3 sparse columns to 11 real categories from the career doc.
6. Resume download button in header and contact section.
7. `python update_site.py` reads the `.docx` and updates text content in `site-data.js` without overwriting gallery/zone/thumb metadata.

---

## 2. Data Model (`data/site-data.js`)

### 2.1 ABOUT

Add one field:

```js
const ABOUT = {
  // ... existing fields ...
  resume: "assets/Reeth_Kawad_CV.pdf"
};
```

### 2.2 PROJECTS

Each project gains two new fields. All other existing fields are preserved.

```js
{
  slug: "vawt",
  title: "Vertical Axis Wind Turbine",
  zone: "cleantech",
  thumb: "assets/projects/vawt/thumb.jpg",
  summary: "...",           // kept but no longer shown on main page card
  tags: ["Wind Energy", "Controls", "SolidWorks"],
  gallery: [                // NEW — empty array until images are added
    "assets/projects/vawt/img1.jpg"
  ],
  star: {                   // NEW
    situation: "VAWTs commonly operate below theoretical efficiency due to fixed blade pitch.",
    task: "Design, fabricate, and test a 5-inch H-type VAWT with individual blade pitch control.",
    action: [
      "Designed and fabricated a 5-inch H-type VAWT with individual blade pitch actuation mechanism.",
      "Implemented Bayesian Optimisation to search the pitch control parameter space.",
      "Developed PID controller for active pitch tracking.",
      "Tested in wind tunnel — measured Cp vs wind speed curves."
    ],
    result: [
      "Targeting ~8% efficiency improvement over fixed-pitch baseline.",
      "Built practical expertise in Bayesian Opt + PID, small turbine fabrication, and wind tunnel measurement."
    ]
  }
}
```

**New projects to add:**
- `firewarden` (zone: cleantech) — Co-Founder/CTO, wildfire defense web app + fluid dynamics
- `cwc` (zone: cleantech) — AEE/USC Collegiate Wind Competition; single STAR covering both Controls/Electronics and Mechanical/Farm Design work areas in the action bullets

### 2.3 EXPERIENCE

Each entry gains `subprojects`. The existing `bullets` array is kept for the main page card. `flowchart` is removed (replaced by subproject structure).

```js
{
  slug: "graymatter",
  company: "GrayMatter Robotics",
  role: "Robotics Systems & Applications Intern",
  dates: "Jan 2026 – May 2026",
  location: "Torrance, CA",
  zone: "robotics",
  logo: "",
  bullets: [                // kept — shown on main page card
    "Led mechanical design for a production-ready universal sanding fixture accommodating 14 SKUs.",
    "Built a multimodal DAQ pipeline reducing industrial engineering time studies by ~40%."
  ],
  subprojects: [            // NEW
    {
      title: "Production-Ready Universal Sanding Fixture",
      tools: ["SolidWorks", "MeshLab", "Point Cloud Processing", "Spring-Loaded Mechanisms", "Force Testing", "3D Printing", "ROS2"],
      gallery: [],
      star: {
        situation: "Initial fixture designs caused the robot to sand the fixture itself — vision segmentation could not distinguish fixture from workpiece. Product line had 14 SKUs ranging S to XL.",
        task: "Redesign the fixture from scratch to hold all 14 configurations reliably, eliminate vision misclassification, and meet customer requirements.",
        action: [
          "Mapped all mechanical, vision, and software constraints across teams before touching a design.",
          "Developed SolidWorks concepts and analysed point clouds in MeshLab to tune segmentation parameters.",
          "Introduced compliant spring-loaded features to accommodate S–XL part size variation without manual adjustment.",
          "Incorporated displacement sensors to validate part seating before the sanding cycle.",
          "Performed force testing to identify failure modes and quantify performance improvements.",
          "Executed rapid prototyping cycles using 3D printing and modular design."
        ],
        result: [
          "Universal fixture accommodated all 14 SKUs in a single design.",
          "Eliminated vision misclassification — robot no longer sanded the fixture itself.",
          "Customer confirmed strong satisfaction with robustness and performance outcomes."
        ]
      }
    },
    {
      title: "Systems & Applications Engineering — Robotic Arm Process Development",
      tools: ["ROS2", "RVIZ", "MeshLab", "FANUC Arms", "Python", "YAML/JSON", "DOE", "Sensor Calibration", "GitHub"],
      gallery: [],
      star: {
        situation: "GrayMatter deploys robotic sanding arms on customer parts requiring custom segmentation, toolpath planning, and recipe validation before deployment.",
        task: "Lead system and applications engineering for customer parts from 3D scan through segmentation, toolpath generation, FANUC programming, and process recipe development.",
        action: [
          "Conducted reachability studies from CAD models to identify blind spots early.",
          "Worked with multiple segmentation algorithms on point clouds in MeshLab.",
          "Developed toolpaths by tuning CNT values, tool orientation, overlap percentage, and pass direction.",
          "Programmed FANUC robotic arms to execute validated toolpaths.",
          "Designed and executed DOE-driven sanding campaigns sweeping force, tilt angle, and RPM.",
          "Managed project files with GitHub; used YAML/JSON for process parameter storage."
        ],
        result: [
          "Developed end-to-end proficiency in robotic process engineering: from raw point cloud to deployed robot program.",
          "Reduced manual effort in segmentation and toolpath setup through Python automation scripts."
        ]
      }
    },
    {
      title: "Multimodal Human Sanding Characterisation DAQ Pipeline",
      tools: ["Force Sensors", "IMUs", "OpenVR", "Thermal Sensors", "Python", "ROS2", "Rerun Visualisation"],
      gallery: [],
      star: {
        situation: "GrayMatter needed to understand expert human sanding behaviour at a physical parameter level to automate industrial engineering time studies.",
        task: "Build a multimodal DAQ pipeline synchronising force, IMU, position (OpenVR), and thermal sensor streams at 100+ Hz with full post-processing analytics.",
        action: [
          "Selected and integrated force sensors, IMUs, OpenVR position trackers, and thermal sensors into a time-synchronised ROS2 pipeline at 100+ Hz.",
          "Integrated Rerun for real-time and post-hoc visualisation of 3D sanding paths.",
          "Built post-processing analytics: ESH savings calculator, task classification, robot feasibility recommendations, consumables calculator.",
          "Designed the pipeline to feed GrayMatter's solutions-engineering agent core."
        ],
        result: [
          "Reduced industrial engineering time studies by approximately 40%.",
          "Analytics layer enables quantified dollar-value business cases for robot deployment.",
          "Produced a reusable, modular platform (DAQ + visualisation + analytics)."
        ]
      }
    }
  ]
}
```

**New experience entry to add:**
- `niwe` — National Institute of Wind Energy, Wind Blade Intern, Jul–Aug 2023, Chennai, India (zone: cleantech). Single-project experience (no subprojects array needed; use STAR fields directly).

**Entries with no subprojects** (Makerspace, DRCL, TuTr, NIWE) get a flat `star` object instead of `subprojects`:

```js
{
  slug: "tutr",
  // ... existing fields ...
  star: {
    situation: "TuTr's hyperloop pod chassis needed to be lighter without compromising structural integrity.",
    task: "Analyse the existing chassis and identify weight reduction opportunities while maintaining safety margins.",
    action: [
      "Conducted 1D and 3D structural analyses in ANSYS Mechanical and Siemens NX to identify over-designed sections.",
      "Proposed targeted material removal and geometry changes; validated each iteration."
    ],
    result: [
      "Optimised chassis weight by 30% while maintaining full structural integrity."
    ]
  }
}
```

### 2.4 SKILLS

Restructured from 3 zone-based columns to 11 category objects. Zone coloring is removed from skills.

```js
const SKILLS = {
  controls: {
    label: "Controls & Firmware",
    items: ["Arduino IDE", "I2C architecture", "State machine design", "PID control", "Bayesian optimisation", "MOSFET braking", "Buck-boost converter", "Embedded C++"]
  },
  robotics: {
    label: "Robotics",
    items: ["ROS2", "RVIZ", "FANUC arm programming", "Toolpath planning", "Point cloud segmentation", "MuJoCo simulation", "Reachability studies"]
  },
  sensing: {
    label: "Sensing & DAQ",
    items: ["Force sensors", "IMUs", "OpenVR position tracking", "Thermal sensors", "Transient hot-wire", "Multimodal sync at 100+ Hz", "Signal conditioning", "Rerun", "LabVIEW"]
  },
  mechanical: {
    label: "Mechanical Design",
    items: ["SolidWorks", "Siemens NX", "Fusion 360", "GD&T", "DFM", "Compliant mechanisms", "SEA design", "Parallel link mechanisms", "Weldment design"]
  },
  simulation: {
    label: "Simulation & Analysis",
    items: ["ANSYS Mechanical FEA", "ANSYS Fluent CFD", "MuJoCo", "QBlade", "StarCCM+", "MATLAB/Simulink", "FLORIS wake optimiser"]
  },
  manufacturing: {
    label: "Manufacturing",
    items: ["Haas CNC Mill & Lathe", "ProtoTRAK", "Omax Waterjet", "Laser Cutter", "MasterCam", "FDM/SLA/Carbon Fibre 3D Printing", "Composite Layup", "Resin Infusion", "±0.001\" tolerancing"]
  },
  thermofluids: {
    label: "Thermofluids",
    items: ["Transient hot-wire method", "Heat exchanger design", "Coolant loop analysis", "Fluid dynamics", "CFD (Fluent)", "Thermal management", "Hydrogen system thermal characterisation"]
  },
  structural: {
    label: "Structural",
    items: ["ASME stress analysis", "Weldment structural calc", "Chassis optimisation", "Blade load case analysis", "1D & 3D FEA"]
  },
  software: {
    label: "Software & Scripting",
    items: ["Python", "MATLAB", "C++", "Arduino", "ROS2", "YAML/JSON", "GitHub", "LabVIEW"]
  },
  energy: {
    label: "Energy Systems",
    items: ["Wind turbine controls & design", "FLORIS farm optimisation", "QBlade/StarCCM+ blade aero", "Thermal energy storage", "Electrolyser & fuel cell systems", "Hydrogen gas handling"]
  },
  leadership: {
    label: "Leadership & Entrepreneurship",
    items: ["Team founding & management", "Cross-functional stakeholder coordination", "Customer discovery", "Pitch competitions", "Partnership development", "Chapter founding (AEE USC)"]
  }
};
```

---

## 3. Main Page Cards

### 3.1 Project Card

```
[thumbnail image — full card width]
Project Title
⚡ Cleantech   [tag]  [tag]  [tag]
```

Clicking navigates to `projects/project.html?slug=<slug>`.

**What is removed from the current card:** summary paragraph, status badge.

### 3.2 Experience Card

```
[logo]  Company Name
        Role Title
        Dates · Location
        ⚡ Zone badge
        ▸ Sub-project 1 title
        ▸ Sub-project 2 title
        [tool]  [tool]  [tool]
```

Sub-project titles are flat text (not links). Tool tags are pulled from `subprojects[0].tools` when subprojects exist. Clicking the card navigates to `experience/experience.html?slug=<slug>`.

For single-STAR experiences (no `subprojects` array), the card shows the first two `bullets` instead of tool tags.

---

## 4. Detail Pages

### 4.1 Project Detail (`projects/project.html`)

```
← Back to Projects

[Hero image — first gallery image or thumb]
Zone badge  ·  Title

─ Situation ──────────────────────────────
[paragraph]

─ Task ───────────────────────────────────
[paragraph]

─ Action ─────────────────────────────────
• bullet
• bullet

─ Results ────────────────────────────────
• bullet
• bullet

─ Tags ───────────────────────────────────
[chip]  [chip]  [chip]

─ Gallery ────────────────────────────────
[image]  [image]  [image]

─ Links ──────────────────────────────────
[link ↗]
```

`script.js` — `renderProjectDetail()` reads `project.star` and renders each STAR field. If `star` is absent, falls back to rendering `project.description` in an Overview section (backwards compatible).

### 4.2 Experience Detail (`experience/experience.html`)

**With subprojects:**
```
← Back to Experience

[Logo]
Company  ·  Role  ·  Dates  ·  Location  ·  Zone badge

─ Sub-project 1 Title ────────────────────
  Tools: [chip] [chip] [chip]

  Situation / Task / Action / Results
  [gallery]

─ Sub-project 2 Title ────────────────────
  ...
```

Sub-projects render as `<details open>` elements on desktop, `<details>` (collapsed) on mobile via CSS `@media`.

**Without subprojects (single STAR):**
```
← Back to Experience

[Logo]
Company  ·  Role  ·  Dates  ·  Location

─ Situation / Task / Action / Results ────
[STAR sections]
```

`script.js` — `renderExperienceDetail()` checks for `experience.subprojects`; if present, renders the sub-project loop; otherwise renders the flat `experience.star` object.

---

## 5. Skills Section

`renderSkills()` in `script.js` updated to iterate the new flat structure (no nested `categories`). Each skill category renders as a card with a label and skill chips. Layout: CSS grid, 3 columns on desktop, 2 on tablet, 1 on mobile.

Zone-color filtering is removed from skills. The section is browse-only.

---

## 6. Resume Download

`ABOUT.resume` path used in two places:

1. **Header nav** — "CV ↓" link next to the nav items, opens the PDF in a new tab.
2. **Contact section** — "Download CV" button alongside email/LinkedIn/GitHub links.

Both rendered from `script.js` reading `ABOUT.resume`. If the field is absent, the elements are hidden.

---

## 7. Update Script (`update_site.py`)

**Dependency:** `python-docx` (`pip install python-docx`)

**Usage:**
```bash
python update_site.py
```

**What it does:**
1. Reads the `.docx` from the hardcoded path `C:/Users/reeth/OneDrive - University of Southern California/website/Reeth_Kawad_Master_Career_Doc_v2 (1).docx`
2. Extracts plain text, then parses:
   - `ABOUT.bio` — from "Short Bio (Portfolio About Page / LinkedIn Summary)" block
   - `SKILLS` — from "CORE SKILLS MATRIX" section (category name → items)
   - `star` fields per experience — from STAR blocks under each company heading
   - `bullets` per experience — from RESULT bullet points
   - `star` fields per project — from STAR blocks under INDEPENDENT PROJECTS
3. Loads current `data/site-data.js` as text
4. Replaces only the text-content fields (bio, star, bullets, skills items) using regex markers
5. **Preserves:** `gallery`, `thumb`, `zone`, `links`, `slug`, `logo`, `summary`, `tags`

**Detection of new entries:** If a company name or project title appears in the doc but has no matching slug in `site-data.js`, the script prints a warning:
```
⚠ New entry detected: "Acme Robotics" — add manually to site-data.js
```
It does not auto-create entries (avoids clobbering zone/thumb assignments which require manual input).

**Output:** Overwrites `data/site-data.js` in place. Prints a summary of what changed.

---

## 8. Asset Conventions

| Type | Path |
|------|------|
| Project thumbnail | `assets/projects/<slug>/thumb.jpg` |
| Project gallery images | `assets/projects/<slug>/img1.jpg`, `img2.jpg`, … |
| Experience gallery images | `assets/experience/<slug>/img1.jpg`, `img2.jpg`, … |
| Company logo | `assets/logos/<slug>.png` (or existing path in `logo` field) |
| Resume PDF | `assets/Reeth_Kawad_CV.pdf` |

---

## 9. Files Changed

| File | Change |
|------|--------|
| `data/site-data.js` | Full content rewrite — new STAR/subproject/gallery fields, 11-category skills, NIWE entry, FireWarden + CWC projects |
| `script.js` | Update `renderProjects`, `renderProjectDetail`, `renderExperience`, `renderExperienceDetail`, `renderSkills`; add resume link injection |
| `index.html` | Simplify project card template; add CV link to header and contact section |
| `projects/project.html` | Add `data-*` slots for STAR sections |
| `experience/experience.html` | Add `data-*` slots for subprojects and flat STAR |
| `projects/project-page.css` | Add STAR section styles, sub-project card styles, skills grid styles |
| `update_site.py` | New file — doc-to-site update script |
| `assets/experience/` | New folder — experience image assets |

---

## 10. Out of Scope

- Server-side rendering or build pipeline
- Automatic file-system gallery scanning (user maintains `gallery` arrays in `site-data.js`)
- CMS or admin UI
- Contact form
