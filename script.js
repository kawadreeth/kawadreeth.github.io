// ═══════════════════════════════════════════════════════════════
//  PORTFOLIO — kawadreeth.github.io
//  script.js
// ═══════════════════════════════════════════════════════════════

// ── State ───────────────────────────────────────────────────
const state = {
  activeFilter: 'all',
};

// ── Utilities ───────────────────────────────────────────────
function zoneClass(zone) {
  return `zone-${zone}`;
}

function zoneLabel(zone) {
  const map = { cleantech: '⚡ Cleantech', robotics: '🤖 Robotics', hardware: '🔧 Hardware' };
  return map[zone] ?? zone;
}

// ── Theme ────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('rk-theme') ?? 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const sunEl  = document.querySelector('.icon-sun');
  const moonEl = document.querySelector('.icon-moon');
  if (sunEl)  sunEl.style.display  = theme === 'dark'  ? 'none' : 'inline';
  if (moonEl) moonEl.style.display = theme === 'light' ? 'none' : 'inline';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('rk-theme', next);
}

// ── Typing Effect ────────────────────────────────────────────
function initTyping(targetId, text, speed = 80) {
  const el = document.getElementById(targetId);
  if (!el) return;
  let i = 0;
  function tick() {
    el.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) setTimeout(tick, speed);
  }
  tick();
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getQuerySlug() {
  return new URLSearchParams(window.location.search).get('slug') || '';
}

// Detail pages (projects/, experience/) live one level below the site root;
// index.html is at the root. Data stores asset paths root-relative, so prefix
// them with ../ when we're on a detail page.
const ASSET_PREFIX = (typeof document !== 'undefined' && document.querySelector('[data-page-type]')) ? '../' : '';
function assetUrl(s) {
  return (s && !/^(?:[a-z]+:|\/|\.\.\/)/i.test(s)) ? ASSET_PREFIX + s : s;
}

function paragraphsHTML(value) {
  const parts = Array.isArray(value) ? value : [value];
  return parts.filter(Boolean).map(p => `<p>${escapeHtml(p)}</p>`).join('');
}

function parseAboutBio(text) {
  const startMarker = 'Short Bio (Portfolio About Page / LinkedIn Summary)';
  const endMarker = 'HOW TO USE THIS DOCUMENT';
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) return [];

  return text
    .slice(start + startMarker.length, end)
    .split(/\n\n+/)
    .map(part => part.trim())
    .filter(Boolean)
    .filter(part => !part.toUpperCase().includes('ABOUT ME'))
    .slice(0, 3);
}

