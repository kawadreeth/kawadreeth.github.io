# Portfolio Visual Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the portfolio with a centered hero photo, experience timeline with mini flowcharts, and a wider project drawer with a 3-image gallery.

**Architecture:** Data-model changes first (adding `images[]` to projects and `flowchart[]` to experience entries), then HTML/JS rendering updates, then CSS. No build tools — pure vanilla HTML/CSS/JS opened directly in browser.

**Tech Stack:** Vanilla HTML, CSS custom properties, vanilla JS, GitHub Pages

---

## File Map

| File | What changes |
|------|-------------|
| `data/projects.js` | Add `images: []` to all 12 projects; add `flowchart: [...]` to all 5 experience entries |
| `index.html` | Add `.hero-photo` `<img>` at top of `.hero-inner`; remove 3 `zone-count` `<span>` elements |
| `script.js` | Rewrite `renderExperience()`; update `openDrawer()` for gallery; add `selectDrawerThumb()`; remove zone-count lines in `renderProjects()` |
| `style.css` | Add `.hero-photo`; add timeline + flowchart styles; update drawer width + add gallery styles; remove dead `.zone-count` mobile rule |

---

## Task 1: Data model — add `images[]` to all projects

**Files:**
- Modify: `data/projects.js`

- [ ] **Step 1: Add `images: []` to every project object**

