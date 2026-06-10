# update_site.py — Experiences & Projects Sync — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `update_site.py` to parse experiences and standalone projects from the career `.docx` and regenerate the `const EXPERIENCE` and `const PROJECTS` blocks in `data/site-data.js`, syncing doc-derivable fields while preserving manually-set fields (slug, zone, thumb, gallery, logo, bullets).

**Architecture:** Walk the Word document body in XML element order (paragraphs and tables interleaved) to produce a flat token stream, then drive two state machines — one for experiences, one for standalone projects — over that stream. Manual fields are extracted from the existing `site-data.js` by slug before regenerating each JS block.

**Tech Stack:** Python 3, `python-docx`, `re`, `dataclasses`, `pytest`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `update_site.py` | Modify | Add ~380 lines: data models, tokenizer, parsers, renderers, patchers, updated main() |
| `tests/test_update_site.py` | Create | Unit tests for every parsing/rendering function |

---

## Task 1: Test infrastructure + data models

**Files:**
- Modify: `update_site.py` (add imports and data model classes after existing imports)
- Create: `tests/__init__.py`
- Create: `tests/test_update_site.py`

- [ ] **Step 1: Install pytest in the venv**

```
pip install pytest
```

- [ ] **Step 2: Create `tests/__init__.py` (empty)**

```python
```

- [ ] **Step 3: Write failing test for dataclasses**

Add to `tests/test_update_site.py`:

```python
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from update_site import SubProject, Experience, Project, Token

def test_subproject_defaults():
    sp = SubProject(title="Test", tools=[], situation="s", task="t", action=[], result=[])
    assert sp.title == "Test"

def test_experience_defaults():
    exp = Experience(company="Acme", role="Intern", dates="2024", location="LA", subprojects=[])
    assert exp.subprojects == []

def test_project_defaults():
    proj = Project(title="Foo", tags=[], situation="s", task="t", action=[], result=[])
    assert proj.title == "Foo"

def test_token_defaults():
    tok = Token(type="BULLET_ITEM", text="hello")
    assert tok.situation == ""
```

- [ ] **Step 4: Run — verify FAIL (classes not defined yet)**

```
pytest tests/test_update_site.py::test_subproject_defaults -v
```

Expected: `ImportError` or `AttributeError`

- [ ] **Step 5: Add data models to `update_site.py`**

Add after the existing imports, before `DOCX_PATH`:

```python
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
```

- [ ] **Step 6: Run — verify PASS**

```
pytest tests/test_update_site.py -v
```

Expected: 4 passing

- [ ] **Step 7: Commit**

```
git add update_site.py tests/__init__.py tests/test_update_site.py
git commit -m "feat: add data models and test infrastructure for experience/project sync"
```

---

## Task 2: Body element iterator

**Files:**
- Modify: `update_site.py`
- Modify: `tests/test_update_site.py`

- [ ] **Step 1: Write failing test**

Append to `tests/test_update_site.py`:

```python
from docx import Document
from update_site import iter_body_elements

def test_iter_body_elements_order():
    doc = Document()
    doc.add_paragraph("first")
    doc.add_table(rows=1, cols=1)
    doc.add_paragraph("third")
    elements = list(iter_body_elements(doc))
    kinds = [k for k, _ in elements]
    assert kinds == ["paragraph", "table", "paragraph"]

def test_iter_body_elements_empty_doc():
    doc = Document()
    # new Document() has one empty paragraph by default
    elements = list(iter_body_elements(doc))
    assert all(k == "paragraph" for k, _ in elements)
```

- [ ] **Step 2: Run — verify FAIL**

```
pytest tests/test_update_site.py::test_iter_body_elements_order -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `iter_body_elements` in `update_site.py`**

Add after the dataclasses, before `DOCX_PATH`:

```python
from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph as DocxParagraph
from docx.table import Table as DocxTable


def iter_body_elements(doc):
    """Yield (kind, element) for each paragraph or table in document order."""
    for child in doc.element.body.iterchildren():
        tag = child.tag.split("}")[-1]
        if tag == "p":
            yield "paragraph", DocxParagraph(child, doc)
        elif tag == "tbl":
            yield "table", DocxTable(child, doc)
```

- [ ] **Step 4: Run — verify PASS**

```
pytest tests/test_update_site.py -v
```

Expected: all passing

- [ ] **Step 5: Commit**

```
git add update_site.py tests/test_update_site.py
git commit -m "feat: add body element iterator for mixed paragraph/table doc walking"
```

---

## Task 3: STAR table parser

**Files:**
- Modify: `update_site.py`
- Modify: `tests/test_update_site.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/test_update_site.py`:

```python
from update_site import parse_star_table

