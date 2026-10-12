"""Captured browser execution and observational grading. Not a hostile-code sandbox."""
import ast
import builtins
import contextlib
import io
import json
import traceback

class OutputLimitError(Exception):
    pass

class BoundedText(io.TextIOBase):
    def __init__(self):
        self.parts, self.size = [], 0
    def write(self, text):
        room = max(0, 8192 - self.size)
        self.parts.append(text[:room])
        self.size += len(text[:room])
        if len(text) > room:
            raise OutputLimitError("Output reached the 8,192-character limit. Print less information.")
        return len(text)
    def flush(self):
        pass
    def getvalue(self):
        return "".join(self.parts)

# Preserve original source positions so friendly errors still point to student lines.
class ObserveAssignments(ast.NodeTransformer):
    def __init__(self, names):
        self.names = set(names)
    def _after(self, node, targets):
        names = list(dict.fromkeys(n.id for target in targets for n in ast.walk(target)
                                  if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Store) and n.id in self.names))
        statements = [node]
        for name in names:
            call = ast.Expr(value=ast.Call(func=ast.Name(id="_pyz_record_assignment",ctx=ast.Load()),
                args=[ast.Constant(value=name),ast.Call(func=ast.Name(id="locals",ctx=ast.Load()),args=[],keywords=[])],keywords=[]))
            statements.append(ast.copy_location(call,node))
        return statements
    def visit_Call(self,node):
        self.generic_visit(node)
        if isinstance(node.func,ast.Name) and node.func.id.startswith('_pyz_'):
            return node
        return ast.copy_location(ast.Call(func=ast.Name(id="_pyz_observe_call",ctx=ast.Load()),
            args=[node.func,*node.args],keywords=node.keywords),node)
    def visit_NamedExpr(self,node):
        self.generic_visit(node)
        if node.target.id in self.names:
            node.value=ast.copy_location(ast.Call(func=ast.Name(id="_pyz_record_expression",ctx=ast.Load()),
                args=[ast.Constant(value=node.target.id),node.value],keywords=[]),node.value)
        return node
    def visit_Assign(self,node):
        self.generic_visit(node)
        return self._after(node,node.targets)
    def visit_AnnAssign(self,node):
        self.generic_visit(node)
        return self._after(node,[node.target]) if node.value else node
    def visit_AugAssign(self,node):
        self.generic_visit(node)
        return self._after(node,[node.target])

def _snapshot(value):
    return {"type":type(value).__name__,"value":str(value)[:512]}

def execute_student(source, observed=(), overrides=None):
    overrides = overrides or {}
    out, err = BoundedText(), BoundedText()
    calls, assignments, type_calls, error = [], {}, [], None
    def observed_print(*args,**kwargs):
        if len(calls)>=1000:
            raise OutputLimitError("Too many print calls. Try a smaller program.")
        calls.append({"types":[type(x).__name__ for x in args[:32]],"values":[str(x)[:512] for x in args[:32]]})
        return builtins.print(*args,**kwargs)
    def observe_call(function,/,*args,**kwargs):
        result=function(*args,**kwargs)
        if function is builtins.type and len(args)==1 and len(type_calls)<1000:
            type_calls.append(_snapshot(args[0]))
        return result
    def no_input(*args):
        raise RuntimeError("Interactive input is not supported. Use a value directly in your code.")
    def record_expression(name,value):
        value=overrides.get(name,value)
        history=assignments.setdefault(name,[])
        if len(history)<32:history.append(_snapshot(value))
        return value
    def record(name,local_scope):
        if name in overrides:
            local_scope[name] = overrides[name]
        if name in local_scope:
            history=assignments.setdefault(name,[])
            if len(history)<32:
                history.append(_snapshot(local_scope[name]))
    scope={"__name__":"__main__","__builtins__":dict(vars(builtins),print=observed_print,input=no_input),"_pyz_record_assignment":record,"_pyz_record_expression":record_expression,"_pyz_observe_call":observe_call}
    try:
        with contextlib.redirect_stdout(out),contextlib.redirect_stderr(err):
            tree=ast.parse(source,filename="student.py",mode="exec")
            if observed:
                tree=ObserveAssignments(observed).visit(tree)
                ast.fix_missing_locations(tree)
            exec(compile(tree,"student.py","exec"),scope,scope)
    except BaseException as exception:
        line=getattr(exception,"lineno",None)
        if line is None:
            for frame in traceback.extract_tb(exception.__traceback__):
                if frame.filename=="student.py":line=frame.lineno
        error={"type":type(exception).__name__,"message":str(exception)[:1024],"line":line,
               "traceback":"".join(traceback.format_exception(type(exception),exception,exception.__traceback__))[-4096:]}
    variables={name:_snapshot(value) for name,value in list(scope.items())[:128]
               if not name.startswith('_') and type(value) in (int,float,str,bool)}
    result={"stdout":out.getvalue(),"stderr":err.getvalue(),"prints":calls,"variables":variables,"assignments":assignments,"typeCalls":type_calls}
    if error:result["error"]=error
    return result

def execute_request(source,options):
    observed=options.get('observe',[])
    baseline=execute_student(source,observed)
    if not baseline.get('error') and options.get('cases'):
        baseline['caseResults']=[{"name":case['name'],"result":execute_student(source,observed,case['overrides'])}
                                 for case in options['cases'][:8]]
    return json.dumps(baseline)
