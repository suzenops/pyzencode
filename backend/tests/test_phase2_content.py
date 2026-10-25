"""Trusted development checks; learner code is never executed by API endpoints."""
import json
import runpy
from pathlib import Path
import pytest
ROOT = Path(__file__).resolve().parents[2]
CONTENT = json.loads((ROOT / 'shared/phase2-content.json').read_text())
SOLUTIONS = json.loads((ROOT / 'frontend/tests/fixtures/phase2-solutions.json').read_text())
HELPER = runpy.run_path(str(ROOT / 'frontend/public/execution.py'))
EXERCISES = [e for lesson in CONTENT for e in lesson['exercises']]

@pytest.mark.parametrize('exercise', EXERCISES, ids=lambda e: e['id'])
def test_real_python_solutions_and_changed_data(exercise):
    e = exercise
    result = json.loads(HELPER['execute_request'](SOLUTIONS[e['id']], {
        'observe': [v['name'] for v in e['variables']],
        'inputs': e.get('inputs', []), 'cases': e['cases'],
    }))
    assert 'error' not in result, result
    assert result['stdout'].rstrip('\n') == e['expected']
    for v in e['variables']:
        assert result['variables'][v['name']] == {'type': v['type'], 'value': v['value']}
    assert len(result['caseResults']) == len(e['cases'])
    for expected, actual in zip(e['cases'], result['caseResults']):
        assert 'error' not in actual['result'], actual
        assert actual['result']['stdout'].rstrip('\n') == expected['expected']

@pytest.mark.parametrize('lesson', CONTENT, ids=lambda l: l['id'])
def test_reading_examples_execute(lesson):
    for section in lesson['sections']:
        result = HELPER['execute_student'](section['code'], inputs=['Ada'])
        assert 'error' not in result, (section['id'], result)
        assert result['stdout'].rstrip('\n') == section['output']
        assert len(section['breakdown']) == len(section['code'].splitlines())

def test_prepared_input_consumption_exhaustion_and_isolation():
    execute = HELPER['execute_student']
    result = execute('print(input("Name: "))\nprint(int(input()) + 1)', inputs=['Ada', '20'])
    assert result['stdout'] == 'Name: Ada\n21\n'
    exhausted = execute('input()')
    assert exhausted['error']['type'] == 'EOFError'
    assert 'prepared input' in exhausted['error']['message']
    assert execute('print(input())', inputs=['fresh'])['stdout'] == 'fresh\n'
    assert execute('int(input())', inputs=['oops'])['error']['type'] == 'ValueError'

def test_shared_modules_and_prerequisites_match_api():
    from fastapi.testclient import TestClient
    from app.main import app
    data = TestClient(app).get('/api/v1/curriculum').json()
    assert data['modules'] == json.loads((ROOT / 'shared/modules.json').read_text())
    metadata = {l['id']: l for l in data['available_lessons']}
    for lesson in CONTENT:
        assert metadata[lesson['id']]['prerequisite'] == lesson['prerequisite']
    assert TestClient(app).post('/api/execute', json={'code':'print(1)'}).status_code == 404
