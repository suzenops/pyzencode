import { describe, it, expect } from "vitest";
import {
  LocalProgressRepository,
  emptyProgress,
  completeExercise,
  parseProgress,
  points,
  lessonComplete,
} from "../src/progress/store";
import { lesson, quiz } from "../src/content/lesson";
import { exercises } from "../src/content/exercises";
describe("progress persistence", () => {
  it("awards only checked passes and never duplicates", () => {
    let p = emptyProgress();
    p = completeExercise(p, "lab-1", false);
    expect(points(p)).toBe(0);
    p = completeExercise(p, "lab-1", true);
    p = completeExercise(p, "lab-1", true);
    p = completeExercise(p, "debug-case", true);
    p = completeExercise(p, "invented", true);
    expect(points(p)).toBe(10);
    expect(p.activity).toHaveLength(2);
  });
  it("round-trips completion, quiz, and drafts through the repository", async () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    };
    const repo = new LocalProgressRepository(storage);
    const p = {
      ...completeExercise(emptyProgress(), "lab-1", true),
      drafts: { "lab-1": 'print("Hello, World!")' },
      answers: { q1: 1 },
    };
    await repo.save(p);
    expect(await repo.load()).toEqual(p);
    await repo.clear();
    expect(await repo.load()).toEqual(emptyProgress());
  });
  it("rejects unreadable storage rather than silently resetting", () => {
    expect(() => parseProgress("{broken")).toThrow();
    expect(() => parseProgress('{"version":2}')).toThrow();
  });
  it("validates saved IDs and prevents duplicate totals", () => {
    const p = parseProgress(
      JSON.stringify({
        ...emptyProgress(),
        completed: ["lab-1", "lab-1", "bogus"],
        sections: ["a", "bogus"],
        answers: { q1: 99 },
        drafts: { other: "bad" },
      }),
    );
    expect(points(p)).toBe(10);
    expect(p.sections).toEqual(["a"]);
    expect(p.answers).toEqual({});
    expect(p.drafts).toEqual({});
  });
  it("requires reading, quiz and lab for lesson completion", () => {
    const p = {
      ...emptyProgress(),
      completed: exercises.map((e) => e.id),
      sections: lesson.sections.map((s) => s.id),
      answers: Object.fromEntries(quiz.map((q) => [q.id, q.correct])),
    };
    expect(lessonComplete(p)).toBe(true);
    expect(lessonComplete({ ...p, answers: {} })).toBe(false);
  });
  it("surfaces quota failures", async () => {
    const repo = new LocalProgressRepository({
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => {},
    });
    await expect(repo.save(emptyProgress())).rejects.toThrow("quota");
  });
});
