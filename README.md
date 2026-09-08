# reethkawad.github.io

Personal portfolio — static GitHub Pages site, no build pipeline.

---

## Architecture

- **`data/site-data.js`** — single source of truth for all content (projects, experience, skills, bio)
- **`script.js`** — renders everything client-side from `site-data.js`
- **`index.html`** — main page; project/experience cards link to detail pages via `?slug=` query params
- **`projects/project.html`** — shared project detail page
- **`experience/experience.html`** — shared experience detail page

---

## Content updates

### Sync bio + skills from the career Word doc

```powershell
python update_site.py
```

Reads `Reeth_Kawad_Master_Career_Doc_v2 (1).docx`, patches `ABOUT.bio` and `SKILLS` in `data/site-data.js`, and prints a summary of what changed. Does not touch `gallery`, `thumb`, `zone`, `slug`, or any metadata fields.

### Add gallery images to a project or experience

1. Drop images into `assets/projects/<slug>/` or `assets/experience/<slug>/`
2. Add the paths to the matching entry in `data/site-data.js`:

```js
gallery: [
  "assets/projects/vawt/img1.jpg",
  "assets/projects/vawt/img2.jpg"
]
```

The first image in `gallery` is used as the hero on the detail page. The card thumbnail still comes from `thumb`.

### Update text content (STAR, bullets, subprojects)

Edit `data/site-data.js` directly. Each project and experience has a `star` object with `situation`, `task`, `action[]`, and `result[]`. Experiences with subprojects have a `subprojects` array, each with its own `star` + `gallery`.

### CV / Resume

Drop the PDF at `assets/Reeth_Kawad_CV.pdf`. The path is set in `ABOUT.resume` in `site-data.js`. Both the header "CV ↓" link and the contact section "Download CV" link read from that field automatically.

---

## Zones

| Zone | Color | Use for |
|------|-------|---------|
| `cleantech` | yellow | energy, wind, sustainability |
| `robotics` | teal | robotics, automation |
| `hardware` | purple | electronics, embedded, mechanical |

---

## Asset conventions

| Asset | Path |
|-------|------|
| Project thumbnail | `assets/projects/<slug>/thumb.jpg` |
| Project gallery | `assets/projects/<slug>/img1.jpg`, `img2.jpg`, … |
| Experience gallery | `assets/experience/<slug>/img1.jpg`, `img2.jpg`, … |
| Company logo | `assets/logos/<slug>.png` |
| Resume PDF | `assets/Reeth_Kawad_CV.pdf` |