async function renderAbout() {
  const aboutText = document.querySelector('.about-text');
  if (!aboutText) return;

  const fallback = Array.isArray(SITE?.ABOUT?.bio) ? SITE.ABOUT.bio : [];

  try {
    const response = await fetch('data/doc_text.txt', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const paragraphs = parseAboutBio(text);
    const bio = paragraphs.length ? paragraphs : fallback;
    aboutText.innerHTML = bio.map(paragraph => `<p>${paragraph}</p>`).join('');
  } catch {
    aboutText.innerHTML = fallback.map(paragraph => `<p>${paragraph}</p>`).join('');
  }
}

// ── Render: Projects ─────────────────────────────────────────
// Number of most-recent year groups expanded by default.
const OPEN_YEARS = 2;

function slidesLink(p) {
  const slides = (p.links || []).find(l => /slides?/i.test(l.label));
  return slides
    ? `<a class="card-slides" href="${slides.url}" target="_blank" rel="noopener">Slides ↗</a>`
    : '';
}

function projectCardHTML(p) {
  return `
    <a class="card-link" href="projects/project.html?slug=${encodeURIComponent(p.slug)}" aria-label="${escapeHtml(p.title)}">
      ${p.thumb ? `<img class="card-image" src="${assetUrl(p.thumb)}" alt="${escapeHtml(p.title)}" loading="lazy" />` : ''}
      <div class="card-body">
        <span class="zone-badge ${zoneClass(p.zone)}">${zoneLabel(p.zone)}</span>
        <h3 class="card-title">${escapeHtml(p.title)}</h3>
        <div class="card-tags">
          ${(p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </a>
    ${slidesLink(p)}
  `;
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;
  grid.innerHTML = '';

  // Group by year, descending. Entries without a year sort last under "Undated".
  const sorted = [...PROJECTS].sort((a, b) => (b.year || 0) - (a.year || 0));
  const groups = new Map();
  sorted.forEach(p => {
    const key = p.year || 'Undated';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  });

  let index = 0;
  groups.forEach((projects, key) => {
    const open = index < OPEN_YEARS;
    index++;

    const section = document.createElement('div');
    section.className = 'timeline-year';
    section.dataset.year = key;

    const label = key === 'Undated' ? 'Undated' : key;
    const count = `${projects.length} project${projects.length === 1 ? '' : 's'}`;

    section.innerHTML = `
      <button class="year-toggle" aria-expanded="${open ? 'true' : 'false'}">
        <span class="year-node" aria-hidden="true"></span>
        <span class="year-label">${escapeHtml(String(label))}</span>
        <span class="year-count">${count}</span>
        <span class="year-chevron" aria-hidden="true">▾</span>
      </button>
      <div class="year-projects" role="list"${open ? '' : ' hidden'}></div>
    `;

    const listEl = section.querySelector('.year-projects');
    projects.forEach(p => {
      const card = document.createElement('div');
      card.className = `project-card ${zoneClass(p.zone)}`;
      card.dataset.zone = p.zone;
      card.dataset.year = key;
      card.setAttribute('role', 'listitem');
      card.innerHTML = projectCardHTML(p);
      listEl.appendChild(card);
    });

    grid.appendChild(section);
  });
}

function toggleYear(btn) {
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  const list = btn.parentElement.querySelector('.year-projects');
  if (list) list.hidden = expanded;
}

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

function subprojectsHTML(subprojects) {
  return (subprojects || []).map(sp => `
    <details class="subproject" open>
      <summary class="subproject-header">
        <span class="subproject-title">${escapeHtml(sp.title)}</span>
        <div class="subproject-tools">
          ${(sp.tools || []).map(t => `<span class="tag tag--small">${escapeHtml(t)}</span>`).join('')}
        </div>
      </summary>
      <div class="subproject-body">
        ${sp.star
          ? starHTML(sp.star)
          : `${sp.summary ? `<p>${escapeHtml(sp.summary)}</p>` : ''}${(sp.points || []).length ? `<ul class="detail-list">${sp.points.map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}</ul>` : ''}`}
        ${sp.gallery?.length ? `
          <div class="project-gallery" style="margin-top:1rem;">
            ${sp.gallery.map(src => `<figure class="project-figure"><img src="${assetUrl(src)}" alt="${escapeHtml(sp.title)}" loading="lazy" onerror="this.closest('figure').style.display='none'" /></figure>`).join('')}
          </div>` : ''}
      </div>
    </details>
  `).join('');
}

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
  const heroSrc = assetUrl(project.gallery?.[0] || project.thumb || '');
  if (heroImg && heroSrc) {
    heroImg.alt = project.title;
    heroImg.onerror = () => { heroImg.style.display = 'none'; };
    heroImg.src = heroSrc;
    heroImg.style.display = '';
  } else if (heroImg) { heroImg.style.display = 'none'; }

  const starBox = page.querySelector('[data-project-star]');
  const star = project.star;
  if (project.overview) {
    // Simple (non-STAR) mode: plain prose in place of the STAR grid.
    starBox.classList.remove('star-sections');
    starBox.innerHTML = paragraphsHTML(project.overview);
  } else if (star) {
    page.querySelector('[data-project-situation]').textContent = star.situation || '';
    page.querySelector('[data-project-task]').textContent = star.task || '';
    const actionEl = page.querySelector('[data-project-action]');
    const resultEl = page.querySelector('[data-project-result]');
    actionEl.innerHTML = (star.action || []).map(a => `<li>${escapeHtml(a)}</li>`).join('');
    resultEl.innerHTML = (star.result || []).map(r => `<li>${escapeHtml(r)}</li>`).join('');
    actionEl.closest('.star-section').style.display = (star.action || []).length ? '' : 'none';
    resultEl.closest('.star-section').style.display = (star.result || []).length ? '' : 'none';
  }

  const tags = page.querySelector('[data-project-tags]');
  if (tags) tags.innerHTML = (project.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');

  const subSection = page.querySelector('[data-project-subprojects-section]');
  const subWrap = page.querySelector('[data-project-subprojects]');
  if (subWrap && project.subprojects?.length) {
    subWrap.innerHTML = subprojectsHTML(project.subprojects);
    if (subSection) subSection.hidden = false;
  } else if (subSection) {
    subSection.hidden = true;
  }

  const gallery = page.querySelector('[data-project-gallery]');
  if (gallery) {
    const images = [...new Set([project.thumb, ...(project.gallery || [])].filter(Boolean))];
    gallery.innerHTML = images.length
      ? images.map(src => `<figure class="project-figure"><img src="${assetUrl(src)}" alt="${escapeHtml(project.title)}" loading="lazy" onerror="this.closest('figure').style.display='none'" /></figure>`).join('')
      : '';
  }

  const links = page.querySelector('[data-project-links]');
  if (links) {
    links.innerHTML = (project.links || []).length
      ? project.links.map(l => `<a class="detail-link" href="${l.url}" target="_blank" rel="noopener">${escapeHtml(l.label)} ↗</a>`).join('')
      : '<p class="project-empty">No external links yet.</p>';
  }
}

// ── Filter Logic ─────────────────────────────────────────────
function applyFilter(zone) {
  state.activeFilter = zone;

  // Update filter tabs
  document.querySelectorAll('.filter-tab').forEach(btn => {
    const isActive = btn.dataset.filter === zone;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update zone portals
  document.querySelectorAll('.zone-portal').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.zone === zone);
    btn.setAttribute('aria-pressed', btn.dataset.zone === zone ? 'true' : 'false');
  });

  // Show/hide cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.classList.toggle('hidden', zone !== 'all' && card.dataset.zone !== zone);
  });

  // Hide year groups that have no visible cards under the current filter
  document.querySelectorAll('.timeline-year').forEach(section => {
    const visible = section.querySelectorAll('.project-card:not(.hidden)').length;
    section.classList.toggle('hidden', visible === 0);
  });
}

