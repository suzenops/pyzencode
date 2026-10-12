import { debugExercises, exercises } from "../content/exercises";
import { lesson, quiz } from "../content/lesson";
export const STORAGE_KEY = "pyzencode.progress.v1";
export type Progress = {
  version: 1;
  completed: string[];
  sections: string[];
  answers: Record<string, number>;
  drafts: Record<string, string>;
  activity: { text: string; at: string }[];
};
export const emptyProgress = (): Progress => ({
  version: 1,
  completed: [],
  sections: [],
  answers: {},
  drafts: {},
  activity: [],
});
const allIds = [...exercises, ...debugExercises].map((e) => e.id);
export function parseProgress(raw: string | null): Progress {
  if (raw === null) return emptyProgress();
  const value = JSON.parse(raw);
  if (
    !value ||
    value.version !== 1 ||
    !Array.isArray(value.completed) ||
    !Array.isArray(value.sections) ||
    !value.answers ||
    !value.drafts ||
    !Array.isArray(value.activity)
  )
    throw new Error("Unsupported or damaged saved progress.");
  return {
    version: 1,
    completed: [
      ...new Set<string>(
        value.completed.filter(
          (id: unknown) => typeof id === "string" && allIds.includes(id),
        ),
      ),
    ],
    sections: [
      ...new Set<string>(
        value.sections.filter(
          (id: unknown) =>
            typeof id === "string" && lesson.sections.some((s) => s.id === id),
        ),
      ),
    ],
    answers: Object.fromEntries(
      Object.entries(value.answers)
        .filter(([id, n]) =>
          quiz.some(
            (q) =>
              q.id === id &&
              Number.isInteger(n) &&
              Number(n) >= 0 &&
              Number(n) < q.options.length,
          ),
        )
        .map(([id, n]) => [id, Number(n)]),
    ),
    drafts: Object.fromEntries(
      Object.entries(value.drafts)
        .filter(
          ([id, code]) =>
            typeof code === "string" &&
            code.length <= 20000 &&
            [
              ...allIds,
              "playground",
              ...lesson.sections.map((s) => `section-${s.id}`),
            ].includes(id),
        )
        .map(([id, code]) => [id, String(code)]),
    ),
    activity: value.activity
      .filter(
        (a: unknown) =>
          !!a &&
          typeof a === "object" &&
          "text" in a &&
          typeof a.text === "string" &&
          a.text.length < 300 &&
          "at" in a &&
          typeof a.at === "string" &&
          Number.isFinite(Date.parse(a.at)),
      )
      .slice(0, 20),
  };
}
export interface ProgressRepository {
  load(): Promise<Progress>;
  save(progress: Progress): Promise<void>;
  clear(): Promise<void>;
}
export class LocalProgressRepository implements ProgressRepository {
  constructor(
    private storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  ) {}
  async load() {
    return parseProgress(this.storage.getItem(STORAGE_KEY));
  }
  async save(progress: Progress) {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
  async clear() {
    this.storage.removeItem(STORAGE_KEY);
  }
}
export function points(p: Progress) {
  return (
    p.completed.filter((id) => exercises.some((e) => e.id === id)).length * 10
  );
}
export function lessonComplete(p: Progress) {
  return (
    lesson.sections.every((s) => p.sections.includes(s.id)) &&
    quiz.every((q) => p.answers[q.id] === q.correct) &&
    exercises.every((e) => p.completed.includes(e.id))
  );
}
export function completeExercise(
  p: Progress,
  id: string,
  passed: boolean,
  at = new Date().toISOString(),
): Progress {
  if (!passed || !allIds.includes(id) || p.completed.includes(id)) return p;
  const exercise = [...exercises, ...debugExercises].find((e) => e.id === id)!;
  return {
    ...p,
    completed: [...p.completed, id],
    activity: [{ text: `Solved: ${exercise.title}`, at }, ...p.activity].slice(
      0,
      20,
    ),
  };
}
