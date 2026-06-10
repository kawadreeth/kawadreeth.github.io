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