// ── Render: Experience ───────────────────────────────────────
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
            ${e.logo ? `<img src="${assetUrl(e.logo)}" alt="${escapeHtml(e.company)}" class="exp-logo" />` : ''}
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
  if (logo && exp.logo) {
    logo.alt = exp.company;
    logo.onerror = () => { logo.style.display = 'none'; };
    logo.src = assetUrl(exp.logo);
    logo.style.display = '';
  } else if (logo) { logo.style.display = 'none'; }

  const body = page.querySelector('[data-experience-body]');
  if (!body) return;

  if (exp.subprojects?.length) {
    body.innerHTML = subprojectsHTML(exp.subprojects);
  } else {
    body.innerHTML = starHTML(exp.star)
      || `<ul class="detail-list">${(exp.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`;
  }
}

// ── Render: Skills ───────────────────────────────────────────
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

// ── Event Bindings ───────────────────────────────────────────
function bindEvents() {
  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // Timeline year collapse/expand (delegated — cards are re-rendered)
  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.addEventListener('click', e => {
      const toggle = e.target.closest('.year-toggle');
      if (toggle) toggleYear(toggle);
    });
  }

  // Zone portals (hero)
  document.querySelectorAll('.zone-portal').forEach(btn => {
    btn.addEventListener('click', () => {
      const zone = btn.dataset.zone;
      applyFilter(zone);
      // Scroll to projects
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Drawer close
  const closeBtn = document.getElementById('drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  const overlay = document.getElementById('drawer-overlay');
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Keyboard: Escape closes drawer
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.drawerOpen) closeDrawer();
  });

  // Mobile hamburger
  const hamburger = document.getElementById('nav-hamburger');
  const nav       = document.getElementById('main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile nav when a link is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ── Resume / CV ──────────────────────────────────────────────
function initResume() {
  const resume = window.SITE?.ABOUT?.resume;
  if (!resume) return;
  const navLink     = document.getElementById('nav-cv-link');
  const contactLink = document.getElementById('contact-cv-link');
  if (navLink)     { navLink.href     = resume; navLink.style.display     = ''; }
  if (contactLink) { contactLink.href = resume; contactLink.style.display = ''; }
}

// ── Init ─────────────────────────────────────────────────────
function init() {
  initTheme();
  initResume();
  renderAbout();
  renderProjectDetail();
  renderExperienceDetail();
  renderProjects();
  renderExperience();
  renderSkills();
  bindEvents();
  // Small delay so the DOM renders first, making the typing effect feel intentional
  setTimeout(() => initTyping('typing-target', 'Reeth Kawad', 75), 200);
}

document.addEventListener('DOMContentLoaded', init);