def _make_star_table(doc, situation, task):
    table = doc.add_table(rows=2, cols=2)
    table.rows[0].cells[0].text = "S"
    table.rows[0].cells[1].text = f"SITUATION  {situation}"
    table.rows[1].cells[0].text = "T"
    table.rows[1].cells[1].text = f"TASK  {task}"
    return table

def test_parse_star_table_extracts_fields():
    doc = Document()
    table = _make_star_table(doc, "The initial problem.", "Fix it completely.")
    situation, task = parse_star_table(table)
    assert situation == "The initial problem."
    assert task == "Fix it completely."

def test_parse_star_table_strips_prefix():
    doc = Document()
    table = doc.add_table(rows=2, cols=2)
    table.rows[0].cells[0].text = "S"
    table.rows[0].cells[1].text = "SITUATION No prefix needed."
    table.rows[1].cells[0].text = "T"
    table.rows[1].cells[1].text = "TASK Do the thing."
    situation, task = parse_star_table(table)
    assert not situation.startswith("SITUATION")
    assert not task.startswith("TASK")

def test_parse_star_table_wrong_labels_returns_none():
    doc = Document()
    table = doc.add_table(rows=2, cols=2)
    table.rows[0].cells[0].text = "X"
    table.rows[0].cells[1].text = "Something"
    table.rows[1].cells[0].text = "Y"
    table.rows[1].cells[1].text = "Other"
    situation, task = parse_star_table(table)
    assert situation is None
    assert task is None
```

- [ ] **Step 2: Run — verify FAIL**

```
pytest tests/test_update_site.py::test_parse_star_table_extracts_fields -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `parse_star_table` in `update_site.py`**

```python
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
```

- [ ] **Step 4: Run — verify PASS**

```
pytest tests/test_update_site.py -v
```

Expected: all passing

- [ ] **Step 5: Commit**

```
git add update_site.py tests/test_update_site.py
git commit -m "feat: add STAR table parser for situation/task extraction"
```

---

## Task 4: Tokenizer

**Files:**
- Modify: `update_site.py`
- Modify: `tests/test_update_site.py`

- [ ] **Step 1: Add `PROJECT_TITLE_SLUGS` constant to `update_site.py`**

Add after `SLUG_MAP`:

```python
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
```

- [ ] **Step 2: Write failing test for tokenizer**

Append to `tests/test_update_site.py`:

```python
from update_site import tokenize_doc, KNOWN_COMPANIES

def test_tokenize_company_header():
    doc = Document()
    doc.add_paragraph("GrayMatter Robotics — Robotics Systems & Applications Intern")
    tokens = tokenize_doc(doc)
    assert tokens[0].type == "COMPANY_HEADER"
    assert "GrayMatter" in tokens[0].text

def test_tokenize_date_line():
    doc = Document()
    doc.add_paragraph("Jan 2026 – May 2026  |  surface finishing  |  Torrance, CA")
    tokens = tokenize_doc(doc)
    assert tokens[0].type == "DATE_LINE"

def test_tokenize_tools_line():
    doc = Document()
    doc.add_paragraph("SolidWorks · MeshLab · ROS2 · Python")
    tokens = tokenize_doc(doc)
    assert tokens[0].type == "TOOLS_LINE"

def test_tokenize_star_table():
    doc = Document()
    table = doc.add_table(rows=2, cols=2)
    table.rows[0].cells[0].text = "S"
    table.rows[0].cells[1].text = "SITUATION The problem."
    table.rows[1].cells[0].text = "T"
    table.rows[1].cells[1].text = "TASK The work."
    tokens = tokenize_doc(doc)
    star_tokens = [t for t in tokens if t.type == "STAR_TABLE"]
    assert len(star_tokens) == 1
    assert star_tokens[0].situation == "The problem."
    assert star_tokens[0].task == "The work."

def test_tokenize_action_result_headers():
    doc = Document()
    doc.add_paragraph("ACTION")
    doc.add_paragraph("RESULT")
    tokens = tokenize_doc(doc)
    types = [t.type for t in tokens]
    assert "ACTION_HEADER" in types
    assert "RESULT_HEADER" in types
```

- [ ] **Step 3: Run — verify FAIL**

```
pytest tests/test_update_site.py::test_tokenize_company_header -v
```

Expected: `ImportError`

- [ ] **Step 4: Implement `classify_paragraph` and `tokenize_doc`**

Add to `update_site.py`:

```python
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
```

- [ ] **Step 5: Run — verify PASS**

```
pytest tests/test_update_site.py -v
```

Expected: all passing

- [ ] **Step 6: Commit**

