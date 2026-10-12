import { describe, it, expect } from "vitest";
import { variablesLesson } from "../src/content/variables";
import {
  draftKey,
  firstLesson,
  lessons,
  sectionKey,
} from "../src/content/lessons";
import { grade, gradingOptions } from "../src/execution/grading";
import { compareOutput } from "../src/execution/comparison";
import {
  emptyProgress,
  completeExercise,
  lessonUnlocked,
  lessonComplete,
  continueLearning,
  parseProgress,
  points,
} from "../src/progress/store";
import type { ExecutionResult } from "../src/execution/types";
const fixture = (index: number): ExecutionResult => {
  const e = variablesLesson.exercises[index];
  return {
    stdout: e.expected + "\n",
    stderr: "",
    prints: [],
    duration: 1,
    typeCalls: (e.variables ?? []).map((v) => ({
      type: v.type,
      value: v.value,
    })),
    variables: Object.fromEntries(
      (e.variables ?? []).map((v) => [
        v.name,
        { type: v.type, value: v.value },
      ]),
    ),
    assignments: Object.fromEntries(
      (e.variables ?? []).map((v) => [
        v.name,
        (v.history ?? [v.value]).map((value) => ({ type: v.type, value })),
      ]),
    ),
    caseResults: (e.cases ?? []).map((c) => ({
      name: c.name,
      result: {
        stdout: c.expected + "\n",
        stderr: "",
        prints: [],
        duration: 1,
        variables: Object.fromEntries(
          (e.variables ?? []).map((v) => [
            v.name,
            {
              type: typeof c.overrides[v.name] === "string" ? "str" : v.type,
              value: String(c.overrides[v.name] ?? v.value),
            },
          ]),
        ),
        typeCalls: (e.variables ?? []).map((v) => ({
          type: typeof c.overrides[v.name] === "string" ? "str" : v.type,
          value: String(c.overrides[v.name] ?? v.value),
        })),
      },
    })),
  };
};
const finishedFirst = (): import("../src/progress/store").Progress => ({
  ...emptyProgress(),
  sections: firstLesson.sections.map((s) => sectionKey(firstLesson, s.id)),
  answers: Object.fromEntries(firstLesson.quiz.map((q) => [q.id, q.correct])),
  completed: firstLesson.exercises.map((e) => e.id),
  drafts: { "lab-1": 'print("Hello, World!")' },
});
describe("complete Lesson 2 content", () => {
  it("loads eight sections, five final questions, ten tasks and seven debug cases", () => {
    expect(variablesLesson.sections.map((s) => s.id)).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
    ]);
    expect(variablesLesson.quiz).toHaveLength(5);
    expect(variablesLesson.exercises).toHaveLength(10);
    expect(variablesLesson.debugExercises).toHaveLength(7);
    expect(
      variablesLesson.sections.every(
        (s) => s.quickCheck && s.paragraphs.length >= 4,
      ),
    ).toBe(true);
  });
  it("keeps all exercise, quiz and persisted section identifiers distinct", () => {
    const ids = lessons.flatMap((l) => [
      ...l.exercises.map((e) => e.id),
      ...l.quiz.map((q) => q.id),
      ...l.sections.map((s) => sectionKey(l, s.id)),
    ]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(draftKey(firstLesson, "a")).toBe("section-a");
    expect(draftKey(variablesLesson, "a")).toBe("section-variables-a");
  });
});
describe("variable-aware grading", () => {
  it.each(variablesLesson.exercises.map((e, i) => ({ e, i })))(
    "accepts observed working evidence for $e.id",
    ({ e, i }) => expect(grade(e, fixture(i)).passed).toBe(true),
  );
  it("rejects missing names and explains capitalization", () => {
    const result = fixture(0);
    result.variables = { Age: { type: "int", value: "20" } };
    expect(grade(variablesLesson.exercises[0], result).message).toContain(
      "capitalization",
    );
    result.variables = {};
    expect(grade(variablesLesson.exercises[0], result).message).toContain(
      "Missing variable age",
    );
  });
  it("rejects wrong types, wrong values and a skipped initial update", () => {
    const result = fixture(0);
    result.variables!.age.type = "str";
    expect(grade(variablesLesson.exercises[0], result).message).toContain(
      "stored type is str",
    );
    result.variables!.age = { type: "int", value: "21" };
    expect(grade(variablesLesson.exercises[0], result).passed).toBe(false);
    const update = fixture(4);
    update.assignments!.score = [{ type: "int", value: "80" }];
    expect(grade(variablesLesson.exercises[4], update).message).toContain(
      "50 before 80",
    );
  });
  it.each(variablesLesson.exercises.map((e, i) => ({ e, i })))(
    "requires changed-value evidence for $e.id",
    ({ e, i }) => {
      const result = fixture(i);
      result.caseResults = [];
      expect(grade(e, result).passed).toBe(false);
      result.caseResults = [
        { name: e.cases![0].name, result: { ...result, stdout: e.expected } },
      ];
      expect(grade(e, result).passed).toBe(false);
    },
  );
  it("passes exact observations/cases into worker options without source comparisons", () => {
    const e = variablesLesson.exercises[8];
    expect(gradingOptions(e)?.observe).toEqual([
      "monday_hours",
      "tuesday_hours",
      "total_hours",
    ]);
    expect(gradingOptions(e)?.cases).toHaveLength(2);
  });
});
describe("preserved progress and lesson unlocking", () => {
  it("blocks Lesson 2 until every prerequisite part is complete", () => {
    const p = finishedFirst();
    expect(lessonUnlocked(emptyProgress(), "variables")).toBe(false);
    expect(
      lessonUnlocked({ ...p, completed: p.completed.slice(1) }, "variables"),
    ).toBe(false);
    expect(lessonUnlocked({ ...p, answers: {} }, "variables")).toBe(false);
    expect(lessonUnlocked(p, "variables")).toBe(true);
    expect(continueLearning(p)).toBe("/lessons/variables/a");
  });
  it("preserves old and new drafts, read sections, answers and scores on reload", () => {
    let p = finishedFirst();
    p = completeExercise(p, "l2-lab-1", true);
    const saved = parseProgress(
      JSON.stringify({
        ...p,
        sections: [...p.sections, "variables:a"],
        drafts: { ...p.drafts, "l2-lab-1": "age = 20\nprint(age)" },
        answers: { ...p.answers, "l2-q1": 1, "l2-quick-a": 1 },
      }),
    );
    expect(saved.drafts["lab-1"]).toBe(p.drafts["lab-1"]);
    expect(saved.sections).toContain("a");
    expect(saved.sections).toContain("variables:a");
    expect(saved.answers["l2-q1"]).toBe(1);
    expect(saved.answers["l2-quick-a"]).toBe(1);
    expect(points(saved, "first-program")).toBe(100);
    expect(points(saved, "variables")).toBe(10);
    expect(points(saved)).toBe(110);
  });
  it("awards each passing task once, caps each lesson at 100 and skips debug points", () => {
    let p = finishedFirst();
    for (const e of variablesLesson.exercises) {
      p = completeExercise(p, e.id, false);
      p = completeExercise(p, e.id, true);
      p = completeExercise(p, e.id, true);
    }
    p = completeExercise(p, "l2-debug-1", true);
    expect(points(p, "variables")).toBe(100);
    expect(points(p)).toBe(200);
    expect(lessonComplete(p, "variables")).toBe(false);
    p.sections.push(
      ...variablesLesson.sections.map((s) => sectionKey(variablesLesson, s.id)),
    );
    p.answers = {
      ...p.answers,
      ...Object.fromEntries(variablesLesson.quiz.map((q) => [q.id, q.correct])),
    };
    expect(lessonComplete(p, "variables")).toBe(true);
    expect(continueLearning(p)).toBe("/progress");
  });
});
describe("reusable precise output feedback", () => {
  it("identifies uppercase, spaces, missing/extra lines and Unicode positions", () => {
    expect(compareOutput("Start coding!", "Start Coding!\n")).toMatchObject({
      kind: "capitalization",
      line: 1,
      column: 7,
    });
    expect(compareOutput("Student: Alex", "Student:  Alex")).toMatchObject({
      kind: "space",
      line: 1,
      column: 10,
    });
    expect(compareOutput("Hello\nPython", "Hello\n")).toMatchObject({
      line: 1,
      column: 6,
      kind: "missing",
    });
    expect(compareOutput("Hello", "Hello!")).toMatchObject({
      kind: "extra",
      column: 6,
    });
    expect(compareOutput("🐍x", "🐍y")).toMatchObject({ line: 1, column: 2 });
    expect(compareOutput("\nHello", "X")).toMatchObject({ line: 1, column: 1 });
  });
});

it("requires an actual type() call on the stored value, including changed-value runs", () => {
  const e = variablesLesson.exercises[7];
  expect(e.typeOf).toBe("price");
  const baseline = fixture(7);
  baseline.typeCalls = [];
  expect(grade(e, baseline).message).toContain("built-in type()");
  const changed = fixture(7);
  changed.caseResults![0].result.typeCalls = [];
  expect(grade(e, changed).message).toContain(
    "changed-value check must also use type()",
  );
});