In `data/projects.js`, add `images: []` to each of the 12 project entries. Place it immediately after the existing `image:` field in each object. The complete list of additions (show each project's `id` for reference):

```js
// vawt
image: "assets/vawt.jpg",
images: [],

// dexhand
image: "assets/dexhand.png",
images: [],

// windtunnel
image: "assets/windtunnel.jpg",
images: [],

// firewarden
image: "assets/firewarden.jpg",
images: [],

// fsae
image: "assets/fsaecar.jpg",
images: [],

// waterrocket
image: "assets/WaterRocketPhoto.JPG",
images: [],

// drone
image: "assets/drone.png",
images: [],

// bridge
image: "assets/bridge.png",
images: [],

// monopoly
image: "assets/monopoly.png",
images: [],

// walkane
image: "assets/walkane_real.png",
images: [],

// alarm
image: "assets/alarm.png",
images: [],

// kothcar
image: "assets/kothcar.jpg",
images: [],
```

- [ ] **Step 2: Verify by opening in browser**

Open `index.html` directly in a browser. Click any project card — the drawer should still open and show the single image with no visual change (gallery only renders when `images` has entries). No errors in browser console.

- [ ] **Step 3: Commit**

```bash
git add data/projects.js
git commit -m "data: add images[] array to all projects"
```

---

## Task 2: Data model — add `flowchart[]` to all experience entries

**Files:**
- Modify: `data/projects.js`

- [ ] **Step 1: Add `flowchart: [...]` to each experience entry**

Add the `flowchart` field to each entry in the `experience` array, placed after the `zone` field:

```js
// lumindt
zone: "cleantech",
flowchart: ["Hot-wire DAQ", "Electrolyzer Skid", "Heat Exchanger Calc", "Fuel Cell Frame", "Python Automation"],

// makerspace
zone: "hardware",
flowchart: ["CNC / Waterjet", "3D Printing", "DFM Guidance"],

// tutr
zone: "robotics",
flowchart: ["Chassis Optimization", "Structural Analysis", "Air Gap Control", "Simulink Model"],

// rld
zone: "robotics",
flowchart: ["Leg Mechanism", "Holding Frame", "Motor Test Stand"],

// niwe
zone: "cleantech",
flowchart: ["Blade CAD", "Structural Analysis", "Load Case Optimization"],
```

- [ ] **Step 2: Verify in browser**

Open `index.html`. Experience section still renders (no JS reads `flowchart` yet — this is just data). No console errors.

- [ ] **Step 3: Commit**

```bash
git add data/projects.js
git commit -m "data: add flowchart[] nodes to all experience entries"
```

---

## Task 3: Hero — photo + remove zone counts

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Add hero photo to `index.html`**

In `index.html`, inside `<div class="hero-inner">`, add the photo as the very first child (before `<p class="hero-label">`):

```html
<div class="hero-inner">
  <img src="assets/profile_picture.png" alt="Reeth Kawad" class="hero-photo" />
  <p class="hero-label">Mechanical Engineer</p>
  ...
```

- [ ] **Step 2: Remove zone-count spans from `index.html`**

Delete the three `<span class="zone-count">` elements. The three zone portal buttons should look like this after the change (no count span):

```html
<button class="zone-portal zone-cleantech" data-zone="cleantech" aria-pressed="false">
  <span class="zone-icon" aria-hidden="true">⚡</span>
  <span class="zone-name">Cleantech</span>
</button>
<button class="zone-portal zone-robotics" data-zone="robotics" aria-pressed="false">
  <span class="zone-icon" aria-hidden="true">🤖</span>
  <span class="zone-name">Robotics</span>
</button>
<button class="zone-portal zone-hardware" data-zone="hardware" aria-pressed="false">
  <span class="zone-icon" aria-hidden="true">🔧</span>
  <span class="zone-name">Hardware</span>
</button>
```

- [ ] **Step 3: Remove zone-count population from `script.js`**

In `renderProjects()`, remove the entire `counts` tracking block. The function currently has this near the top and bottom:

```js
// REMOVE these lines at the top of renderProjects():
const counts = { cleantech: 0, robotics: 0, hardware: 0 };

// inside the forEach, REMOVE:
if (counts[p.zone] !== undefined) counts[p.zone]++;

// REMOVE the entire block at the bottom of renderProjects():
// Update zone portal counts
Object.keys(counts).forEach(zone => {
  const el = document.getElementById(`count-${zone}`);
  if (el) el.textContent = `${counts[zone]} project${counts[zone] !== 1 ? 's' : ''}`;
});
```

After removal, `renderProjects()` should start with `const grid = document.getElementById('projects-grid');` and the `projects.forEach` loop creates cards without any counts tracking.

- [ ] **Step 4: Add hero photo CSS to `style.css`**

Add the following block after the `.hero-sub` rule (around line 276):

```css
.hero-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}
```

- [ ] **Step 5: Remove dead `.zone-count` mobile rule from `style.css`**

In the `@media (max-width: 640px)` block, delete the rule:

```css
/* DELETE this: */
.zone-count {
  margin-left: auto;
}
```

- [ ] **Step 6: Verify in browser**

Open `index.html`. The hero should show:
- Circular photo (150px) centered above "Mechanical Engineer"
- Name typing effect below
- Zone portal buttons show icon + name only, no project count text

- [ ] **Step 7: Commit**

```bash
git add index.html script.js style.css
git commit -m "feat: add centered hero photo, remove zone counts"
```

---

## Task 4: Experience — timeline + flowcharts

**Files:**
- Modify: `script.js`
- Modify: `style.css`

- [ ] **Step 1: Rewrite `renderExperience()` in `script.js`**

Replace the entire `renderExperience()` function with:

```js
function renderExperience() {
  const list = document.getElementById('experience-list');
  if (!list) return;

  list.innerHTML = experience.map(e => {
    const flowchartHTML = e.flowchart && e.flowchart.length
      ? `<div class="exp-flowchart">
           <div class="exp-flowchart-label">Work areas</div>
           <div class="exp-flowchart-nodes">
             ${e.flowchart.map((node, i) => `
               <span class="exp-flowchart-node ${zoneClass(e.zone)}">${node}</span>
               ${i < e.flowchart.length - 1 ? '<span class="exp-flowchart-arrow">→</span>' : ''}
             `).join('')}
           </div>
         </div>`
      : '';

    const bulletsHTML = e.bullets.length
      ? `<ul class="exp-bullets">${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
      : '';

    const linksHTML = e.links.length
      ? `<div class="exp-links">${e.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" class="exp-link">${l.label} ↗</a>`).join('')}</div>`
      : '';

    return `
      <div class="exp-entry">
        <div class="exp-dot ${zoneClass(e.zone)}"></div>
        <div class="exp-card ${zoneClass(e.zone)}">
          <div class="exp-header">
            <img src="${e.logo}" alt="${e.company}" class="exp-logo" />
            <div class="exp-left">
              <span class="exp-company">${e.company}</span>
              <span class="exp-role">${e.role}</span>
            </div>
            <div class="exp-right">
              <span class="exp-dates">${e.dates}</span>
              <span class="exp-location">${e.location}</span>
            </div>
            <span class="zone-badge ${zoneClass(e.zone)}">${zoneLabel(e.zone)}</span>
          </div>
          ${flowchartHTML}
          ${bulletsHTML}
          ${linksHTML}
        </div>
      </div>
    `;
  }).join('');
}

```