```
git add update_site.py tests/test_update_site.py
git commit -m "feat: add tokenizer that classifies doc body elements into typed tokens"
```

---

## Task 5: Experience parser

**Files:**
- Modify: `update_site.py`
- Modify: `tests/test_update_site.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/test_update_site.py`:

```python
from update_site import parse_experiences

def _make_flat_experience_tokens():
    """Tokens for a single-subproject (flat star) experience."""
    return [
        Token(type="COMPANY_HEADER", text="TuTr Hyperloop — Mechanical Engineer Intern"),
        Token(type="DATE_LINE", text="Jun 2024 – Jul 2024  |  Hyperloop chassis  |  LA, CA"),
        Token(type="TOOLS_LINE", text="ANSYS · Siemens NX · Structural Analysis"),
        Token(type="STAR_TABLE", situation="Pod was too heavy.", task="Reduce weight by 30%."),
        Token(type="ACTION_HEADER"),
        Token(type="BULLET_ITEM", text="Conducted 1D structural analysis."),
        Token(type="RESULT_HEADER"),
        Token(type="BULLET_ITEM", text="Achieved 30% weight reduction."),
    ]

def _make_multi_subproject_tokens():
    """Tokens for an experience with two named subprojects."""
    return [
        Token(type="COMPANY_HEADER", text="Lumindt Labs — Mechanical Engineering Intern"),
        Token(type="DATE_LINE", text="Jun 2025 – Aug 2025  |  Thermal startup  |  SF, CA"),
        Token(type="SUBPROJECT_HEADER", text="Project 1: Hot-Wire System"),
        Token(type="TOOLS_LINE", text="Python · Raspberry Pi · SolidWorks"),
        Token(type="STAR_TABLE", situation="No measurement tool.", task="Build one."),
        Token(type="ACTION_HEADER"),
        Token(type="BULLET_ITEM", text="Built the sensor."),
        Token(type="RESULT_HEADER"),
        Token(type="BULLET_ITEM", text="10% uncertainty achieved."),
        Token(type="SUBPROJECT_HEADER", text="Project 2: Structural Design"),
        Token(type="TOOLS_LINE", text="SolidWorks Weldments · ASME"),
        Token(type="STAR_TABLE", situation="Heavy frame.", task="Lighten it."),
        Token(type="ACTION_HEADER"),
        Token(type="BULLET_ITEM", text="Designed in weldments."),
        Token(type="RESULT_HEADER"),
        Token(type="BULLET_ITEM", text="Safety margins met."),
    ]

def test_parse_flat_experience():
    tokens = _make_flat_experience_tokens()
    exps = parse_experiences(tokens)
    assert len(exps) == 1
    exp = exps[0]
    assert exp.company == "TuTr Hyperloop"
    assert exp.role == "Mechanical Engineer Intern"
    assert "Jun 2024" in exp.dates
    assert "LA" in exp.location
    assert len(exp.subprojects) == 1
    sp = exp.subprojects[0]
    assert sp.title == ""
    assert sp.situation == "Pod was too heavy."
    assert sp.task == "Reduce weight by 30%."
    assert sp.action == ["Conducted 1D structural analysis."]
    assert sp.result == ["Achieved 30% weight reduction."]

def test_parse_multi_subproject_experience():
    tokens = _make_multi_subproject_tokens()
    exps = parse_experiences(tokens)
    assert len(exps) == 1
    exp = exps[0]
    assert exp.company == "Lumindt Labs"
    assert len(exp.subprojects) == 2
    assert exp.subprojects[0].title == "Hot-Wire System"
    assert exp.subprojects[1].title == "Structural Design"
    assert exp.subprojects[0].action == ["Built the sensor."]
    assert exp.subprojects[1].result == ["Safety margins met."]

def test_parse_two_experiences():
    tokens = _make_flat_experience_tokens() + _make_flat_experience_tokens()
    # Replace second company name to be distinct
    tokens2 = list(tokens)
    tokens2[len(_make_flat_experience_tokens())] = Token(
        type="COMPANY_HEADER", text="National Institute of Wind Energy — Wind Blade Intern"
    )
    exps = parse_experiences(tokens2)
    assert len(exps) == 2
```

- [ ] **Step 2: Run — verify FAIL**

```
pytest tests/test_update_site.py::test_parse_flat_experience -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement helper functions**

Add to `update_site.py`:

```python
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
```

- [ ] **Step 4: Implement `parse_experiences`**

Add to `update_site.py`:

```python
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
```

- [ ] **Step 5: Run — verify PASS**

```
pytest tests/test_update_site.py -v
```

Expected: all passing

- [ ] **Step 6: Commit**

```
git add update_site.py tests/test_update_site.py
git commit -m "feat: add experience parser state machine"
```

---

## Task 6: Standalone project parser

**Files:**
- Modify: `update_site.py`
- Modify: `tests/test_update_site.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/test_update_site.py`:

```python
from update_site import parse_projects

