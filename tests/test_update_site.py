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
