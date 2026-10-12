import { describe, it, expect } from "vitest";
import { firstLesson, sectionKey } from "../src/content/lessons";
import {
  BACKUP_KEY,
  STORAGE_KEY,
  LocalProgressRepository,
  emptyProgress,
  parseProgress,
  reconcileCompletion,
  mergeProgress,
  lessonComplete,
  lessonUnlocked,
  points,
} from "../src/progress/store";
const completed = () => ({
  ...emptyProgress(),
  sections: firstLesson.sections.map((s) => sectionKey(firstLesson, s.id)),
  answers: Object.fromEntries(firstLesson.quiz.map((q) => [q.id, q.correct])),
  completed: firstLesson.exercises.map((e) => e.id),
  drafts: { "lab-1": 'print("Hello, World!")' },
});
const storage = () => {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
  };
};
describe("permanent completion and additive recovery", () => {
  it("keeps earned completion after quiz review and repeated serialization", () => {
    const earned = reconcileCompletion(completed());
    const reviewed = parseProgress(
      JSON.stringify({ ...earned, answers: { q1: 0 } }),
    );
    expect(lessonComplete(reviewed)).toBe(true);
    expect(lessonUnlocked(reviewed, "variables")).toBe(true);
    expect(points(reviewed)).toBe(100);
  });
  it("recovers legacy ten checked passes without fabricating read flags, answers or points", () => {
    const old = {
      ...emptyProgress(),
      completed: firstLesson.exercises.map((e) => e.id),
    };
    delete old.completedLessons;
    const recovered = parseProgress(JSON.stringify(old));
    expect(lessonComplete(recovered)).toBe(true);
    expect(recovered.answers).toEqual({});
    expect(recovered.sections).toEqual([]);
    expect(points(recovered)).toBe(100);
  });
  it("recovers a prerequisite from recorded successor work", () => {
    for (const evidence of [
      { drafts: { "section-variables-a": "hours=10" } },
      { answers: { "l2-quick-a": 1 } },
      { drafts: { "section-variables-a-two-names": "days=3" } },
      { completed: ["l2-lab-1"] },
      { sections: ["variables:a"] },
    ]) {
      const p = parseProgress(
        JSON.stringify({ ...emptyProgress(), ...evidence }),
      );
      expect(lessonUnlocked(p, "variables")).toBe(true);
      expect(p.completedLessons).not.toContain("variables");
    }
  });
  it("does not complete an empty or partially passed lesson", () => {
    expect(lessonComplete(emptyProgress())).toBe(false);
    expect(
      lessonUnlocked({ ...emptyProgress(), completed: ["lab-1"] }, "variables"),
    ).toBe(false);
  });
  it("persists synchronously and protects milestones from stale tab writes", () => {
    const s = storage(),
      repo = new LocalProgressRepository(s);
    repo.persist(completed());
    expect(parseProgress(s.getItem(STORAGE_KEY)).completedLessons).toContain(
      "first-program",
    );
    repo.persist({
      ...emptyProgress(),
      drafts: { playground: 'print("draft")' },
    });
    const p = parseProgress(s.getItem(STORAGE_KEY));
    expect(lessonUnlocked(p, "variables")).toBe(true);
    expect(points(p)).toBe(100);
    expect(p.drafts.playground).toContain("draft");
  });
  it("keeps exact original backup and unknown records during migration", () => {
    const s = storage();
    const raw = JSON.stringify({
      ...completed(),
      completed: ["lab-1", "future-lab"],
      futureMetadata: { keep: true },
      drafts: { "old-draft": "untouched" },
    });
    s.setItem(STORAGE_KEY, raw);
    new LocalProgressRepository(s).persist(completed());
    expect(s.getItem(BACKUP_KEY)).toBe(raw);
    const saved = JSON.parse(s.getItem(STORAGE_KEY)!);
    expect(saved.futureMetadata).toEqual({ keep: true });
    expect(saved.completed).toContain("future-lab");
    expect(saved.drafts["old-draft"]).toBe("untouched");
  });
  it("merges imports without overwriting current drafts or duplicating points", () => {
    const a = {
      ...reconcileCompletion(completed()),
      drafts: { "lab-1": "newer" },
    };
    const b = {
      ...completed(),
      completed: [...completed().completed, "l2-lab-1"],
      drafts: { "lab-1": "older", "l2-lab-1": "age=20" },
    };
    const merged = mergeProgress(a, b);
    expect(merged.drafts["lab-1"]).toBe("newer");
    expect(merged.drafts["l2-lab-1"]).toBe("age=20");
    expect(points(merged)).toBe(110);
    expect(lessonUnlocked(merged, "variables")).toBe(true);
  });
  it("refuses corrupt existing data rather than replacing it", () => {
    const s = storage();
    s.setItem(STORAGE_KEY, "{broken");
    expect(() => new LocalProgressRepository(s).persist(completed())).toThrow();
    expect(s.getItem(STORAGE_KEY)).toBe("{broken");
  });
});