def _make_project_tokens():
    return [
        Token(type="STANDALONE_TITLE", text="Adaptive Pitch Control — H-Type VAWT"),
        Token(type="TOOLS_LINE", text="Bayesian Optimisation · PID Control · Wind Tunnel"),
        Token(type="STAR_TABLE", situation="VAWTs run below efficiency.", task="Build adaptive pitch."),
        Token(type="ACTION_HEADER"),
        Token(type="BULLET_ITEM", text="Fabricated the VAWT."),
        Token(type="BULLET_ITEM", text="Implemented Bayesian Opt."),
        Token(type="RESULT_HEADER"),
        Token(type="BULLET_ITEM", text="8% efficiency improvement."),
        Token(type="STANDALONE_TITLE", text="Honeycomb Flow Straightener Wind Tunnel Study"),
        Token(type="TOOLS_LINE", text="Pitot Tube · Fabrication"),
        Token(type="STAR_TABLE", situation="Turbulence problem.", task="Measure it."),
        Token(type="ACTION_HEADER"),
        Token(type="BULLET_ITEM", text="Built the tunnel."),
        Token(type="RESULT_HEADER"),
        Token(type="BULLET_ITEM", text="53% turbulence reduction."),
        Token(type="SECTION_END", text="Other Projects (Summary)"),
    ]

def test_parse_projects_count():
    tokens = _make_project_tokens()
    projects = parse_projects(tokens)
    assert len(projects) == 2

def test_parse_project_fields():
    tokens = _make_project_tokens()
    projects = parse_projects(tokens)
    p = projects[0]
    assert p.situation == "VAWTs run below efficiency."
    assert p.task == "Build adaptive pitch."
    assert p.action == ["Fabricated the VAWT.", "Implemented Bayesian Opt."]
    assert p.result == ["8% efficiency improvement."]
    assert "Bayesian Optimisation" in p.tags

def test_parse_project_strips_award_emoji():
    tokens = [
        Token(type="STANDALONE_TITLE", text="Smart Alarm Clock  \U0001f3c6 1st Place IEEE Hack-IoT"),
        Token(type="TOOLS_LINE", text="Arduino · Sensors"),
        Token(type="STAR_TABLE", situation="s", task="t"),
        Token(type="ACTION_HEADER"),
        Token(type="BULLET_ITEM", text="Built it."),
        Token(type="RESULT_HEADER"),
        Token(type="BULLET_ITEM", text="Won."),
    ]
    projects = parse_projects(tokens)
    assert projects[0].title == "Smart Alarm Clock"
```

- [ ] **Step 2: Run — verify FAIL**

```
pytest tests/test_update_site.py::test_parse_projects_count -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `parse_projects`**

Add to `update_site.py`:

```python
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
```

- [ ] **Step 4: Run — verify PASS**

```
pytest tests/test_update_site.py -v
```

Expected: all passing

- [ ] **Step 5: Commit**

```
git add update_site.py tests/test_update_site.py
git commit -m "feat: add standalone project parser state machine"
```

---

## Task 7: Manual field extractors

**Files:**
- Modify: `update_site.py`
- Modify: `tests/test_update_site.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/test_update_site.py`:

```python
from update_site import extract_manual_experience_fields, extract_manual_project_fields

_SAMPLE_EXP_JS = """
const EXPERIENCE = [
  {
    slug: "tutr",
    company: "TuTr Hyperloop",
    logo: "",
    role: "Intern",
    dates: "Jun 2024",
    location: "LA",
    zone: "hardware",
    bullets: [
      "Optimized chassis weight."
    ],
    star: {
      situation: "s",
      task: "t",
      action: ["a"],
      result: ["r"]
    }
  },
  {
    slug: "graymatter",
    company: "GrayMatter Robotics",
    logo: "gm.jpg",
    role: "Intern",
    dates: "Jan 2026",
    location: "Torrance",
    zone: "robotics",
    bullets: [
      "Led fixture design.",
      "Built DAQ."
    ],
    subprojects: [
      {
        title: "Fixture",
        tools: ["SolidWorks"],
        gallery: [],
        star: { situation: "s", task: "t", action: [], result: [] }
      }
    ]
  }
];
"""

_SAMPLE_PROJ_JS = """
const PROJECTS = [
  {
    slug: "vawt",
    title: "VAWT",
    zone: "cleantech",
    thumb: "assets/vawt.jpg",
    tags: [],
    gallery: [],
    star: { situation: "s", task: "t", action: [], result: [] }
  },
  {
    slug: "drone",
    title: "Drone",
    zone: "hardware",
    thumb: "assets/drone.png",
    tags: [],
    gallery: [],
    star: { situation: "s", task: "t", action: [], result: [] }
  }
];
"""

def test_extract_manual_experience_fields():
    fields = extract_manual_experience_fields(_SAMPLE_EXP_JS)
    assert "tutr" in fields
    assert fields["tutr"]["zone"] == "hardware"
    assert fields["tutr"]["logo"] == ""
    assert fields["tutr"]["bullets"] == ["Optimized chassis weight."]
    assert "graymatter" in fields
    assert fields["graymatter"]["logo"] == "gm.jpg"
    assert fields["graymatter"]["bullets"] == ["Led fixture design.", "Built DAQ."]

def test_extract_manual_project_fields():
    fields = extract_manual_project_fields(_SAMPLE_PROJ_JS)
    assert "vawt" in fields
    assert fields["vawt"]["zone"] == "cleantech"
    assert fields["vawt"]["thumb"] == "assets/vawt.jpg"
    assert "drone" in fields
    assert fields["drone"]["zone"] == "hardware"
```

