import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  phase2Lessons,
  lessons,
  sectionKey,
  lessonPath,
} from "../src/content/lessons";
import metadata from "../../shared/lessons.json";
import { grade } from "../src/execution/grading";
import {
  emptyProgress,
  parseProgress,
  lessonUnlocked,
  lessonComplete,
  continueLearning,
  completeExercise,
  points,
  reconcileCompletion,
} from "../src/progress/store";
import type { ExecutionResult } from "../src/execution/types";
const exercises = phase2Lessons.flatMap((l) => l.exercises);
// Run the actual browser helper in trusted CPython, then feed its observations into the JS grader.
const actual = JSON.parse(
  execFileSync(
    "python3",
    [
      "-c",
      `
import json,runpy
from pathlib import Path
root=Path('..')
helper=runpy.run_path(str(root/'frontend/public/execution.py'))
content=json.loads((root/'shared/phase2-content.json').read_text())
solutions=json.loads(Path('tests/fixtures/phase2-solutions.json').read_text())
results={}
for l in content:
 for e in l['exercises']:
  options={'observe':[v['name'] for v in e['variables']],'inputs':e.get('inputs',[]),'cases':e['cases']}
  source=solutions[e['id']]
  # Keep valid assignments but replace every print expression with fixed output.
  import ast
  class FixedPrint(ast.NodeTransformer):
   def visit_Call(self,node):
    if isinstance(node.func,ast.Name) and node.func.id=='print':
     return ast.copy_location(ast.Call(func=ast.Name(id='print',ctx=ast.Load()),args=[ast.Constant(value=e['expected'])],keywords=[]),node)
    return self.generic_visit(node)
  tree=FixedPrint().visit(ast.parse(source))
  fixed=ast.unparse(ast.fix_missing_locations(tree))
  results[e['id']]={'valid':json.loads(helper['execute_request'](source,options)), 'fixed':json.loads(helper['execute_request'](fixed,options))}
print(json.dumps(results))
`,
    ],
    { encoding: "utf8" },
  ),
) as Record<string, { valid: ExecutionResult; fixed: ExecutionResult }>;

describe("Phase 2 curriculum and actual grading", () => {
  it("shares exact metadata and a five-reading-lesson, ten-question, ten-exercise structure", () => {
    for (const lesson of phase2Lessons) {
      expect(metadata.find((l) => l.id === lesson.id)).toMatchObject({
        prerequisite: lesson.prerequisite,
        number: lesson.number,
        title: lesson.title,
      });
      expect(lesson.sections).toHaveLength(5);
      expect(lesson.quiz).toHaveLength(10);
      expect(lesson.exercises).toHaveLength(10);
      expect(new Set(lesson.exercises.map((e) => e.difficulty))).toEqual(
        new Set(["Beginner", "Intermediate", "Challenge"]),
      );
      expect(lesson.exercises.at(-1)?.assessment).toBe(true);
      for (const q of lesson.quiz) {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
        expect(q.options.every((o) => o.explanation.length > 15)).toBe(true);
      }
    }
  });
  it.each(exercises)("grades real working Python for $id", (exercise) => {
    expect(grade(exercise, actual[exercise.id].valid).passed).toBe(true);
    expect(grade(exercise, actual[exercise.id].fixed).passed).toBe(false);
    expect(
      grade(exercise, { ...actual[exercise.id].valid, stdout: "wrong" }).passed,
    ).toBe(false);
  });
  it("preserves legacy completion and unlocks each new unit only after its predecessor", () => {
    let p = reconcileCompletion({
      ...emptyProgress(),
      completedLessons: ["first-program", "variables"],
      completed: ["lab-1"],
      drafts: { "lab-1": "legacy draft" },
    });
    for (const lesson of phase2Lessons) {
      expect(lessonUnlocked(p, lesson.id)).toBe(true);
      const next = lessons[lessons.indexOf(lesson) + 1];
      if (next) expect(lessonUnlocked(p, next.id)).toBe(false);
      expect(continueLearning(p)).toBe(lessonPath(lesson));
      p.sections.push(...lesson.sections.map((s) => sectionKey(lesson, s.id)));
      p.answers = {
        ...p.answers,
        ...Object.fromEntries(lesson.quiz.map((q) => [q.id, q.correct])),
      };
      for (const exercise of lesson.exercises)
        p = completeExercise(p, exercise.id, true);
      expect(lessonComplete(p, lesson.id)).toBe(true);
      p = parseProgress(JSON.stringify(reconcileCompletion(p)));
      p.answers[lesson.quiz[0].id] = 1;
      expect(lessonComplete(p, lesson.id)).toBe(true);
      expect(points(p, lesson.id)).toBe(100);
      expect(p.drafts["lab-1"]).toBe("legacy draft");
    }
    expect(continueLearning(p)).toBe("/progress");
    expect(points(p)).toBe(410);
  });
  it("does not award completion or unlock a successor after partial work", () => {
    const lesson = phase2Lessons[0];
    const p = {
      ...emptyProgress(),
      completedLessons: ["first-program", "variables"],
      sections: lesson.sections.map((s) => sectionKey(lesson, s.id)),
      completed: lesson.exercises.map((e) => e.id),
      answers: Object.fromEntries(
        lesson.quiz.slice(1).map((q) => [q.id, q.correct]),
      ),
    };
    expect(lessonComplete(p, lesson.id)).toBe(false);
    expect(lessonUnlocked(p, "operators")).toBe(false);
    expect(continueLearning(p)).toBe(lessonPath(lesson, "quiz"));
  });
});
