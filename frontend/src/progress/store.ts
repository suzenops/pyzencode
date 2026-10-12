import {
  allExercises,
  allQuiz,
  getLesson,
  lessons,
  sectionKey,
  draftKey,
  lessonPath,
  labPath,
} from "../content/lessons";
import type { LessonContent } from "../content/types";
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
const allIds = allExercises.map((e) => e.id);
const sectionIds = lessons.flatMap((l) =>
  l.sections.map((s) => sectionKey(l, s.id)),
);
const draftIds = lessons.flatMap((l) =>
  l.sections.flatMap((s) => [
    draftKey(l, s.id),
    ...(s.examples ?? []).map((e) => draftKey(l, s.id, e.id)),
  ]),
);
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
          (id: unknown) => typeof id === "string" && sectionIds.includes(id),
        ),
      ),
    ],
    answers: Object.fromEntries(
      Object.entries(value.answers)
        .filter(([id, n]) =>
          allQuiz.some(
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
            [...allIds, "playground", ...draftIds].includes(id),
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
export function points(p: Progress, lessonId?: string) {
  const labs = (
    lessonId ? lessons.filter((l) => l.id === lessonId) : lessons
  ).flatMap((l) => l.exercises);
  return (
    [...new Set(p.completed)].filter((id) => labs.some((e) => e.id === id))
      .length * 10
  );
}
export function lessonComplete(p: Progress, lessonId = "first-program") {
  const lesson = getLesson(lessonId);
  return (
    !!lesson &&
    lesson.sections.every((s) =>
      p.sections.includes(sectionKey(lesson, s.id)),
    ) &&
    lesson.quiz.every((q) => p.answers[q.id] === q.correct) &&
    lesson.exercises.every((e) => p.completed.includes(e.id))
  );
}
export function lessonUnlocked(p: Progress, lessonId: string) {
  const lesson = getLesson(lessonId);
  return (
    !!lesson && (!lesson.prerequisite || lessonComplete(p, lesson.prerequisite))
  );
}
export function currentLesson(p: Progress): LessonContent {
  return (
    lessons.find((l) => lessonUnlocked(p, l.id) && !lessonComplete(p, l.id)) ??
    lessons[lessons.length - 1]
  );
}
export function continueLearning(p: Progress) {
  const lesson = currentLesson(p);
  if (lessonComplete(p, lesson.id)) return "/progress";
  const section = lesson.sections.find(
    (s) => !p.sections.includes(sectionKey(lesson, s.id)),
  );
  if (section) return lessonPath(lesson, section.id);
  if (lesson.quiz.some((q) => p.answers[q.id] !== q.correct))
    return lessonPath(lesson, "quiz");
  return labPath(
    lesson,
    Math.max(
      1,
      lesson.exercises.findIndex((e) => !p.completed.includes(e.id)) + 1,
    ),
  );
}
export function completeExercise(
  p: Progress,
  id: string,
  passed: boolean,
  at = new Date().toISOString(),
): Progress {
  if (!passed || !allIds.includes(id) || p.completed.includes(id)) return p;
  const exercise = allExercises.find((e) => e.id === id)!;
  return {
    ...p,
    completed: [...p.completed, id],
    activity: [{ text: `Solved: ${exercise.title}`, at }, ...p.activity].slice(
      0,
      20,
    ),
  };
}