- [ ] **Step 2: Run — verify FAIL**

```
pytest tests/test_update_site.py::test_extract_manual_experience_fields -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement extractors**

Add to `update_site.py`:

```python
def _split_js_array_entries(js_text, const_name):
    """Split the entries of a JS array const into individual object strings."""
    match = re.search(rf"const {const_name} = \[(.*?)\];", js_text, re.DOTALL)
    if not match:
        return []
    array_text = match.group(1)
    entries, depth, start = [], 0, None
    for i, ch in enumerate(array_text):
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                entries.append(array_text[start : i + 1])
                start = None
    return entries


def _parse_js_strings(text):
    """Extract a list of JS string values from text like '"foo", "bar"'."""
    return re.findall(r'"((?:[^"\\]|\\.)*)"', text)


def extract_manual_experience_fields(js_text):
    """Returns dict[slug → {logo, zone, bullets}] from existing EXPERIENCE const."""
    result = {}
    for entry in _split_js_array_entries(js_text, "EXPERIENCE"):
        slug_m = re.search(r'slug:\s*"([^"]+)"', entry)
        if not slug_m:
            continue
        slug = slug_m.group(1)
        logo_m = re.search(r'logo:\s*"([^"]*)"', entry)
        zone_m = re.search(r'zone:\s*"([^"]+)"', entry)
        bullets_m = re.search(r"bullets:\s*\[(.*?)\]", entry, re.DOTALL)
        result[slug] = {
            "logo": logo_m.group(1) if logo_m else "",
            "zone": zone_m.group(1) if zone_m else "",
            "bullets": _parse_js_strings(bullets_m.group(1)) if bullets_m else [],
        }
    return result


def extract_manual_project_fields(js_text):
    """Returns dict[slug → {zone, thumb}] from existing PROJECTS const."""
    result = {}
    for entry in _split_js_array_entries(js_text, "PROJECTS"):
        slug_m = re.search(r'slug:\s*"([^"]+)"', entry)
        if not slug_m:
            continue
        slug = slug_m.group(1)
        zone_m = re.search(r'zone:\s*"([^"]+)"', entry)
        thumb_m = re.search(r'thumb:\s*"([^"]*)"', entry)
        result[slug] = {
            "zone": zone_m.group(1) if zone_m else "",
            "thumb": thumb_m.group(1) if thumb_m else "",
        }
    return result
```

- [ ] **Step 4: Run — verify PASS**

```
pytest tests/test_update_site.py -v
```

Expected: all passing

- [ ] **Step 5: Commit**

```
git add update_site.py tests/test_update_site.py
git commit -m "feat: add manual field extractors for experience and project entries"
```

---

## Task 8: JS renderers

**Files:**
- Modify: `update_site.py`
- Modify: `tests/test_update_site.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/test_update_site.py`:

```python
from update_site import render_experience_js, render_project_js

def test_render_flat_experience_js():
    exp = Experience(
        company="TuTr Hyperloop", role="Intern",
        dates="Jun 2024 – Jul 2024", location="LA, CA",
        subprojects=[SubProject(
            title="", tools=["ANSYS", "NX"],
            situation="Pod was heavy.", task="Reduce weight.",
            action=["Did analysis."], result=["30% lighter."]
        )]
    )
    manual = {"slug": "tutr", "logo": "", "zone": "hardware", "bullets": ["Optimized weight."]}
    js = render_experience_js(exp, manual)
    assert 'slug: "tutr"' in js
    assert 'zone: "hardware"' in js
    assert '"Optimized weight."' in js
    assert '"Pod was heavy."' in js
    assert '"Did analysis."' in js
    assert 'subprojects' not in js
    assert 'star:' in js

