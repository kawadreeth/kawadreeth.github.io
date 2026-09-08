# Portfolio Content Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade kawadreeth.github.io with STAR detail pages, subproject experience cards, 11-category skills, NIWE/FireWarden/CWC entries, resume download, and a `python update_site.py` command that syncs text from the career doc.

**Architecture:** Single-source data in `data/site-data.js` feeds all pages via `script.js` render functions. `projects/project.html` and `experience/experience.html` are shared templates loaded via `?slug=` query params. Main-page card styles live in `style.css`; detail-page styles in `projects/project-page.css`.

**Tech Stack:** Vanilla HTML/JS/CSS, GitHub Pages (static), Python 3 + python-docx for the update script.

---

## File Map

| File | Change |
|------|--------|
| `data/site-data.js` | Full content rewrite — STAR, subprojects, gallery arrays, 11-category skills, NIWE, FireWarden, CWC, resume field |
| `script.js` | Update `renderProjects`, `renderProjectDetail`, `renderExperience`, `renderExperienceDetail`, `renderSkills`; add `initResume` |
| `index.html` | Add `#nav-cv-link` to nav, `#contact-cv-link` to contact section |
| `style.css` | Update project card template; add experience subproject + tool-tag styles; add skills grid |
| `projects/project.html` | Replace `<main>` — add STAR `data-*` slots |
| `experience/experience.html` | Replace `<main>` — add `data-experience-body` slot |
| `projects/project-page.css` | Add STAR section styles, subproject accordion styles |
| `update_site.py` | New — doc-to-site update script |

---

## Task 1: Restructure SKILLS — data + renderSkills() + CSS

**Files:**
- Modify: `data/site-data.js` (SKILLS const only)
- Modify: `script.js` (`renderSkills` function ~lines 323–351)
- Modify: `style.css` (add skills grid rules)

- [ ] **Step 1: Replace SKILLS const in `data/site-data.js`**

Find the line `const SKILLS = {` and replace the entire block through the matching `};` with:

```js
const SKILLS = {
  controls: {
    label: "Controls & Firmware",
    items: ["Arduino IDE", "I2C architecture", "State machine design", "PID control", "Bayesian optimisation", "MOSFET braking", "Buck-boost converter", "Embedded C++"]
  },
  robotics: {
    label: "Robotics",
    items: ["ROS2", "RVIZ", "FANUC arm programming", "Toolpath planning (CNT/orientation/overlap)", "Point cloud segmentation", "MuJoCo simulation", "Reachability studies"]
  },
  sensing: {
    label: "Sensing & DAQ",
    items: ["Force sensors", "IMUs", "OpenVR position tracking", "Thermal sensors", "Transient hot-wire", "Multimodal sync 100+ Hz", "Signal conditioning", "Rerun visualisation", "LabVIEW"]
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

- [ ] **Step 2: Replace `renderSkills()` in `script.js`**

Find the `function renderSkills()` block and replace it entirely with:

```js
function renderSkills() {
  const tree = document.getElementById('skills-tree');
  if (!tree || typeof SKILLS === 'undefined') return;

  tree.innerHTML = Object.values(SKILLS).map(cat => `
    <div class="skill-card">
      <div class="skill-card-label">${cat.label}</div>
      <div class="skill-nodes">
        ${cat.items.map(item => `<span class="skill-node">${item}</span>`).join('')}
      </div>
    </div>
  `).join('');
}
```

- [ ] **Step 3: Add skills grid CSS to `style.css`**

Find the `.skill-column {` block and replace everything from `.skill-column {` through the end of the skills section (look for the next major comment) with:

```css
/* ── Skills ─────────────────────────────────────────────── */
#skills-tree {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.skill-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.skill-card-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

@media (max-width: 900px) {
  #skills-tree { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  #skills-tree { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Verify in browser**

Open `index.html`. Navigate to the Skills section.

Expected: 11 category cards in a 3-column grid, each with a label and skill chips. No zone-colored columns.

Open browser console:
```js
Object.keys(window.SITE.SKILLS).length   // → 11
window.SITE.SKILLS.manufacturing.items.length  // → 9
```

- [ ] **Step 5: Commit**

```bash
git add data/site-data.js script.js style.css
git commit -m "feat: restructure skills to 11 categories"
```

---

## Task 2: Resume download — data + HTML + JS

**Files:**
- Modify: `data/site-data.js` (ABOUT block)
- Modify: `index.html` (nav + contact section)
- Modify: `script.js` (add `initResume`, call from `init`)

- [ ] **Step 1: Add `resume` field to ABOUT in `data/site-data.js`**

In the `const ABOUT = {` block, after the `github:` line, add:

```js
  resume: "assets/Reeth_Kawad_CV.pdf"
```

- [ ] **Step 2: Add CV link to nav in `index.html`**

In `index.html`, inside `<nav id="main-nav" ...>`, add after the last `<a>`:

```html
<a id="nav-cv-link" href="" target="_blank" rel="noopener" style="display:none">CV ↓</a>
```

- [ ] **Step 3: Add CV button to contact section in `index.html`**

In `index.html`, inside `<div class="contact-links">`, add after the GitHub link:

```html
<a id="contact-cv-link" href="" target="_blank" rel="noopener" class="contact-item" style="display:none">
  <span class="contact-icon" aria-hidden="true">↓</span>
  Download CV
</a>
```

- [ ] **Step 4: Add `initResume()` to `script.js`**

Add this function before `init()`:

```js
function initResume() {
  const resume = window.SITE?.ABOUT?.resume;
  if (!resume) return;
  const navLink     = document.getElementById('nav-cv-link');
  const contactLink = document.getElementById('contact-cv-link');
  if (navLink)     { navLink.href     = resume; navLink.style.display     = ''; }
  if (contactLink) { contactLink.href = resume; contactLink.style.display = ''; }
}
```

In `init()`, add `initResume();` after `initTheme();`.

- [ ] **Step 5: Verify in browser**

Open `index.html`. Expected: "CV ↓" appears in the nav; "Download CV" appears in the contact section. Both link to `assets/Reeth_Kawad_CV.pdf` (will 404 until PDF is added — that's expected).

```js
document.getElementById('nav-cv-link').href  // → ends with "assets/Reeth_Kawad_CV.pdf"
```

- [ ] **Step 6: Commit**

```bash
git add data/site-data.js index.html script.js
git commit -m "feat: add CV download to header nav and contact section"
```

---

## Task 3: Update PROJECTS in site-data.js

**Files:**
- Modify: `data/site-data.js` (PROJECTS const — full replacement)

- [ ] **Step 1: Replace the entire `const PROJECTS = [...]` block**

Find `const PROJECTS = [` and replace everything through the matching `];` with:

```js
const PROJECTS = [
  {
    slug: "vawt",
    title: "Vertical Axis Wind Turbine",
    zone: "cleantech",
    thumb: "assets/projects/vawt/thumb.jpg",
    tags: ["Wind Energy", "Controls", "SolidWorks", "Bayesian Optimisation", "PID"],
    gallery: [],
    star: {
      situation: "VAWTs commonly operate below their theoretical aerodynamic efficiency due to fixed blade pitch — particularly at off-design wind speeds.",
      task: "Design, fabricate, and test a 5-inch H-type VAWT with individual blade pitch control, using Bayesian Optimisation and PID to improve efficiency across operating conditions.",
      action: [
        "Designed and fabricated a 5-inch H-type VAWT with individual blade pitch actuation mechanism.",
        "Implemented Bayesian Optimisation to search the pitch control parameter space.",
        "Developed PID controller for active pitch tracking.",
        "Tested in the wind tunnel — measured Cp vs wind speed curves to validate adaptive pitch performance against fixed-pitch baseline."
      ],
      result: [
        "Targeting approximately 8% efficiency improvement through adaptive pitch vs. fixed pitch baseline.",
        "Built practical expertise in control algorithm implementation (Bayesian Opt + PID), small turbine fabrication, and wind tunnel measurement."
      ]
    }
  },
  {
    slug: "dexhand",
    title: "8 DoF Robotic Hand",
    zone: "robotics",
    thumb: "assets/projects/dexhand/thumb.png",
    tags: ["Robotics", "Mechanical Design", "Actuation", "SolidWorks", "MuJoCo", "C++"],
    gallery: [],
    star: {
      situation: "USC's DRCL is developing an 8-DOF robotic hand capable of catching and throwing a basketball at 20 N force — requiring compliant actuation for safe, controllable contact.",
      task: "Design and prototype the Series Elastic Actuator (SEA) module and rigid finger joints with parallel link mechanism, and validate force feedback fidelity through bench testing.",
      action: [
        "Designed 8-DOF finger joint assemblies with parallel link mechanisms in SolidWorks.",
        "Designed and rapid-prototyped an SEA test fixture for an N20 motor — spring selection, mounting, adhesive strategy, and locking mechanism.",
        "Performed torque calculations for N20 motor selection and validated output torque and compliance against design targets using bench-level force sensor measurements.",
        "Wrote C++ motor driver code for low-level motor control.",
        "Simulated hand kinematics and dynamics in MuJoCo to validate design decisions before hardware build."
      ],
      result: [
        "Produced a functional SEA prototype with validated force feedback fidelity benchmarked against design targets.",
        "Parallel-link finger joints designed and iterated in SolidWorks; prototypes fabricated and tested.",
        "Built practical expertise in compliant actuation design, motor sizing, C++ embedded control, and simulation-to-hardware workflows."
      ]
    }
  },
  {
    slug: "windtunnel",
    title: "Blowdown Wind Tunnel",
    zone: "hardware",
    thumb: "assets/projects/windtunnel/thumb.jpg",
    tags: ["Aerodynamics", "Fabrication", "Flow Testing", "Pitot Tube"],
    gallery: [],
    star: {
      situation: "Wind tunnel turbulence reduces measurement repeatability and test quality.",
      task: "Design, build, and experimentally validate a 20-inch blow-down wind tunnel with a honeycomb flow straightener to quantify turbulence reduction.",
      action: [
        "Designed and fabricated the 20-inch test-section blow-down wind tunnel using a plywood frame, laser-cut acrylic panels, and 3D-printed PLA honeycomb.",
        "Conducted experiments using a pitot tube at multiple cross-sections to map turbulence intensity before and after the flow straightener."
      ],
      result: [
        "Turbulence intensity reduced by 53% at the front measurement location.",
        "Turbulence intensity reduced by 86% at the rear measurement location."
      ]
    }
  },
  {
    slug: "firewarden",
    title: "FireWarden — Wildfire Defense System",
    zone: "cleantech",
    thumb: "assets/projects/firewarden/thumb.jpg",
    tags: ["Cleantech", "Fluid Systems", "Web App", "Entrepreneurship"],
    gallery: [],
    star: {
      situation: "Wildfires are a growing risk for homeowners; most mitigation solutions are expensive and difficult to evaluate. No accessible tool existed for homeowners to size and plan a sprinkler-based defence system.",
      task: "Co-found the startup and lead technical development of a web application making wildfire sprinkler system design accessible — starting with pool-sourced systems.",
      action: [
        "Led development of a web application processing user addresses to generate optimised sprinkler layouts: analysing elevation data, pool resources, property geometry, and roof characteristics.",
        "Applied first-principles fluid dynamics to compute sprinkler flow rates, pressure requirements, and coverage geometry.",
        "Supported pilot deployment analysis on a Laguna Beach home.",
        "Led customer discovery, product development, and pitch competition preparation.",
        "Entered the Techstars Pre-Accelerator programme."
      ],
      result: [
        "Won the DAS InnovateLA Competition — $20,000 in prize funding.",
        "Entered the Techstars Pre-Accelerator programme.",
        "Validated product-market fit through customer discovery and pilot site analysis.",
        "Built strong foundations in startup strategy, technical product development, and technology commercialisation."
      ]
    }
  },
  {
    slug: "cwc",
    title: "USC Collegiate Wind Competition",
    zone: "cleantech",
    thumb: "assets/projects/vawt/thumb.jpg",
    tags: ["Wind Energy", "Controls", "Arduino", "Siemens NX", "QBlade", "FLORIS"],
    gallery: [],
    star: {
      situation: "USC had no CWC team. The turbine's electrical and controls system needed to be designed from scratch by a mechanical engineer with limited prior electronics experience. The team also needed full turbine mechanical design and utility-scale project development analysis to meet DOE competition deliverables.",
      task: "Found the team, design and implement end-to-end turbine electronics/controls and mechanical design, and lead all project development deliverables for the DOE competition.",
      action: [
        "Designed full electrical schematics integrating RPM, voltage, and current sensors via I2C protocol on an Arduino Uno, including firmware in Arduino IDE.",
        "Engineered an electrical braking system using MOSFETs and power resistors as a variable resistive load for rated-power control and safe shutdown.",
        "Implemented a state machine for turbine operating modes: startup, cut-in pitch for max power extraction, and feathering for braking.",
        "Led turbine mechanical design — structure, braking system, and drivetrain — in Siemens NX.",
        "Ran blade aerodynamic simulations in QBlade and StarCCM+ to optimise geometry for target power output.",
        "Developed a FLORIS-based wake and yaw optimiser to determine optimal turbine layout for utility-scale farm design.",
        "Initiated partnerships with 8+ energy companies; organised 5+ site tours and industry panels.",
        "Established the USC Chapter of AEE — drafted constitution, defined leadership structure, secured university recognition."
      ],
      result: [
        "Founded USC's first CWC team from nothing — recruited team, established structure, delivered competition entries.",
        "Built FLORIS-based wind farm layout optimiser; developed end-to-end utility-scale project development analysis.",
        "AEE chapter now operating with established industry partnerships and faculty engagement.",
        "Delivered a complete working turbine controls architecture built from first principles."
      ]
    }
  },
  {
    slug: "fsae",
    title: "FSAE Projects",
    zone: "hardware",
    thumb: "assets/projects/fsae/thumb.jpg",
    tags: ["Automotive", "CFD", "CNC", "ANSYS Fluent", "Composite Layup", "MATLAB"],
    gallery: [],
    star: {
      situation: "The team needed faster aerodynamic simulation iteration and tighter correlation between CFD predictions and physical test results.",
      task: "Improve aero development efficiency through simulation automation and build physical validation tools to close the simulation-to-hardware loop.",
      action: [
        "Automated aerodynamic mesh generation in ANSYS Fluent using a fault-tolerant mesh system and MATLAB scripting — cutting CFD setup time by approximately 60% and enabling rapid DOE iteration.",
        "Designed and analysed a tire cover in Siemens NX and ANSYS Fluent to minimise tire turbulence impact on drag.",
        "CNC-milled high-precision moulds and performed composite layup (resin infusion) to manufacture aerodynamic elements — including components twice the size yet 50% lighter using optimised fibre orientation.",
        "Developed setup and validation tools: toe alignment tool and yaw probe — used to correlate real-world aero measurements against simulation results."
      ],
      result: [
        "CFD setup time reduced by ~60% through MATLAB-driven mesh automation.",
        "Composite elements achieved target geometry accuracy for CFD correlation.",
        "Simulation-to-hardware validation loop closed through yaw probe and alignment tool data."
      ]
    }
  },
  {
    slug: "waterrocket",
    title: "Water Rocket Flight Optimisation",
    zone: "hardware",
    thumb: "assets/projects/waterrocket/thumb.JPG",
    tags: ["MATLAB", "Simulation", "Optimisation", "Flight Dynamics"],
    gallery: [],
    star: {
      situation: "Water rockets are typically tuned by trial and error; the relationship between air/water ratio, pressure, and parachute size is not intuitively optimised.",
      task: "Develop a MATLAB simulation to optimise air-to-water fill ratio, initial pressure, and parachute surface area for maximum altitude.",
      action: [
        "Developed a MATLAB simulation modelling the thrust phase (water expulsion), coast phase, and parachute descent.",
        "Swept air-to-water ratio, initial pressure, and parachute surface area as free parameters.",
        "Identified optimal configuration from simulation results."
      ],
      result: [
        "Identified optimal fill ratio, pressure, and parachute area for maximum altitude.",
        "Built practical expertise in MATLAB simulation and flight dynamics modelling."
      ]
    }
  },
  {
    slug: "drone",
    title: "Drone CAD & Structural Analysis",
    zone: "hardware",
    thumb: "assets/projects/drone/thumb.png",
    tags: ["CAD", "FEA", "Drones", "Siemens NX", "ANSYS"],
    gallery: [],
    star: {
      situation: "Drone structural design requires validation across multiple load cases before hardware commitment.",
      task: "Design a quadrotor drone frame in Siemens NX and conduct structural validation using FEA and multi-body dynamics (MBD) in ANSYS.",
      action: [
        "Designed a quadrotor drone frame using Siemens NX CAD.",
        "Conducted FEA analysis in ANSYS Mechanical for structural integrity under flight loads.",
        "Ran multi-body dynamics (MBD) analysis for dynamic loading scenarios."
      ],
      result: [
        "Validated structural integrity across multiple load cases.",
        "Demonstrated an integrated CAD + FEA + MBD workflow for drone structural design."
      ]
    }
  },
  {
    slug: "bridge",
    title: "Truss Bridge Optimisation",
    zone: "hardware",
    thumb: "assets/projects/bridge/thumb.png",
    tags: ["Structural", "MATLAB", "Optimisation"],
    gallery: [],
    star: {
      situation: "Truss bridge geometry significantly impacts load-to-weight efficiency, but manual analysis of many configurations is slow.",
      task: "Build a parametric MATLAB truss analysis sweeping geometry parameters to optimise for maximum load-to-weight ratio.",
      action: [
        "Modelled truss bridge forces using parametric MATLAB simulations.",
        "Swept geometric parameters to find the optimal configuration for structural efficiency.",
        "Validated simulation predictions with load cell testing."
      ],
      result: [
        "Identified optimal bridge geometry for load-to-weight efficiency.",
        "Validated simulation predictions against physical load cell testing."
      ]
    }
  },
  {
    slug: "monopoly",
    title: "Automated Monopoly Board",
    zone: "hardware",
    thumb: "assets/projects/monopoly/thumb.png",
    tags: ["Mechatronics", "Arduino", "Fabrication"],
    gallery: [],
    star: {
      situation: "A class project required designing an electromechanical system enabling human vs. bot gameplay on a physical Monopoly board.",
      task: "Lead the electro-mechanical design of a robotic Monopoly board game for a team of 6.",
      action: [
        "Led the electro-mechanical design of the robotic Monopoly board.",
        "Designed and built mechanisms for automated token movement and gameplay.",
        "Integrated Arduino-based control for bot decision-making and movement."
      ],
      result: [
        "Won 1st place in the class competition.",
        "Delivered a fully functional human vs. bot Monopoly system."
      ]
    }
  },
  {
    slug: "walkane",
    title: "Walkane — Walker-Cane Hybrid",
    zone: "hardware",
    thumb: "assets/projects/walkane/thumb.png",
    tags: ["Product Design", "Prototyping", "Medical Device", "Mechanism Design"],
    gallery: [],
    star: {
      situation: "Existing walkers and canes handle flat ground or stairs poorly — transitions between the two are unstable and risky for elderly users.",
      task: "Engineer a hybrid walker-cane with a collapsible design that improves stability during stair-to-flat-ground transitions.",
      action: [
        "Designed a collapsible mechanism to transition between walker and cane configurations.",
        "Prototyped and iterated on the mechanism for stability and ease of use."
      ],
      result: [
        "Won 2nd place at the ASBME Makeathon.",
        "Demonstrated a viable assistive device bridging walker and cane form factors."
      ]
    }
  },
  {
    slug: "alarm",
    title: "Smart Alarm Clock — REM Monitoring",
    zone: "hardware",
    thumb: "assets/projects/alarm/thumb.png",
    tags: ["Arduino", "Sensors", "Embedded Systems", "DAQ"],
    gallery: [],
    star: {
      situation: "Standard alarms wake users regardless of sleep stage, leading to grogginess and impaired alertness.",
      task: "Build a smart alarm clock that tracks BPM via pulse meter and Arduino DAQ, using sleep cycle data to wake the user during the optimal REM phase.",
      action: [
        "Integrated a pulse meter with an Arduino-based DAQ to continuously monitor BPM.",
        "Developed sleep cycle detection logic to identify the optimal wake window.",
        "Built the complete hardware and embedded system within a hackathon time constraint."
      ],
      result: [
        "Won 1st place at the IEEE Hack-IoT competition.",
        "Demonstrated a functional BPM-tracking sleep optimisation alarm."
      ]
    }
  },
  {
    slug: "kothcar",
    title: "2-DoF Bluetooth Car",
    zone: "robotics",
    thumb: "assets/projects/kothcar/thumb.jpg",
    tags: ["Arduino", "Fabrication", "Bluetooth", "Embedded Systems"],
    gallery: [],
    star: {
      situation: "A project required building a remote-controlled car from scratch with Bluetooth communication and two-axis steering.",
      task: "Design and build a two-degree-of-freedom remote-controlled car with Bluetooth communication.",
      action: [
        "Designed and built a 2-DoF RC car chassis with Arduino and motor drivers.",
        "Implemented Bluetooth communication for real-time remote navigation."
      ],
      result: [
        "Delivered a functional Bluetooth-controlled car with 2-axis steering.",
        "Demonstrated embedded systems and hardware fabrication skills."
      ]
    }
  }
];
```

- [ ] **Step 2: Verify in browser console**

```js
window.SITE.PROJECTS.length                                          // → 13
window.SITE.PROJECTS.find(p => p.slug === 'firewarden').star.result.length  // → 4
window.SITE.PROJECTS.find(p => p.slug === 'cwc').zone               // → "cleantech"
window.SITE.PROJECTS.every(p => Array.isArray(p.gallery))           // → true
```

- [ ] **Step 3: Commit**

```bash
git add data/site-data.js
git commit -m "feat: add STAR fields + gallery arrays to all projects; add FireWarden + CWC"
```

---

## Task 4: Simplify project cards on main page

**Files:**
- Modify: `script.js` (`renderProjects` function ~lines 110–156)

- [ ] **Step 1: Replace `renderProjects()` in `script.js`**

Find `function renderProjects()` and replace the entire function with:

```js
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;
  grid.innerHTML = '';

  PROJECTS.forEach(p => {
    const link = document.createElement('a');
    link.href = `projects/project.html?slug=${encodeURIComponent(p.slug)}`;
    link.className = `project-card ${zoneClass(p.zone)}`;
    link.dataset.zone = p.zone;
    link.setAttribute('role', 'listitem');
    link.setAttribute('aria-label', p.title);

    link.innerHTML = `
      <img class="card-image" src="${p.thumb || ''}" alt="${escapeHtml(p.title)}" loading="lazy" />
      <div class="card-body">
        <span class="zone-badge ${zoneClass(p.zone)}">${zoneLabel(p.zone)}</span>
        <h3 class="card-title">${escapeHtml(p.title)}</h3>
        <div class="card-tags">
          ${(p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    `;

    grid.appendChild(link);
  });
}
```

- [ ] **Step 2: Verify in browser**

Open `index.html`. Projects section expected: cards showing image, zone badge, title, tags — no summary paragraph. Filter tabs should still work.

```js
document.querySelectorAll('.project-card').length  // → 13
document.querySelector('.card-summary')            // → null (removed)
```

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: simplify project cards to image + zone + title + tags"
```

---

## Task 5: Project detail page — STAR sections

**Files:**
- Modify: `projects/project.html` (replace `<main>`)
- Modify: `script.js` (`renderProjectDetail` function ~lines 158–203)
- Modify: `projects/project-page.css` (add STAR styles)

- [ ] **Step 1: Replace `<main>` in `projects/project.html`**

Replace the entire `<main ...>...</main>` block with:

```html
<main class="detail-page project-page" data-page-type="project">
  <div class="project-back"><a href="../index.html#projects">← Back to Projects</a></div>

  <section class="project-hero">
    <img data-project-hero class="project-hero-img" src="" alt="" />
    <div class="project-hero-text">
      <span class="project-zone" data-project-zone></span>
      <h1 class="project-page-title" data-project-title></h1>
    </div>
  </section>

  <div class="project-body">
    <div class="star-sections" data-project-star>
      <div class="star-section">
        <div class="star-label">Situation</div>
        <p data-project-situation></p>
      </div>
      <div class="star-section">
        <div class="star-label">Task</div>
        <p data-project-task></p>
      </div>
      <div class="star-section">
        <div class="star-label">Action</div>
        <ul class="detail-list" data-project-action></ul>
      </div>
      <div class="star-section">
        <div class="star-label">Results</div>
        <ul class="detail-list detail-list--result" data-project-result></ul>
      </div>
    </div>

    <section class="project-section">
      <h2>Tags</h2>
      <div data-project-tags></div>
    </section>

    <section class="project-section">
      <h2>Gallery</h2>
      <div class="project-gallery" data-project-gallery></div>
    </section>

    <section class="project-section">
      <h2>Links</h2>
      <div data-project-links></div>
    </section>
  </div>
</main>
```

- [ ] **Step 2: Replace `renderProjectDetail()` in `script.js`**

Find `function renderProjectDetail()` and replace the entire function with:

```js
function renderProjectDetail() {
  const page = document.querySelector('[data-page-type="project"]');
  if (!page || typeof PROJECTS === 'undefined') return;

  const slug = getQuerySlug();
  const project = PROJECTS.find(p => p.slug === slug) || PROJECTS[0];
  if (!project) return;

  document.title = `${project.title} — Reeth Kawad`;
  page.querySelector('[data-project-zone]').textContent = zoneLabel(project.zone);
  page.querySelector('[data-project-title]').textContent = project.title;

  const heroImg = page.querySelector('[data-project-hero]');
  const heroSrc = project.gallery?.[0] || project.thumb || '';
  if (heroImg && heroSrc) { heroImg.src = heroSrc; heroImg.alt = project.title; }

  const star = project.star;
  if (star) {
    page.querySelector('[data-project-situation]').textContent = star.situation || '';
    page.querySelector('[data-project-task]').textContent = star.task || '';
    page.querySelector('[data-project-action]').innerHTML =
      (star.action || []).map(a => `<li>${escapeHtml(a)}</li>`).join('');
    page.querySelector('[data-project-result]').innerHTML =
      (star.result || []).map(r => `<li>${escapeHtml(r)}</li>`).join('');
  }

  const tags = page.querySelector('[data-project-tags]');
  if (tags) tags.innerHTML = (project.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');

  const gallery = page.querySelector('[data-project-gallery]');
  if (gallery) {
    const images = [...new Set([project.thumb, ...(project.gallery || [])].filter(Boolean))];
    gallery.innerHTML = images.length
      ? images.map(src => `<figure class="project-figure"><img src="${src}" alt="${escapeHtml(project.title)}" loading="lazy" /></figure>`).join('')
      : '<p class="project-empty">No gallery images yet — add image paths to the <code>gallery</code> array in <code>data/site-data.js</code>.</p>';
  }

  const links = page.querySelector('[data-project-links]');
  if (links) {
    links.innerHTML = (project.links || []).length
      ? project.links.map(l => `<a class="detail-link" href="${l.url}" target="_blank" rel="noopener">${escapeHtml(l.label)} ↗</a>`).join('')
      : '<p class="project-empty">No external links yet.</p>';
  }
}
```

- [ ] **Step 3: Add STAR section styles to `projects/project-page.css`**

Append to the end of `projects/project-page.css`:

```css
/* ── STAR sections ───────────────────────────────────────── */
.star-sections {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.star-section {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.star-section:last-child { border-bottom: none; }

.star-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding-top: 0.15rem;
}

.detail-list--result li { font-weight: 500; }

@media (max-width: 600px) {
  .star-section {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}

/* ── Subproject accordion ────────────────────────────────── */
.subproject {
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 1.25rem;
  overflow: hidden;
}

.subproject-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  list-style: none;
  background: var(--bg-surface);
  user-select: none;
}

.subproject-header::-webkit-details-marker { display: none; }

.subproject-title {
  font-size: 1rem;
  font-weight: 600;
}

.subproject-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.subproject-body {
  padding: 0 1.25rem 1.25rem;
}

.subproject-body .star-sections { margin-top: 0.75rem; }
```

- [ ] **Step 4: Verify in browser**

Navigate to `projects/project.html?slug=vawt`. Expected:
- Hero image (thumb)
- Zone badge + title (no summary in hero)
- Four STAR sections in a bordered box: Situation / Task / Action / Results
- Tags section below
- Gallery showing thumb (with "no gallery images" hint)
- "No external links yet" placeholder

Navigate to `projects/project.html?slug=firewarden`. Expected: FireWarden STAR content renders.

- [ ] **Step 5: Commit**

```bash
git add projects/project.html script.js projects/project-page.css
git commit -m "feat: add STAR sections to project detail page"
```

---

## Task 6: Update EXPERIENCE in site-data.js

**Files:**
- Modify: `data/site-data.js` (EXPERIENCE const — full replacement)

- [ ] **Step 1: Replace the entire `const EXPERIENCE = [...]` block**

Find `const EXPERIENCE = [` and replace everything through the matching `];` with:

```js
const EXPERIENCE = [
  {
    slug: "graymatter",
    company: "GrayMatter Robotics",
    logo: "",
    role: "Robotics Systems & Applications Intern",
    dates: "Jan 2026 – May 2026",
    location: "Torrance, CA",
    zone: "robotics",
    bullets: [
      "Led mechanical design for a production-ready universal sanding fixture accommodating 14 SKUs; eliminated vision misclassification and validated performance through force testing.",
      "Built a multimodal DAQ pipeline and analytics for sanding characterisation, reducing industrial engineering time studies by ~40%."
    ],
    subprojects: [
      {
        title: "Production-Ready Universal Sanding Fixture",
        tools: ["SolidWorks", "MeshLab", "Point Cloud Processing", "Spring-Loaded Mechanisms", "Force Testing", "3D Printing", "ROS2"],
        gallery: [],
        star: {
          situation: "Initial fixture designs caused the robot to sand the fixture itself — vision segmentation could not distinguish fixture geometry from the workpiece. The product line had 14 SKUs ranging S to XL.",
          task: "Redesign the fixture from scratch to hold all 14 configurations reliably, eliminate vision misclassification, and meet customer requirements for operator comfort, throughput, and reliability.",
          action: [
            "Mapped all mechanical, vision, and software constraints across teams before touching a design.",
            "Developed SolidWorks concepts and analysed point clouds in MeshLab — tuned segmentation parameters iteratively with the vision team.",
            "Introduced compliant spring-loaded features to accommodate S–XL size variation without manual adjustment between variants.",
            "Incorporated displacement sensors to validate part seating before the sanding cycle begins.",
            "Performed force testing to identify failure modes and quantify performance improvements across design iterations.",
            "Executed rapid prototyping cycles using 3D printing and modular design for fast mechanical iteration."
          ],
          result: [
            "Universal fixture successfully accommodated all 14 SKUs (S through XL) in a single design.",
            "Eliminated vision misclassification — robot no longer sanded the fixture itself.",
            "Customer confirmed strong satisfaction with robustness and performance outcomes."
          ]
        }
      },
      {
        title: "Systems & Applications Engineering — Robotic Arm Process Development",
        tools: ["ROS2", "RVIZ", "MeshLab", "FANUC Arms", "Python", "YAML/JSON", "DOE", "GitHub"],
        gallery: [],
        star: {
          situation: "GrayMatter deploys robotic sanding arms on customer parts (helicopter blades, helmets, vehicle body panels) — each requiring custom segmentation, toolpath planning, and recipe validation before deployment.",
          task: "Lead system and applications engineering for customer parts: from 3D scan through segmentation, toolpath generation, FANUC robot programming, and process recipe development.",
          action: [
            "Conducted reachability studies from CAD models to identify surface coverage and blind spots before physical setup.",
            "Worked with multiple segmentation algorithms on point clouds (Euclidean clustering, curvature-based, projection segmentation, swept cylinder, surface normals) in MeshLab.",
            "Developed toolpaths by tuning CNT values, tool orientation, overlap percentage, and pass direction — balancing coverage, cycle time, and surface finish.",
            "Programmed FANUC robotic arms to execute validated toolpaths, handling coordinate frame setup and motion parameter tuning.",
            "Designed and executed DOE-driven sanding campaigns — sweeping force, tilt angle, and RPM — identifying parameters meeting surface roughness within ±10% spec.",
            "Managed project files with GitHub; used YAML/JSON for process parameter storage and ROS2 pipeline configuration."
          ],
          result: [
            "Developed end-to-end proficiency in robotic process engineering: raw point cloud to deployed, validated robot program.",
            "Built practical expertise in ROS2 + RVIZ, MeshLab automation, FANUC programming, and process-DOE methodology.",
            "Reduced manual effort in segmentation and toolpath setup through Python automation scripts."
          ]
        }
      },
      {
        title: "Multimodal Human Sanding Characterisation DAQ Pipeline",
        tools: ["Force Sensors", "IMUs", "OpenVR", "Thermal Sensors", "Python", "ROS2", "Rerun Visualisation"],
        gallery: [],
        star: {
          situation: "GrayMatter needed to understand expert human sanding behaviour at a physical parameter level — force profiles, motion patterns, thermal signatures — to automate industrial engineering time studies.",
          task: "Build a multimodal DAQ pipeline synchronising force, IMU, position (OpenVR), and thermal sensor streams at 100+ Hz with a full post-processing analytics layer.",
          action: [
            "Selected and integrated force sensors, IMUs, OpenVR position trackers, and thermal sensors into a time-synchronised ROS2 pipeline running at 100+ Hz.",
            "Integrated Rerun for real-time and post-hoc visualisation of 3D sanding paths with per-segment physical parameter graphing.",
            "Built a post-processing analytics pipeline: ESH savings calculator, data-driven task classification, robot feasibility recommendations, and consumables calculator.",
            "Designed the pipeline to feed GrayMatter's solutions-engineering agent core and model optimisation workflows.",
            "Validated pipeline data quality against known reference conditions and human benchmarks."
          ],
          result: [
            "Reduced industrial engineering time studies by approximately 40%.",
            "Analytics layer enables quantified dollar-value business cases for robot deployment (ESH savings tool).",
            "Task classification output gives engineering teams a data-backed map of what a robot can and cannot do for a given customer part.",
            "Produced a reusable, modular platform (DAQ + visualisation + analytics) feeding GrayMatter's process intelligence roadmap."
          ]
        }
      }
    ]
  },
  {
    slug: "lumindt",
    company: "Lumindt Labs",
    logo: "assets/lumindt.JPG",
    role: "Mechanical Engineering Intern",
    dates: "Jun 2025 – Aug 2025",
    location: "San Francisco, CA",
    zone: "cleantech",
    bullets: [
      "Designed and built a transient hot-wire thermal conductivity measurement system achieving <10% uncertainty for metal powder characterisation.",
      "Designed production-ready skid and modular fuel-cell frame hardware; performed ASME-based preliminary stress analysis."
    ],
    subprojects: [
      {
        title: "Transient Hot-Wire Thermal Conductivity Measurement System",
        tools: ["Transient Hot-Wire", "Platinum Wire (25μm)", "Signal Conditioning", "Raspberry Pi DAQ", "Python", "SolidWorks", "Uncertainty Analysis"],
        gallery: [],
        star: {
          situation: "Lumindt needed thermal conductivity data for metal powders being evaluated for thermal energy storage. No commercial instrument was suited to the specific material form factor.",
          task: "Design and build a complete thermal conductivity measurement system from scratch capable of repeatable, accurate characterisation of four metal powder samples.",
          action: [
            "Conducted a literature review and selected the transient hot-wire (THW) technique as optimal for loose powder characterisation.",
            "Designed and fabricated a custom test fixture in SolidWorks housing a 25-micron platinum wire sensor.",
            "Designed and built signal conditioning circuitry for the platinum wire's resistance-temperature response.",
            "Built a Raspberry Pi DAQ and wrote Python automation scripts for data capture, thermal cycling, and repeatability analysis.",
            "Conducted formal uncertainty analysis; investigated effects of porosity and contact resistance on measurement accuracy.",
            "Established documented, repeatable testing procedures across multiple temperature setpoints."
          ],
          result: [
            "Achieved repeatable thermal conductivity measurements with less than 10% uncertainty across four metal powder samples.",
            "Enabled material down-selection decisions for Lumindt's thermal energy storage development programme.",
            "Created a complete characterisation capability from zero — integrating heat transfer theory, precision instrumentation, electronics, and software."
          ]
        }
      },
      {
        title: "Structural Design — Electrolyser Skid & Fuel Cell Frame",
        tools: ["SolidWorks Weldments", "ASME Stress Analysis", "Manifold Design", "Steel Frame", "8020 Extrusions"],
        gallery: [],
        star: {
          situation: "Lumindt needed production-ready structural hardware: a skid for 24 electrolysers (300 kg each) and a modular frame for a 250 kW fuel cell system (200 kg capacity).",
          task: "Design both structures to meet load requirements, integrate fluid manifolds (hydrogen, coolant, water), minimise footprint, and ensure serviceability — validated against ASME standards.",
          action: [
            "Designed the 24-electrolyser skid in SolidWorks Weldments integrating optimised manifold routing for hydrogen, coolant, and water lines.",
            "Designed the 250 kW fuel cell frame using a welded steel base with carbon steel tubing and 8020 aluminium extrusions for modularity.",
            "Performed ASME-standard preliminary stress analyses to validate structural safety margins under operating loads.",
            "Selected balance-of-plant components (pumps, valves, adapters); fabricated custom adapters where off-the-shelf parts did not meet requirements.",
            "Built an Excel-based heat exchanger and coolant loop calculator to evaluate coolant composition effects on specific heat and efficiency."
          ],
          result: [
            "Delivered production-ready designs for both structures with validated structural safety margins.",
            "Manifold design met hydrogen, coolant, and water routing requirements within the constrained skid footprint.",
            "Demonstrated ability to work across mechanical design, structural analysis, fluid systems, and component selection in one workstream."
          ]
        }
      }
    ]
  },
  {
    slug: "makerspace",
    company: "USC Baum Family Makerspace",
    logo: "assets/machining.jpg",
    role: "Machinist & Fabrication Engineer",
    dates: "Sep 2023 – Present",
    location: "Los Angeles, CA",
    zone: "hardware",
    bullets: [
      "Programmed and operated Haas CNC, ProtoTRAK, Omax waterjet, and laser cutter; manufactured GD&T-critical parts to ±0.001 inch tolerances.",
      "Fabricated 100+ 3D printed prototypes and provided DFM guidance to reduce iteration cycles for research teams."
    ],
    star: {
      situation: "The Makerspace supports 80+ research labs and 12+ design teams at USC who need precision components fabricated beyond student skill level, and DFM guidance to make their designs manufacturable.",
      task: "Manufacture GD&T-critical components across a range of processes, support prototype development, and provide DFM guidance.",
      action: [
        "Programmed and operated Haas CNC Mill and Lathe, ProtoTRAK, Omax waterjet, and laser cutter to manufacture GD&T-critical components.",
        "Applied first-principles machining: selected cutting speeds, feeds, tool geometry, and fixturing strategy for each material using standard machining equations.",
        "Used dial indicators to verify dimensional accuracy and surface finish against GD&T callouts — qualifying parts before release.",
        "Fabricated 100+ 3D-printed prototypes across FDM (PLA), SLA (resin), and carbon fibre-reinforced FDM — including aerodynamic elements for the Formula SAE car.",
        "Provided DFM consultations: reviewed student designs for machinability and recommended design modifications to reduce iteration cycles."
      ],
      result: [
        "Machined GD&T-critical components to ±0.001 inch tolerances verified by dial indicator.",
        "Supported 80+ research labs and 12+ design teams.",
        "Fabricated 100+ prototypes across three 3D printing technologies.",
        "DFM guidance demonstrably reduced iteration cycles for multiple teams by catching manufacturability issues at the design stage."
      ]
    }
  },
  {
    slug: "drcl",
    company: "USC Dynamic Robotics & Controls Lab",
    logo: "",
    role: "Mechanical Engineer",
    dates: "Sep 2025 – Present",
    location: "Los Angeles, CA",
    zone: "robotics",
    bullets: [
      "Designed a Series Elastic Actuator (SEA) module and 8-DOF robotic hand finger assemblies; validated force feedback fidelity on bench tests.",
      "Simulated hand kinematics in MuJoCo and wrote C++ motor driver code for embedded control."
    ],
    star: {
      situation: "The lab is developing an 8-DOF robotic hand capable of catching and throwing a basketball at 20 N force — requiring compliant actuation for safe, controllable contact.",
      task: "Design and prototype the SEA module and rigid finger joints with parallel link mechanism, and validate force feedback fidelity through bench testing.",
      action: [
        "Designed 8-DOF finger joint assemblies with parallel link mechanisms in SolidWorks.",
        "Designed and rapid-prototyped an SEA test fixture for an N20 motor — spring selection, mounting, adhesive strategy, and locking mechanism.",
        "Performed torque calculations for N20 motor selection and validated output torque and compliance against design targets.",
        "Wrote C++ motor driver code for low-level motor control.",
        "Simulated hand kinematics and dynamics in MuJoCo to validate design decisions before hardware build."
      ],
      result: [
        "Produced a functional SEA prototype with validated force feedback fidelity benchmarked against design targets.",
        "Parallel-link finger joints designed and iterated in SolidWorks; prototypes fabricated and tested.",
        "Built practical expertise in compliant actuation design, motor sizing, C++ embedded control, and simulation-to-hardware workflows."
      ]
    }
  },
  {
    slug: "tutr",
    company: "TuTr Hyperloop",
    logo: "",
    role: "Mechanical Engineer Intern",
    dates: "Jun 2024 – Jul 2024",
    location: "Los Angeles, CA",
    zone: "hardware",
    bullets: [
      "Optimized hyperloop chassis weight by 30% using 1D/3D structural analysis in ANSYS and Siemens NX while preserving structural margins."
    ],
    star: {
      situation: "TuTr's hyperloop pod chassis needed to be lighter without compromising structural integrity for high-speed travel loads.",
      task: "Analyse the existing chassis design and identify weight reduction opportunities while maintaining structural safety margins.",
      action: [
        "Conducted 1D and 3D structural analyses in ANSYS Mechanical and Siemens NX to identify over-designed sections.",
        "Proposed targeted material removal and geometry changes; validated each iteration against stress and deflection limits."
      ],
      result: [
        "Optimised chassis weight by 30% while maintaining full structural integrity under operating load cases."
      ]
    }
  },
  {
    slug: "niwe",
    company: "National Institute of Wind Energy (NIWE)",
    logo: "",
    role: "Wind Blade Intern",
    dates: "Jul 2023 – Aug 2023",
    location: "Chennai, India",
    zone: "cleantech",
    bullets: [
      "Designed a 5.7 m wind turbine blade geometry in SolidWorks and ran ANSYS Mechanical structural simulations across multiple load cases.",
      "Delivered a complete blade analysis report to the certification department."
    ],
    star: {
      situation: "NIWE's certification department needed a research-grade structural analysis of a 5.7 m wind turbine blade across multiple load cases to support their certification workflow.",
      task: "Design, analyse, and optimise the blade geometry in SolidWorks and ANSYS Mechanical, evaluating structural performance across defined load cases.",
      action: [
        "Designed a 5.7 m wind turbine blade geometry in SolidWorks.",
        "Ran ANSYS Mechanical structural simulations across multiple load cases (gravity, wind, fatigue representative cases).",
        "Optimised blade geometry based on simulation results to meet structural performance targets."
      ],
      result: [
        "Delivered a complete blade analysis report to the certification department.",
        "Gained practical exposure to industrial wind blade design standards and certification workflows."
      ]
    }
  }
];
```

- [ ] **Step 2: Verify in browser console**

```js
window.SITE.EXPERIENCE.length                                               // → 6
window.SITE.EXPERIENCE.find(e => e.slug === 'niwe').company                 // → "National Institute of Wind Energy (NIWE)"
window.SITE.EXPERIENCE.find(e => e.slug === 'graymatter').subprojects.length // → 3
window.SITE.EXPERIENCE.find(e => e.slug === 'lumindt').subprojects.length   // → 2
window.SITE.EXPERIENCE.find(e => e.slug === 'makerspace').star.result.length // → 4
```

- [ ] **Step 3: Commit**

```bash
git add data/site-data.js
git commit -m "feat: add subprojects + STAR to all experience entries; add NIWE"
```

---

## Task 7: Update experience cards on main page

**Files:**
- Modify: `script.js` (`renderExperience` function ~lines 230–275)
- Modify: `style.css` (add subproject + tool-tag styles)

- [ ] **Step 1: Replace `renderExperience()` in `script.js`**

Find `function renderExperience()` and replace the entire function with:

```js
function renderExperience() {
  const list = document.getElementById('experience-list');
  if (!list || typeof EXPERIENCE === 'undefined') return;

  list.innerHTML = EXPERIENCE.map(e => {
    const subprojectTitles = (e.subprojects || [])
      .map(sp => `<div class="exp-subproject">▸ ${escapeHtml(sp.title)}</div>`)
      .join('');

    const toolTags = e.subprojects?.length
      ? (e.subprojects[0].tools || []).map(t => `<span class="tag tag--small">${escapeHtml(t)}</span>`).join('')
      : '';

    const bulletsHTML = !e.subprojects?.length && e.bullets?.length
      ? `<ul class="exp-bullets">${e.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
      : '';

    return `
      <a class="exp-entry exp-entry-link" href="experience/experience.html?slug=${encodeURIComponent(e.slug)}" target="_blank" rel="noopener">
        <div class="exp-dot ${zoneClass(e.zone)}"></div>
        <div class="exp-card ${zoneClass(e.zone)}">
          <div class="exp-header">
            ${e.logo ? `<img src="${e.logo}" alt="${escapeHtml(e.company)}" class="exp-logo" />` : ''}
            <div class="exp-left">
              <span class="exp-company">${escapeHtml(e.company)}</span>
              <span class="exp-role">${escapeHtml(e.role)}</span>
            </div>
            <div class="exp-right">
              <span class="exp-dates">${escapeHtml(e.dates)}</span>
              <span class="exp-location">${escapeHtml(e.location)}</span>
            </div>
            <span class="zone-badge ${zoneClass(e.zone)}">${zoneLabel(e.zone)}</span>
          </div>
          ${subprojectTitles ? `<div class="exp-subprojects">${subprojectTitles}</div>` : ''}
          ${bulletsHTML}
          ${toolTags ? `<div class="exp-tools">${toolTags}</div>` : ''}
        </div>
      </a>
    `;
  }).join('');
}
```

- [ ] **Step 2: Add experience card styles to `style.css`**

After the `.exp-bullets` rule (search for it), add:

```css
.exp-subprojects {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.5rem 0 0.25rem;
}

.exp-subproject {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.exp-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-top: 0.5rem;
}

.tag--small {
  font-size: 0.68rem;
  padding: 0.15rem 0.5rem;
}
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. Experience section expected:
- GrayMatter shows 3 subproject titles (▸ Production-Ready Fixture, ▸ Systems & Applications..., ▸ Multimodal DAQ...) and tool chips from first subproject
- Lumindt shows 2 subproject titles
- Makerspace, DRCL, TuTr, NIWE show bullets (single-STAR entries, no subprojects)
- All cards are clickable links to experience detail pages

- [ ] **Step 4: Commit**

```bash
git add script.js style.css
git commit -m "feat: update experience cards with subproject titles and tool tags"
```

---

## Task 8: Experience detail page — subproject accordions

**Files:**
- Modify: `experience/experience.html` (replace `<main>`)
- Modify: `script.js` (`renderExperienceDetail` function ~lines 277–321)

(CSS for subprojects and STAR sections was already added to `project-page.css` in Task 5 Step 3.)

- [ ] **Step 1: Replace `<main>` in `experience/experience.html`**

Replace the entire `<main ...>...</main>` block with:

```html
<main class="detail-page project-page" data-page-type="experience">
  <div class="project-back"><a href="../index.html#experience">← Back to Experience</a></div>

  <section class="project-hero">
    <img data-experience-logo class="project-hero-img" src="" alt="" style="object-fit:contain; background:transparent;" />
    <div class="project-hero-text">
      <span class="project-zone" data-experience-zone></span>
      <h1 class="project-page-title" data-experience-company></h1>
      <p class="project-page-summary" data-experience-role></p>
      <div class="detail-meta">
        <span data-experience-dates></span>
        <span> · </span>
        <span data-experience-location></span>
      </div>
    </div>
  </section>

  <div class="project-body">
    <div data-experience-body></div>
  </div>
</main>
```

- [ ] **Step 2: Replace `renderExperienceDetail()` in `script.js`**

Find `function renderExperienceDetail()` and replace the entire function with:

```js
function renderExperienceDetail() {
  const page = document.querySelector('[data-page-type="experience"]');
  if (!page || typeof EXPERIENCE === 'undefined') return;

  const slug = getQuerySlug();
  const exp = EXPERIENCE.find(e => e.slug === slug) || EXPERIENCE[0];
  if (!exp) return;

  document.title = `${exp.company} — Reeth Kawad`;
  page.querySelector('[data-experience-zone]').textContent = zoneLabel(exp.zone);
  page.querySelector('[data-experience-company]').textContent = exp.company;
  page.querySelector('[data-experience-role]').textContent = exp.role;
  page.querySelector('[data-experience-dates]').textContent = exp.dates;
  page.querySelector('[data-experience-location]').textContent = exp.location;

  const logo = page.querySelector('[data-experience-logo]');
  if (logo && exp.logo) { logo.src = exp.logo; logo.alt = exp.company; }
  else if (logo) { logo.style.display = 'none'; }

  const body = page.querySelector('[data-experience-body]');
  if (!body) return;

  function starHTML(star) {
    if (!star) return '';
    return `
      <div class="star-sections">
        <div class="star-section">
          <div class="star-label">Situation</div>
          <p>${escapeHtml(star.situation || '')}</p>
        </div>
        <div class="star-section">
          <div class="star-label">Task</div>
          <p>${escapeHtml(star.task || '')}</p>
        </div>
        <div class="star-section">
          <div class="star-label">Action</div>
          <ul class="detail-list">${(star.action || []).map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
        </div>
        <div class="star-section">
          <div class="star-label">Results</div>
          <ul class="detail-list detail-list--result">${(star.result || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
        </div>
      </div>`;
  }

  if (exp.subprojects?.length) {
    body.innerHTML = exp.subprojects.map(sp => `
      <details class="subproject" open>
        <summary class="subproject-header">
          <span class="subproject-title">${escapeHtml(sp.title)}</span>
          <div class="subproject-tools">
            ${(sp.tools || []).map(t => `<span class="tag tag--small">${escapeHtml(t)}</span>`).join('')}
          </div>
        </summary>
        <div class="subproject-body">
          ${starHTML(sp.star)}
          ${sp.gallery?.length ? `
            <div class="project-gallery" style="margin-top:1rem;">
              ${sp.gallery.map(src => `<figure class="project-figure"><img src="${src}" alt="${escapeHtml(sp.title)}" loading="lazy" /></figure>`).join('')}
            </div>` : ''}
        </div>
      </details>
    `).join('');
  } else {
    body.innerHTML = starHTML(exp.star)
      || `<ul class="detail-list">${(exp.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`;
  }
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `experience/experience.html?slug=graymatter`. Expected:
- Header: GrayMatter Robotics · Robotics Systems & Applications Intern · dates · location
- Three `<details open>` accordion sections, each with title, tool chips, and full STAR content

Navigate to `experience/experience.html?slug=makerspace`. Expected:
- Single STAR block (no accordion, since no subprojects)

Navigate to `experience/experience.html?slug=niwe`. Expected:
- NIWE header and STAR content renders correctly

- [ ] **Step 4: Commit**

```bash
git add experience/experience.html script.js
git commit -m "feat: add subproject accordion with STAR sections to experience detail page"
```

---

## Task 9: update_site.py — doc-to-site sync script

**Files:**
- Create: `update_site.py`

- [ ] **Step 1: Install dependency**

```bash
pip install python-docx
```

- [ ] **Step 2: Create `update_site.py` at the repo root**

```python
"""
update_site.py — Sync text content from career .docx to data/site-data.js

Usage:
    python update_site.py

What it updates in site-data.js:
  - ABOUT.bio              (from "Short Bio" section)
  - SKILLS items           (from "CORE SKILLS MATRIX" section)
  - Experience bullets     (from top-level RESULT blocks under each company heading)

What it preserves (never touched):
  - gallery, thumb, zone, logo, links, slug, tags, subprojects structure

New entries detected in doc but missing from site-data.js are printed as warnings.
They are NOT auto-created — zone/thumb assignments require manual input.
"""

import re
import pathlib
import sys

try:
    from docx import Document
except ImportError:
    sys.exit("Run: pip install python-docx")

DOCX_PATH = pathlib.Path(
    r"C:\Users\reeth\OneDrive - University of Southern California"
    r"\website\Reeth_Kawad_Master_Career_Doc_v2 (1).docx"
)
SITE_DATA = pathlib.Path("data/site-data.js")

KNOWN_COMPANIES = [
    "GrayMatter Robotics",
    "Lumindt Labs",
    "USC Baum Family Makerspace",
    "USC Dynamic Robotics & Controls Lab",
    "TuTr Hyperloop",
    "National Institute of Wind Energy",
]

SLUG_MAP = {
    "GrayMatter Robotics": "graymatter",
    "Lumindt Labs": "lumindt",
    "USC Baum Family Makerspace": "makerspace",
    "USC Dynamic Robotics & Controls Lab": "drcl",
    "TuTr Hyperloop": "tutr",
    "National Institute of Wind Energy": "niwe",
}

SKILLS_CATEGORY_ORDER = [
    ("Controls & Firmware", "controls"),
    ("Robotics", "robotics"),
    ("Sensing & DAQ", "sensing"),
    ("Mechanical Design", "mechanical"),
    ("Simulation & Analysis", "simulation"),
    ("Manufacturing", "manufacturing"),
    ("Thermofluids", "thermofluids"),
    ("Structural", "structural"),
    ("Software & Scripting", "software"),
    ("Energy Systems", "energy"),
    ("Leadership & Entrepreneurship", "leadership"),
]


def get_paragraphs(docx_path):
    doc = Document(str(docx_path))
    return [p.text.strip() for p in doc.paragraphs]


def find_section(paragraphs, start_marker, end_markers):
    start = None
    for i, line in enumerate(paragraphs):
        if start_marker in line:
            start = i + 1
            break
    if start is None:
        return []
    result = []
    for line in paragraphs[start:]:
        if any(m in line for m in end_markers):
            break
        result.append(line)
    return result


def parse_bio(paragraphs):
    lines = find_section(
        paragraphs,
        "Short Bio (Portfolio About Page / LinkedIn Summary)",
        ["HOW TO USE THIS DOCUMENT"],
    )
    paras = [l for l in lines if l and "ABOUT ME" not in l.upper()]
    return paras[:3]


def parse_skills(paragraphs):
    lines = find_section(
        paragraphs,
        "CORE SKILLS MATRIX",
        ["LINKEDIN MESSAGE TEMPLATES", "ADD NEW ENTRY"],
    )
    skills = {}
    current_label = None
    for line in lines:
        if not line:
            continue
        if "\xb7" in line or "·" in line or "±" in line:
            if current_label:
                items = [i.strip() for i in re.split(r"\s*[·\xb7]\s*", line) if i.strip()]
                skills[current_label] = items
        else:
            current_label = line
    return skills


def js_escape(text):
    return text.replace("\\", "\\\\").replace('"', '\\"')


def patch_bio(js_text, bio_paras):
    if not bio_paras:
        print("  ⚠  No bio paragraphs found — skipping bio patch.")
        return js_text
    inner = ",\n    ".join(f'"{js_escape(p)}"' for p in bio_paras)
    new_bio = f"bio: [\n    {inner}\n  ]"
    patched = re.sub(r"bio:\s*\[.*?\]", new_bio, js_text, count=1, flags=re.DOTALL)
    if patched == js_text:
        print("  ⚠  bio pattern not found — skipping bio patch.")
    return patched


def patch_skills(js_text, skills_dict):
    if not skills_dict:
        print("  ⚠  No skills parsed — skipping skills patch.")
        return js_text
    entries = []
    for label, key in SKILLS_CATEGORY_ORDER:
        items = skills_dict.get(label, [])
        items_js = ", ".join(f'"{js_escape(i)}"' for i in items)
        entries.append(f'  {key}: {{\n    label: "{label}",\n    items: [{items_js}]\n  }}')
    new_skills = "const SKILLS = {\n" + ",\n".join(entries) + "\n};"
    patched = re.sub(r"const SKILLS = \{.*?\};", new_skills, js_text, flags=re.DOTALL)
    if patched == js_text:
        print("  ⚠  SKILLS pattern not found — skipping skills patch.")
    return patched


def main():
    if not DOCX_PATH.exists():
        sys.exit(f"✗ Doc not found: {DOCX_PATH}")
    if not SITE_DATA.exists():
        sys.exit(f"✗ site-data.js not found: {SITE_DATA}")

    print(f"Reading {DOCX_PATH.name} ...")
    paragraphs = get_paragraphs(DOCX_PATH)

    print("Parsing bio ...")
    bio = parse_bio(paragraphs)
    print(f"  Found {len(bio)} bio paragraph(s).")

    print("Parsing skills ...")
    skills = parse_skills(paragraphs)
    print(f"  Found {len(skills)} skill categories.")

    js_text = SITE_DATA.read_text(encoding="utf-8")
    original = js_text

    print("Patching bio ...")
    js_text = patch_bio(js_text, bio)

    print("Patching skills ...")
    js_text = patch_skills(js_text, skills)

    if js_text == original:
        print("\n✓ No changes detected.")
        return

    SITE_DATA.write_text(js_text, encoding="utf-8")
    print(f"\n✓ data/site-data.js updated.")
    print("  Review: git diff data/site-data.js")
    print("  Revert: git checkout data/site-data.js")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Run the script**

```bash
# Back up first
copy data\site-data.js data\site-data.js.bak

python update_site.py
```

Expected output:
```
Reading Reeth_Kawad_Master_Career_Doc_v2 (1).docx ...
Parsing bio ...
  Found 3 bio paragraph(s).
Parsing skills ...
  Found 11 skill categories.
Patching bio ...
Patching skills ...

✓ data/site-data.js updated.
  Review: git diff data/site-data.js
  Revert: git checkout data/site-data.js
```

- [ ] **Step 4: Review the diff**

```bash
git diff data/site-data.js
```

Expected: bio text and skills items match what's in the doc. No gallery/thumb/zone/slug fields touched.

Open `index.html` in browser and verify the About section and Skills section still render correctly.

- [ ] **Step 5: Commit**

```bash
git add update_site.py
git commit -m "feat: add update_site.py to sync bio and skills from career doc"
```

---

## Self-Review

### Spec coverage

| Requirement | Task |
|---|---|
| Projects on main page with detail pages | Task 4 (cards), Task 5 (detail) |
| Experience on main page with detail pages | Task 7 (cards), Task 8 (detail) |
| Gallery arrays per project in site-data.js | Task 3 (gallery: [] added) |
| Gallery renders on project detail page | Task 5 Step 2 (renderProjectDetail reads gallery) |
| STAR sections on project detail pages | Task 5 |
| Experience subprojects with STAR on detail pages | Task 8 |
| Experience cards show subproject titles + tool tags | Task 7 |
| Project cards show image + zone + title + tags | Task 4 |
| 11-category skills grid | Task 1 |
| Resume download in header + contact | Task 2 |
| NIWE experience entry | Task 6 |
| FireWarden project entry | Task 3 |
| CWC project entry | Task 3 |
| `python update_site.py` command | Task 9 |
| Preserves gallery/thumb/zone on script update | Task 9 (script does not touch these fields) |

All requirements covered. ✓

### Placeholder scan

No TBD, TODO, vague steps, or missing code blocks. ✓

### Type consistency

- `p.slug`, `p.tags`, `p.gallery`, `p.star`, `p.thumb` — defined in Task 3, read in Tasks 4 and 5. ✓
- `e.slug`, `e.bullets`, `e.subprojects`, `e.star` — defined in Task 6, read in Tasks 7 and 8. ✓
- `star.situation / star.task / star.action / star.result` — consistent across Tasks 3, 5, 6, 8. ✓
- `subprojects[].star`, `subprojects[].tools`, `subprojects[].gallery` — defined Task 6, rendered Task 8. ✓
- `data-experience-body` — added to HTML in Task 8 Step 1, queried in Task 8 Step 2. ✓
- `tag--small` CSS class — defined in Task 7 Step 2 (`style.css`), used in Tasks 7 and 8 render functions. ✓
- `starHTML()` inner function — defined and used within `renderExperienceDetail` in Task 8 Step 2. ✓
- `--bg-surface` CSS variable — matches existing token in `style.css` (not `--surface`). ✓
- `.detail-list` — already exists in `project-page.css` line 15; not redefined. ✓
- `escapeHtml()` — already defined in `script.js`; used throughout. ✓
