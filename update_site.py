"""
update_site.py — Sync text content from career .docx to data/site-data.js

Usage:
    python update_site.py

What it updates in site-data.js:
  - ABOUT.bio              (from "Short Bio" section)
  - SKILLS items           (from "CORE SKILLS MATRIX" section)

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

from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph as DocxParagraph
from docx.table import Table as DocxTable
from dataclasses import dataclass, field
from typing import List


@dataclass
class SubProject:
    title: str
    tools: List[str]
    situation: str
    task: str
    action: List[str]
    result: List[str]


@dataclass
class Experience:
    company: str
    role: str
    dates: str
    location: str
    subprojects: List[SubProject]


@dataclass
class Project:
    title: str
    tags: List[str]
    situation: str
    task: str
    action: List[str]
    result: List[str]


@dataclass
class Token:
    type: str
    text: str = ""
    situation: str = ""
    task: str = ""


def iter_body_elements(doc):
    """Yield (kind, element) for each paragraph or table in document order."""
    for child in doc.element.body.iterchildren():
        tag = child.tag.split("}")[-1]
        if tag == "p":
            yield "paragraph", DocxParagraph(child, doc)
        elif tag == "tbl":
            yield "table", DocxTable(child, doc)


def parse_star_table(table):
    """Extract (situation, task) from a 2-row S/T table. Returns (None, None) if not a STAR table."""
    if len(table.rows) < 2:
        return None, None
    row0, row1 = table.rows[0], table.rows[1]
    if len(row0.cells) < 2 or len(row1.cells) < 2:
        return None, None
    if row0.cells[0].text.strip() != "S" or row1.cells[0].text.strip() != "T":
        return None, None
    situation = re.sub(r"^SITUATION\s*", "", row0.cells[1].text.strip(), flags=re.IGNORECASE).strip()
    task = re.sub(r"^TASK\s*", "", row1.cells[1].text.strip(), flags=re.IGNORECASE).strip()
    return situation, task


def _classify_paragraph(text):
    if not text:
        return None
    if any(text.strip() == m or text.startswith(m) for m in _SECTION_END_MARKERS):
        return "SECTION_END"
    if any(company in text for company in KNOWN_COMPANIES):
        return "COMPANY_HEADER"
    if re.match(r"\w+ \d{4}\s*[–\-]", text):
        return "DATE_LINE"
    if re.match(r"Project \d+:", text):
        return "SUBPROJECT_HEADER"
    if any(text.startswith(prefix) for prefix in PROJECT_TITLE_SLUGS):
        return "STANDALONE_TITLE"
    if "·" in text or "\xb7" in text:
        return "TOOLS_LINE"
    if text.strip() == "ACTION":
        return "ACTION_HEADER"
    if text.strip() == "RESULT":
        return "RESULT_HEADER"
    if _EXPERIENCE_HEADER_RE.search(text):
        return "UNKNOWN_HEADER"
    return "BULLET_ITEM"


def tokenize_doc(doc):
    """Walk doc body in element order and return a flat list of Tokens."""
    tokens = []
    for kind, elem in iter_body_elements(doc):
        if kind == "paragraph":
            text = elem.text.strip()
            if not text:
                continue
            tok_type = _classify_paragraph(text)
            if tok_type:
                tokens.append(Token(type=tok_type, text=text))
        elif kind == "table":
            situation, task = parse_star_table(elem)
            if situation is not None:
                tokens.append(Token(type="STAR_TABLE", situation=situation, task=task))
    return tokens


def _parse_company_header(text):
    """Split 'Company Name — Role Title' into (company, role)."""
    parts = re.split(r"\s*[—–]\s*", text, maxsplit=1)
    if len(parts) == 2:
        return parts[0].strip(), parts[1].strip()
    return text.strip(), ""


def _parse_date_line(text):
    """Split 'Jun 2024 – Jul 2024  |  description  |  Location, ST' into (dates, location)."""
    parts = [p.strip() for p in text.split("|")]
    dates = parts[0].strip() if parts else ""
    location = parts[-1].strip() if len(parts) >= 2 else ""
    return dates, location


def _parse_tools(text):
    """Split a bullet-separated tools line into a list."""
    return [t.strip() for t in re.split(r"\s*[·\xb7]\s*", text) if t.strip()]


def _flush_experience(experiences, current_exp, current_sub):
    if current_sub is not None and current_exp is not None:
        current_exp.subprojects.append(current_sub)
    if current_exp is not None:
        experiences.append(current_exp)


def parse_experiences(tokens):
    """Parse Experience objects from a token list. Stops at first STANDALONE_TITLE."""
    experiences = []
    current_exp = None
    current_sub = None
    state = "IDLE"  # IDLE, IN_EXP, IN_SUB, IN_ACTION, IN_RESULT

    for tok in tokens:
        # --- boundaries that end the experience section ---
        if tok.type in ("STANDALONE_TITLE", "SECTION_END"):
            _flush_experience(experiences, current_exp, current_sub)
            break

        if tok.type == "UNKNOWN_HEADER":
            # FireWarden, CWC etc — end current experience, skip entry
            _flush_experience(experiences, current_exp, current_sub)
            current_exp = None
            current_sub = None
            state = "IDLE"
            continue

        # --- new experience ---
        if tok.type == "COMPANY_HEADER":
            _flush_experience(experiences, current_exp, current_sub)
            company, role = _parse_company_header(tok.text)
            current_exp = Experience(company=company, role=role, dates="", location="", subprojects=[])
            current_sub = None
            state = "IN_EXP"
            continue

        if current_exp is None:
            continue

        # --- experience-level fields ---
        if tok.type == "DATE_LINE" and state == "IN_EXP":
            current_exp.dates, current_exp.location = _parse_date_line(tok.text)
            continue

        # --- named subproject header ---
        if tok.type == "SUBPROJECT_HEADER":
            if current_sub is not None:
                current_exp.subprojects.append(current_sub)
            title = re.sub(r"^Project \d+:\s*", "", tok.text).strip()
            current_sub = SubProject(title=title, tools=[], situation="", task="", action=[], result=[])
            state = "IN_SUB"
            continue

        # --- implicit subproject start (flat experience) ---
        if current_sub is None and tok.type in ("TOOLS_LINE", "STAR_TABLE", "ACTION_HEADER"):
            current_sub = SubProject(title="", tools=[], situation="", task="", action=[], result=[])
            state = "IN_SUB"
            # fall through to handle the token below

        if current_sub is None:
            continue

        # --- subproject-level fields ---
        if tok.type == "TOOLS_LINE":
            current_sub.tools = _parse_tools(tok.text)
        elif tok.type == "STAR_TABLE":
            current_sub.situation = tok.situation
            current_sub.task = tok.task
        elif tok.type == "ACTION_HEADER":
            state = "IN_ACTION"
        elif tok.type == "RESULT_HEADER":
            state = "IN_RESULT"
        elif tok.type == "BULLET_ITEM" and state == "IN_ACTION":
            current_sub.action.append(tok.text)
        elif tok.type == "BULLET_ITEM" and state == "IN_RESULT":
            current_sub.result.append(tok.text)

    else:
        # token list exhausted without hitting a boundary
        _flush_experience(experiences, current_exp, current_sub)

    return experiences


def parse_projects(tokens):
    """Parse standalone Project objects from a token list."""
    projects = []
    current_proj = None
    state = "IDLE"  # IDLE, IN_PROJ, IN_ACTION, IN_RESULT

    for tok in tokens:
        if tok.type == "SECTION_END":
            if current_proj is not None:
                projects.append(current_proj)
            break

        if tok.type == "STANDALONE_TITLE":
            if current_proj is not None:
                projects.append(current_proj)
            # Strip award emoji/text: everything after first trophy or medal emoji
            title = re.sub(r"\s*[\U0001f3c6\U0001f947-\U0001f949].*$", "", tok.text).strip()
            current_proj = Project(title=title, tags=[], situation="", task="", action=[], result=[])
            state = "IN_PROJ"
            continue

        if current_proj is None:
            continue

        if tok.type == "TOOLS_LINE":
            current_proj.tags = _parse_tools(tok.text)
        elif tok.type == "STAR_TABLE":
            current_proj.situation = tok.situation
            current_proj.task = tok.task
        elif tok.type == "ACTION_HEADER":
            state = "IN_ACTION"
        elif tok.type == "RESULT_HEADER":
            state = "IN_RESULT"
        elif tok.type == "BULLET_ITEM" and state == "IN_ACTION":
            current_proj.action.append(tok.text)
        elif tok.type == "BULLET_ITEM" and state == "IN_RESULT":
            current_proj.result.append(tok.text)

    else:
        if current_proj is not None:
            projects.append(current_proj)

    return projects


def _extract_top_level_entries(js_text):
    """Yield the text content of each top-level { } entry in a JS array."""
    depth = 0
    start = None
    for i, ch in enumerate(js_text):
        if ch == '{':
            if depth == 0:
                start = i + 1
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start is not None:
                yield js_text[start:i]
                start = None


def extract_manual_experience_fields(js_text):
    """Parse manual-only fields (slug, logo, zone, bullets) from EXPERIENCE JS array.

    Returns a dict keyed by slug:
      { slug: { "slug": ..., "logo": ..., "zone": ..., "bullets": [...] } }
    """
    result = {}
    for block in _extract_top_level_entries(js_text):
        slug_m = re.search(r'slug:\s*"([^"]*)"', block)
        if not slug_m:
            continue
        slug = slug_m.group(1)
        logo_m = re.search(r'logo:\s*"([^"]*)"', block)
        zone_m = re.search(r'zone:\s*"([^"]*)"', block)
        bullets_m = re.search(r'bullets:\s*\[(.*?)\]', block, re.DOTALL)
        logo = logo_m.group(1) if logo_m else ""
        zone = zone_m.group(1) if zone_m else ""
        bullets = []
        if bullets_m:
            bullets = re.findall(r'"([^"]*)"', bullets_m.group(1))
        result[slug] = {"slug": slug, "logo": logo, "zone": zone, "bullets": bullets}
    return result


def extract_manual_project_fields(js_text):
    """Parse manual-only fields (slug, zone, thumb) from PROJECTS JS array.

    Returns a dict keyed by slug:
      { slug: { "slug": ..., "zone": ..., "thumb": ... } }
    """
    result = {}
    for block in _extract_top_level_entries(js_text):
        slug_m = re.search(r'slug:\s*"([^"]*)"', block)
        if not slug_m:
            continue
        slug = slug_m.group(1)
        zone_m = re.search(r'zone:\s*"([^"]*)"', block)
        thumb_m = re.search(r'thumb:\s*"([^"]*)"', block)
        zone = zone_m.group(1) if zone_m else ""
        thumb = thumb_m.group(1) if thumb_m else ""
        result[slug] = {"slug": slug, "zone": zone, "thumb": thumb}
    return result


def _js_str_array(items, indent):
    """Render a JS string array with given indentation for items."""
    if not items:
        return "[]"
    lines = ",\n".join(f'{indent}"{js_escape(i)}"' for i in items)
    return f"[\n{lines}\n{indent[:-2]}]"


def _render_star(sp, base_indent):
    """Render a star: {...} block. base_indent is the indent of 'star:'."""
    i2 = base_indent + "  "
    i3 = i2 + "  "
    return (
        f"star: {{\n"
        f'{i2}situation: "{js_escape(sp.situation)}",\n'
        f'{i2}task: "{js_escape(sp.task)}",\n'
        f"{i2}action: {_js_str_array(sp.action, i3)},\n"
        f"{i2}result: {_js_str_array(sp.result, i3)}\n"
        f"{base_indent}}}"
    )


def render_experience_js(exp, manual):
    """Render a single JS experience entry object (no trailing comma)."""
    slug = manual.get("slug", "TODO_slug")
    logo = js_escape(manual.get("logo", ""))
    zone = manual.get("zone", "")
    bullets = manual.get("bullets", [])

    bullets_js = _js_str_array(bullets, "      ")
    header = (
        f'  {{\n'
        f'    slug: "{slug}",\n'
        f'    company: "{js_escape(exp.company)}",\n'
        f'    logo: "{logo}",\n'
        f'    role: "{js_escape(exp.role)}",\n'
        f'    dates: "{js_escape(exp.dates)}",\n'
        f'    location: "{js_escape(exp.location)}",\n'
        f'    zone: "{zone}",\n'
        f'    bullets: {bullets_js},\n'
    )

    if len(exp.subprojects) == 1 and exp.subprojects[0].title == "":
        # flat star layout
        sp = exp.subprojects[0]
        star_block = _render_star(sp, "    ")
        return header + f"    {star_block}\n  }}"
    else:
        # subprojects layout
        sub_parts = []
        for sp in exp.subprojects:
            tools_js = _js_str_array(sp.tools, "          ")
            star_block = _render_star(sp, "        ")
            sub_parts.append(
                f'      {{\n'
                f'        title: "{js_escape(sp.title)}",\n'
                f'        tools: {tools_js},\n'
                f'        gallery: [],\n'
                f'        {star_block}\n'
                f'      }}'
            )
        subs_js = ",\n".join(sub_parts)
        return header + f"    subprojects: [\n{subs_js}\n    ]\n  }}"


def render_project_js(proj, manual):
    """Render a single JS project entry object (no trailing comma)."""
    slug = manual.get("slug", "TODO_slug")
    zone = manual.get("zone", "")
    thumb = js_escape(manual.get("thumb", ""))
    tags_js = _js_str_array(proj.tags, "      ")
    star_block = _render_star(proj, "    ")
    return (
        f'  {{\n'
        f'    slug: "{slug}",\n'
        f'    title: "{js_escape(proj.title)}",\n'
        f'    zone: "{zone}",\n'
        f'    thumb: "{thumb}",\n'
        f'    tags: {tags_js},\n'
        f'    gallery: [],\n'
        f'    {star_block}\n'
        f'  }}'
    )


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

# Maps doc standalone-project title prefix → existing slug (None = new entry)
PROJECT_TITLE_SLUGS = {
    "Adaptive Pitch Control": "vawt",
    "Turbine Airfoil CFD": None,
    "Honeycomb Flow Straightener": "windtunnel",
    "Smart Alarm Clock": "alarm",
    "Walkane": "walkane",
    "FSAE Projects": "fsae",
    "8 DoF Robotic Hand": "dexhand",
    "Truss Bridge": "bridge",
    "2-DOF Bluetooth": "kothcar",
    "Water Rocket": "waterrocket",
    "Drone CAD": "drone",
    "Automated Monopoly": "monopoly",
    "FireWarden": "firewarden",
    "USC Collegiate Wind Competition": "cwc",
}

# Lines matching this pattern but NOT in KNOWN_COMPANIES end the current experience
_EXPERIENCE_HEADER_RE = re.compile(
    r".+[—–].+\b(Intern|Engineer|Lead|Founder|Co-Founder|CTO|Manager|Director|Machinist|Researcher)\b"
)

_SECTION_END_MARKERS = [
    "Other Projects (Summary)",
    "LINKEDIN MESSAGE TEMPLATES",
    "HOW TO USE THIS PAGE",
    "CORE SKILLS MATRIX",
    "Short Bio",
]

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