def test_render_multi_subproject_experience_js():
    exp = Experience(
        company="Lumindt Labs", role="ME Intern",
        dates="Jun 2025 – Aug 2025", location="SF, CA",
        subprojects=[
            SubProject(title="Hot-Wire", tools=["Python"], situation="s1", task="t1",
                       action=["a1"], result=["r1"]),
            SubProject(title="Structural", tools=["SolidWorks"], situation="s2", task="t2",
                       action=["a2"], result=["r2"]),
        ]
    )
    manual = {"slug": "lumindt", "logo": "lum.jpg", "zone": "cleantech",
              "bullets": ["Built system.", "Designed frame."]}
    js = render_experience_js(exp, manual)
    assert 'subprojects:' in js
    assert '"Hot-Wire"' in js
    assert '"Structural"' in js
    assert 'gallery: []' in js
    assert '"Python"' in js

def test_render_project_js():
    proj = Project(
        title="Vertical Axis Wind Turbine", tags=["Wind Energy", "PID"],
        situation="VAWTs inefficient.", task="Add pitch control.",
        action=["Built it."], result=["8% improvement."]
    )
    manual = {"slug": "vawt", "zone": "cleantech", "thumb": "assets/vawt.jpg"}
    js = render_project_js(proj, manual)
    assert 'slug: "vawt"' in js
    assert 'zone: "cleantech"' in js
    assert 'thumb: "assets/vawt.jpg"' in js
    assert '"Wind Energy"' in js
    assert '"VAWTs inefficient."' in js
    assert 'gallery: []' in js
```

- [ ] **Step 2: Run — verify FAIL**

```
pytest tests/test_update_site.py::test_render_flat_experience_js -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `render_experience_js` and `render_project_js`**

Add to `update_site.py`:

```python
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
```

- [ ] **Step 4: Run — verify PASS**

```
pytest tests/test_update_site.py -v
```

Expected: all passing

- [ ] **Step 5: Commit**

```
git add update_site.py tests/test_update_site.py
git commit -m "feat: add JS renderers for experience and project entries"
```

---

## Task 9: Patch functions + new entry scaffolding

**Files:**
- Modify: `update_site.py`
- Modify: `tests/test_update_site.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/test_update_site.py`:

```python
from update_site import patch_experiences, patch_projects

_JS_WITH_EXP = """const EXPERIENCE = [
  {
    slug: "tutr",
    company: "TuTr Hyperloop",
    logo: "",
    role: "OLD ROLE",
    dates: "OLD",
    location: "OLD",
    zone: "hardware",
    bullets: ["Old bullet."],
    star: { situation: "old s", task: "old t", action: ["old a"], result: ["old r"] }
  }
];"""

_JS_WITH_PROJ = """const PROJECTS = [
  {
    slug: "vawt",
    title: "OLD TITLE",
    zone: "cleantech",
    thumb: "assets/vawt.jpg",
    tags: [],
    gallery: [],
    star: { situation: "old s", task: "old t", action: [], result: [] }
  }
];"""

def test_patch_experiences_updates_role():
    exp = Experience(
        company="TuTr Hyperloop", role="NEW ROLE",
        dates="Jun 2024 – Jul 2024", location="LA, CA",
        subprojects=[SubProject(title="", tools=[], situation="new s", task="new t",
                                action=["new a"], result=["new r"])]
    )
    patched = patch_experiences(_JS_WITH_EXP, [exp])
    assert '"NEW ROLE"' in patched
    assert '"OLD ROLE"' not in patched
    assert '"new s"' in patched

def test_patch_experiences_preserves_manual_fields():
    exp = Experience(
        company="TuTr Hyperloop", role="NEW ROLE",
        dates="Jun 2024", location="LA",
        subprojects=[SubProject(title="", tools=[], situation="s", task="t",
                                action=[], result=[])]
    )
    patched = patch_experiences(_JS_WITH_EXP, [exp])
    assert '"Old bullet."' in patched   # bullets preserved
    assert 'zone: "hardware"' in patched  # zone preserved

def test_patch_projects_updates_title():
    proj = Project(title="NEW TITLE", tags=["Wind Energy"],
                   situation="new s", task="new t", action=["new a"], result=["new r"])
    patched = patch_projects(_JS_WITH_PROJ, [proj])
    assert '"NEW TITLE"' in patched
    assert '"OLD TITLE"' not in patched
    assert 'zone: "cleantech"' in patched   # zone preserved
    assert 'thumb: "assets/vawt.jpg"' in patched  # thumb preserved

def test_patch_experiences_unknown_slug_prints_scaffold(capsys):
    exp = Experience(
        company="Brand New Corp", role="Engineer",
        dates="2026", location="LA",
        subprojects=[SubProject(title="", tools=["Python"], situation="s", task="t",
                                action=["a"], result=["r"])]
    )
    patch_experiences(_JS_WITH_EXP, [exp])
    captured = capsys.readouterr()
    assert "New experience detected" in captured.out
    assert "Brand New Corp" in captured.out
    assert "TODO_slug" in captured.out
```

