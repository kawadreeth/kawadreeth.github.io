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

from docx import Document
from update_site import iter_body_elements

def test_iter_body_elements_order():
    doc = Document()
    doc.add_paragraph("first")
    doc.add_table(rows=1, cols=1)
    doc.add_paragraph("third")
    elements = list(iter_body_elements(doc))
    kinds = [k for k, _ in elements]
    # new Document() starts with one empty paragraph, then we add: para, table, para
    assert kinds.count("table") == 1
    table_idx = kinds.index("table")
    assert "paragraph" in kinds[:table_idx]
    assert "paragraph" in kinds[table_idx+1:]

def test_iter_body_elements_empty_doc():
    doc = Document()
    # new Document() has one empty paragraph by default
    elements = list(iter_body_elements(doc))
    assert all(k == "paragraph" for k, _ in elements)

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
    doc.add_paragraph("SolidWorks \xb7 MeshLab \xb7 ROS2 \xb7 Python")
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
    tokens2 = list(tokens)
    tokens2[len(_make_flat_experience_tokens())] = Token(
        type="COMPANY_HEADER", text="National Institute of Wind Energy — Wind Blade Intern"
    )
    exps = parse_experiences(tokens2)
    assert len(exps) == 2

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