- [ ] **Step 2: Add timeline + flowchart CSS to `style.css`**

Replace the existing `/* ── Experience ──` section (the block from `#experience` through `.exp-link:hover`) with:

```css
/* ── Experience ─────────────────────────────────────────────── */
#experience {
  border-top: 1px solid var(--border);
}

.experience-list {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 2rem;
}

.experience-list::before {
  content: '';
  position: absolute;
  left: 0.6rem;
  top: 1.5rem;
  bottom: 1.5rem;
  width: 2px;
  background: var(--border);
}

.exp-entry {
  position: relative;
  padding-bottom: 1.5rem;
}

.exp-entry:last-child {
  padding-bottom: 0;
}

.exp-dot {
  position: absolute;
  left: -1.65rem;
  top: 1.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--zone);
  border: 2px solid var(--bg);
  box-shadow: 0 0 8px var(--zone-glow);
}

.exp-card {
  background: var(--bg-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  border-left: 4px solid var(--zone);
  padding: 1.25rem 1.5rem;
  transition: box-shadow var(--t-mid);
}

.exp-card:hover {
  box-shadow: 0 4px 20px var(--zone-glow);
}

.exp-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0;
  flex-wrap: wrap;
}

.exp-logo {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.exp-left {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.exp-company {
  font-size: 1rem;
  font-weight: 700;
  color: var(--zone);
  display: block;
}

.exp-role {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
}

.exp-right {
  text-align: right;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.exp-dates {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: block;
}

.exp-location {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.exp-flowchart {
  margin: 0.85rem 0 0;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border);
}

.exp-flowchart-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.exp-flowchart-nodes {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.exp-flowchart-node {
  background: color-mix(in srgb, var(--zone) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--zone) 35%, transparent);
  color: var(--zone);
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.exp-flowchart-arrow {
  color: var(--text-muted);
  font-size: 0.75rem;
  line-height: 1;
}

.exp-bullets {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.exp-bullets li {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
  padding-left: 1rem;
  position: relative;
}

.exp-bullets li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--zone);
  font-size: 0.75rem;
  top: 0.15em;
}

.exp-links {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.85rem;
}

.exp-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--zone);
  border: 1px solid var(--zone);
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  transition: background var(--t-fast), color var(--t-fast);
}

.exp-link:hover {
  background: var(--zone);
  color: #fff;
}
```

- [ ] **Step 3: Verify in browser**

Open `index.html` and scroll to Experience. You should see:
- Vertical timeline spine on the left
- Each role as a card with a glowing colored dot, company logo, role/dates, zone badge
- A "Work areas" flowchart with colored node boxes and `→` arrows between them
- Bullet points below the flowchart
- All 5 entries rendered correctly

- [ ] **Step 4: Commit**

```bash
git add script.js style.css
git commit -m "feat: experience section — timeline layout with mini flowcharts"
```

---

## Task 5: Project drawer — 80% width + image gallery

**Files:**
- Modify: `script.js`
- Modify: `style.css`

- [ ] **Step 1: Add `selectDrawerThumb()` to `script.js`**

Add this new function immediately before `closeDrawer()`:

```js
function selectDrawerThumb(thumbEl, src) {
  const mainImg = document.getElementById('drawer-main-img');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.drawer-thumb').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
}
```