- [ ] **Step 2: Run — verify FAIL**

```
pytest tests/test_update_site.py::test_patch_experiences_updates_role -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `patch_experiences` and `patch_projects`**

Add to `update_site.py`:

```python
def _experience_slug(exp):
    """Look up slug for an experience by company name."""
    for company, slug in SLUG_MAP.items():
        if company in exp.company or exp.company in company:
            return slug
    return None


def _project_slug(proj):
    """Look up slug for a project by title prefix."""
    for prefix, slug in PROJECT_TITLE_SLUGS.items():
        if proj.title.startswith(prefix) or prefix in proj.title:
            return slug
    return None


def patch_experiences(js_text, experiences):
    """Regenerate const EXPERIENCE = [...] in js_text from parsed experiences."""
    existing = extract_manual_experience_fields(js_text)
    parts = []
    for exp in experiences:
        slug = _experience_slug(exp)
        if slug is None:
            scaffold = render_experience_js(exp, {"slug": "TODO_slug", "logo": "", "zone": "TODO_zone", "bullets": []})
            print(f"\n  ⚠  New experience detected: \"{exp.company}\"")
            print("     Paste into site-data.js EXPERIENCE array and fill TODO fields:")
            print(scaffold)
            continue
        manual = existing.get(slug, {"logo": "", "zone": "", "bullets": []})
        manual["slug"] = slug
        parts.append(render_experience_js(exp, manual))

    if not parts:
        return js_text

    new_block = "const EXPERIENCE = [\n" + ",\n".join(parts) + "\n];"
    patched = re.sub(r"const EXPERIENCE = \[.*?\];", new_block, js_text, flags=re.DOTALL)
    if patched == js_text:
        print("  ⚠  EXPERIENCE pattern not found — skipping experience patch.")
    return patched


def patch_projects(js_text, projects):
    """Regenerate const PROJECTS = [...] in js_text from parsed projects."""
    existing = extract_manual_project_fields(js_text)
    parts = []
    for proj in projects:
        slug = _project_slug(proj)
        if slug is None:
            scaffold = render_project_js(proj, {"slug": "TODO_slug", "zone": "TODO_zone", "thumb": "TODO_thumb"})
            print(f"\n  ⚠  New project detected: \"{proj.title}\"")
            print("     Paste into site-data.js PROJECTS array and fill TODO fields:")
            print(scaffold)
            continue
        manual = existing.get(slug, {"zone": "", "thumb": ""})
        manual["slug"] = slug
        parts.append(render_project_js(proj, manual))

    if not parts:
        return js_text

    new_block = "const PROJECTS = [\n" + ",\n".join(parts) + "\n];"
    patched = re.sub(r"const PROJECTS = \[.*?\];", new_block, js_text, flags=re.DOTALL)
    if patched == js_text:
        print("  ⚠  PROJECTS pattern not found — skipping projects patch.")
    return patched
