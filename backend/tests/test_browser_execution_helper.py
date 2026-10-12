"""Trusted local test cases for the same helper shipped to the browser worker."""
import json
import runpy
from pathlib import Path
import pytest
HELPER=runpy.run_path(str(Path(__file__).resolve().parents[2]/"frontend/public/execution.py"))
SOLUTIONS=[
 'age: int = 20\nprint(age)',
 'student_name = "Al" + "ex"\nprint(student_name)',
 'hours, grade = (5 + 5, 185 / 2)\nprint(hours)\nprint(grade)',
 'language = "Python"\nprint("I am learning " + language)',
 'score = 50\nscore += 30\nprint(score)',
 'study_hours = 10\nprint(study_hours)',
 'city = "New York"\nprint(city)',
 'price = 19.99\nkind = type(price)\nprint(kind)',
 'monday_hours = 3\ntuesday_hours = 4\ntotal_hours = sum((monday_hours,tuesday_hours))\nprint(total_hours)',
 'student_name = "Alex"\nage = 20\ncourse = "Python"\nstudy_hours = 10\nprint("Student:",student_name)\nprint("Age:",age)\nprint("Course:",course)\nprint("Study hours:",study_hours)',
]
EXPECTED=['20','Alex','10\n92.5','I am learning Python','80','10','New York',"<class 'float'>",'7','Student: Alex\nAge: 20\nCourse: Python\nStudy hours: 10']
OBSERVED=[['age'],['student_name'],['hours','grade'],['language'],['score'],['study_hours'],['city'],['price'],['monday_hours','tuesday_hours','total_hours'],['student_name','age','course','study_hours']]
OVERRIDES=[{'age':21},{'student_name':'Morgan'},{'hours':12,'grade':88.5},{'language':'Rust'},{'score':81},{'study_hours':12},{'city':'Boston'},{'price':'sample'},{'monday_hours':5,'tuesday_hours':6},{'student_name':'Morgan','age':21,'course':'Rust','study_hours':12}]
CHANGED=['21','Morgan','12\n88.5','I am learning Rust','81','12','Boston',"<class 'str'>",'11','Student: Morgan\nAge: 21\nCourse: Rust\nStudy hours: 12']
@pytest.mark.parametrize('index',range(10))
def test_actual_baseline_and_changed_value_execution(index):
    result=json.loads(HELPER['execute_request'](SOLUTIONS[index],{'observe':OBSERVED[index],'cases':[{'name':'changes','overrides':OVERRIDES[index]}]}))
    assert not result.get('error')
    assert result['stdout']==EXPECTED[index]+'\n'
    assert result['caseResults'][0]['result']['stdout']==CHANGED[index]+'\n'
    assert all(name in result['variables'] for name in OBSERVED[index])

def test_update_history_and_repeated_source_order():
    result=HELPER['execute_student'](SOLUTIONS[4],['score'])
    assert [v['value'] for v in result['assignments']['score']]==['50','80']

def test_equivalent_named_expression_and_alias():
    result=json.loads(HELPER['execute_request']('print(age := 20)',{'observe':['age'],'cases':[{'name':'change','overrides':{'age':21}}]}))
    assert result['stdout']=='20\n'
    assert result['caseResults'][0]['result']['stdout']=='21\n'
    alias=json.loads(HELPER['execute_request']('age = 20\ncopy = age\nprint(copy)',{'observe':['age'],'cases':[{'name':'change','overrides':{'age':21}}]}))
    assert alias['caseResults'][0]['result']['stdout']=='21\n'

def test_hardcoded_output_does_not_follow_variables():
    result=json.loads(HELPER['execute_request']('language = "Python"\nprint("I am learning Python")',{'observe':['language'],'cases':[{'name':'change','overrides':{'language':'Rust'}}]}))
    assert result['caseResults'][0]['result']['stdout']!='I am learning Rust\n'

@pytest.mark.parametrize(('source','kind','line'),[('print(hours)','NameError',1),('hours=10\nprint(Hours)','NameError',2),('2hours=10','SyntaxError',1),('study hours=10','SyntaxError',1),('name=Alex','NameError',1),('hours=10\nprint("Hours: " + hours)','TypeError',2)])
def test_real_errors_retain_original_lines(source,kind,line):
    result=HELPER['execute_student'](source,['hours','name'])
    assert result['error']['type']==kind
    assert result['error']['line']==line

def test_output_capture_still_bounded_and_runs_are_fresh():
    assert HELPER['execute_student']('print("x" * 10000)')['error']['type']=='OutputLimitError'
    assert len(HELPER['execute_student']('print("x" * 10000)')['stdout'])==8192
    HELPER['execute_student']('age=20')
    assert HELPER['execute_student']('print(age)')['error']['type']=='NameError'

def test_actual_type_call_observations_accept_aliases_and_inspect_changed_types():
    options={'observe':['price'],'cases':[{'name':'change','overrides':{'price':'sample'}}]}
    result=json.loads(HELPER['execute_request']('price=19.99\ninspect=type\nprint(inspect(price))',options))
    assert result['typeCalls']==[{'type':'float','value':'19.99'}]
    assert result['caseResults'][0]['result']['typeCalls']==[{'type':'str','value':'sample'}]
    unrelated=json.loads(HELPER['execute_request']('price=19.99\nprint(price.__class__)',options))
    assert unrelated['typeCalls']==[]