- [ ] **Step 2: Update `openDrawer()` in `script.js` to render gallery**

Inside `openDrawer()`, add the two `const galleryImages` and `const imageHTML` lines immediately before the `content.innerHTML = ` assignment, then replace `content.innerHTML` with the version below. Full replacement (everything from `const galleryImages` through the closing backtick of `content.innerHTML`):

```js
const galleryImages = [project.image, ...(project.images ?? [])].slice(0, 3);
const imageHTML = galleryImages.length > 1
  ? `<div class="drawer-gallery">
       <img id="drawer-main-img" class="drawer-main-image" src="${galleryImages[0]}" alt="${project.title}" />
       <div class="drawer-thumbs">
         ${galleryImages.map((src, i) => `<img class="drawer-thumb${i === 0 ? ' active' : ''}" src="${src}" alt="${project.title} photo ${i + 1}" onclick="selectDrawerThumb(this, '${src}')" />`).join('')}
       </div>
     </div>`
  : `<img src="${project.image}" alt="${project.title}" class="drawer-image" />`;

content.innerHTML = `
  <div class="drawer-zone-bar ${zoneClass(project.zone)}"></div>
  <div class="drawer-content-wrap">
    <div class="drawer-header">
      <div class="drawer-meta">
        <span class="zone-badge ${zoneClass(project.zone)}">${zoneLabel(project.zone)}</span>
        ${project.status === 'ongoing' ? '<span class="status-badge ongoing">Ongoing</span>' : ''}
      </div>
      <h2 class="drawer-title">${project.title}</h2>
    </div>
    ${imageHTML}
    <div class="drawer-description">${project.description}</div>
    <div class="drawer-tags">
      ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
    </div>
    ${linksHTML}
  </div>
`;
```

(The `linksHTML` variable is already constructed above this block — no change needed there.)

- [ ] **Step 3: Update drawer width in `style.css`**

In `:root`, change `--drawer-width` from `440px` to:

```css
--drawer-width: min(80vw, 900px);
```

In the `@media (max-width: 1024px)` block, remove the `--drawer-width: 400px;` override entirely — the `min()` formula auto-adapts.

- [ ] **Step 4: Add gallery CSS to `style.css`**

Add the following block after the `.drawer-image` rule (around line 655):

```css
.drawer-gallery {
  margin: 1.25rem 0;
}

.drawer-main-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  margin-bottom: 0.5rem;
  display: block;
}

.drawer-thumbs {
  display: flex;
  gap: 0.5rem;
}

.drawer-thumb {
  flex: 1;
  height: 64px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 2px solid var(--border);
  cursor: pointer;
  transition: border-color var(--t-fast);
  display: block;
}

.drawer-thumb.active {
  border-color: var(--zone);
}

.drawer-thumb:hover {
  border-color: var(--text-muted);
}
```

- [ ] **Step 5: Verify in browser**

Open `index.html`. Click any project card:
- Drawer should be noticeably wider (~80% of the window)
- Single-image projects: regular image, no thumbnail strip
- To test the gallery: temporarily edit one project in `data/projects.js` to have `images: ["assets/fsaecar.jpg", "assets/yaw_probe.png"]`, click that project — you should see the main image + 2 thumbnails, clicking a thumbnail should swap the main image. Revert the test change after verifying.

- [ ] **Step 6: Commit**

```bash
git add script.js style.css
git commit -m "feat: project drawer — 80vw width, 3-image gallery with thumbnail swap"
```

---

## Task 6: Deploy

- [ ] **Step 1: Final smoke test**

Open `index.html` in browser and verify all three features together:
1. Hero: circular photo above name, no project counts on portals
2. Experience: timeline spine + dots + flowcharts visible
3. Projects: click a card, drawer opens wide with image (gallery strip if images were added)

- [ ] **Step 2: Push to deploy**

```bash
git push origin main
```

GitHub Pages will update within ~60 seconds at `https://reethkawad.github.io`.