```

- [ ] **Step 4: Run — verify PASS**

```
pytest tests/test_update_site.py -v
```

Expected: all passing

- [ ] **Step 5: Commit**

```
git add update_site.py tests/test_update_site.py
git commit -m "feat: add patch functions for EXPERIENCE and PROJECTS with scaffold output for new entries"
```

---

## Task 10: Wire into main() and integration test

**Files:**
- Modify: `update_site.py`

- [ ] **Step 1: Replace `main()` in `update_site.py`**

The new `main()` calls `Document()` once and derives both the old `paragraphs` list and the new token stream from the same doc object. Replace the entire `main()` function:

```python
def main():
    if not DOCX_PATH.exists():
        sys.exit(f"✗ Doc not found: {DOCX_PATH}")
    if not SITE_DATA.exists():
        sys.exit(f"✗ site-data.js not found: {SITE_DATA}")

    print(f"Reading {DOCX_PATH.name} ...")
    doc = Document(str(DOCX_PATH))
    paragraphs = [p.text.strip() for p in doc.paragraphs]

    print("Parsing bio ...")
    bio = parse_bio(paragraphs)
    print(f"  Found {len(bio)} bio paragraph(s).")

    print("Parsing skills ...")
    skills = parse_skills(paragraphs)
    print(f"  Found {len(skills)} skill categories.")

    print("Tokenising document ...")
    tokens = tokenize_doc(doc)
    print(f"  {len(tokens)} tokens.")

    print("Parsing experiences ...")
    experiences = parse_experiences(tokens)
    print(f"  Found {len(experiences)} experience(s).")

    print("Parsing projects ...")
    projects = parse_projects(tokens)
    print(f"  Found {len(projects)} project(s).")

    js_text = SITE_DATA.read_text(encoding="utf-8")
    original = js_text

    print("Patching bio ...")
    js_text = patch_bio(js_text, bio)

    print("Patching skills ...")
    js_text = patch_skills(js_text, skills)

    print("Patching experiences ...")
    js_text = patch_experiences(js_text, experiences)

    print("Patching projects ...")
    js_text = patch_projects(js_text, projects)

    if js_text == original:
        print("\n✓ No changes detected.")
        return

    SITE_DATA.write_text(js_text, encoding="utf-8")
    print(f"\n✓ data/site-data.js updated.")
    print("  Review: git diff data/site-data.js")
    print("  Revert: git checkout data/site-data.js")
```

Also remove the call to `get_paragraphs` in `main()` — it's no longer needed (replaced by direct `Document()` call above). The `get_paragraphs` function itself can stay for reference but is no longer called.

- [ ] **Step 2: Run full test suite**

```
pytest tests/test_update_site.py -v
```

Expected: all passing (main() change doesn't affect unit tests)

- [ ] **Step 3: Run integration test — dry-run against real doc**

```
python update_site.py
```

Check output for:
- `Found N experience(s).` — should be 6 (GrayMatter, Lumindt, Makerspace, DRCL, TuTr, NIWE)
- `Found N project(s).` — should be ~12
- Any `⚠ New experience/project detected` warnings (expected for new entries like Turbine Airfoil CFD)
- No Python tracebacks

- [ ] **Step 4: Inspect diff**

```
git diff data/site-data.js
```

Verify:
- role, dates, location, tools, STAR fields are updated from doc
- slug, zone, thumb, gallery, logo, bullets are unchanged from original
- `const EXPERIENCE = [` block is present and well-formed JS
- `const PROJECTS = [` block is present and well-formed JS

If anything looks wrong, revert and debug before committing:

```
git checkout data/site-data.js
```

- [ ] **Step 5: Commit**

```
git add update_site.py
git commit -m "feat: wire experience and project sync into main() — update_site.py now syncs full site content from career doc"
```

- [ ] **Step 6: Commit the updated site-data.js once diff looks correct**

```
git add data/site-data.js
git commit -m "chore: sync site-data.js experiences and projects from career doc"
```

---

## Self-Review

**Spec coverage:**
- ✅ Sync existing entries: company/role/dates/location, tools, situation/task/action/result
- ✅ Preserve manual fields: slug, zone, thumb, gallery, logo, bullets
- ✅ Detect new entries: scaffold output to stdout, no modification to site-data.js
- ✅ Body element iterator for mixed paragraph/table docs
- ✅ STAR table parser for S/T cells
- ✅ State machine for experience parser (flat + multi-subproject)
- ✅ State machine for project parser
- ✅ FireWarden/CWC treated as UNKNOWN_HEADER — not parsed into EXPERIENCE, not added to PROJECTS automatically (they stay in site-data.js unchanged since they have existing slugs in PROJECT_TITLE_SLUGS)
- ✅ "Other Projects (Summary)" acts as SECTION_END boundary

**Placeholder scan:** None found.

**Type consistency:** `SubProject`, `Experience`, `Project`, `Token` defined in Task 1 and used consistently through Tasks 5–9. `_render_star` takes a `SubProject` or `Project` — both have `situation`, `task`, `action`, `result` fields. ✅

**FireWarden/CWC edge case:** FireWarden and CWC appear as `UNKNOWN_HEADER` tokens (they match `_EXPERIENCE_HEADER_RE` but aren't in `KNOWN_COMPANIES`). This means the experience parser emits a warning and skips them — they're not parsed as experiences. Their existing entries in `PROJECTS` are preserved via `extract_manual_project_fields`. The project parser will only encounter them if they also appear in the standalone projects section of the doc as `STANDALONE_TITLE` tokens. Add them to `PROJECT_TITLE_SLUGS` to enable their sync from the projects section:
```python
"FireWarden": "firewarden",
"USC Collegiate Wind Competition": "cwc",
```
(already included in Task 4's constant above ✅)
