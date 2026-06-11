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
