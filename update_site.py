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
