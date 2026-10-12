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
  completedLessons?: string[];
  completed: string[];
  sections: string[];
  answers: Record<string, number>;
  drafts: Record<string, string>;
  activity: { text: string; at: string }[];
};
export const emptyProgress = (): Progress => ({
  version: 1,
  completedLessons: [],
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
  return reconcileCompletion({
    version: 1,
    completedLessons: Array.isArray(value.completedLessons)
      ? value.completedLessons.filter(
          (id: unknown) =>
            typeof id === "string" && lessons.some((l) => l.id === id),
        )
      : lessons
          .filter((l) =>
            l.exercises.every((e) => value.completed.includes(e.id)),
          )
          .map((l) => l.id),
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
  });
}
export interface ProgressRepository {
  load(): Promise<Progress>;
  save(progress: Progress): Promise<void>;
  clear(): Promise<void>;
}
export const BACKUP_KEY = "pyzencode.progress.before-completion-fix.v1";
export function reconcileCompletion(p: Progress): Progress {
  const earned = new Set(p.completedLessons ?? []);
  for (const lesson of lessons) {
    if (completionRequirementsMet(p, lesson.id)) earned.add(lesson.id);
    // Existing activity in a gated successor is evidence its prerequisite was unlocked.
    const evidence =
      lesson.sections.some((s) =>
        p.sections.includes(sectionKey(lesson, s.id)),
      ) ||
      [...lesson.exercises, ...(lesson.debugExercises ?? [])].some(
        (e) => p.completed.includes(e.id) || !!p.drafts[e.id]?.trim(),
      ) ||
      lesson.quiz.some((q) => p.answers[q.id] !== undefined) ||
      lesson.sections.some(
        (s) =>
          !!p.drafts[draftKey(lesson, s.id)]?.trim() ||
          (s.examples ?? []).some(
            (e) => !!p.drafts[draftKey(lesson, s.id, e.id)]?.trim(),
          ) ||
          (!!s.quickCheck && p.answers[s.quickCheck.id] !== undefined),
      );
    if (evidence && lesson.prerequisite) earned.add(lesson.prerequisite);
  }
  for (const lesson of [...lessons].reverse())
    if (earned.has(lesson.id) && lesson.prerequisite)
      earned.add(lesson.prerequisite);
  return {
    ...p,
    completedLessons: [...earned].filter((id) =>
      lessons.some((l) => l.id === id),
    ),
  };
}
export function mergeProgress(current: Progress, incoming: Progress): Progress {
  const a = reconcileCompletion(current),
    b = reconcileCompletion(incoming);
  return reconcileCompletion({
    ...a,
    completedLessons: [
      ...new Set([
        ...(a.completedLessons ?? []),
        ...(b.completedLessons ?? []),
      ]),
    ],
    completed: [...new Set([...a.completed, ...b.completed])],
    sections: [...new Set([...a.sections, ...b.sections])],
    answers: { ...b.answers, ...a.answers },
    drafts: { ...b.drafts, ...a.drafts },
    activity: [...a.activity, ...b.activity]
      .filter(
        (v, i, all) =>
          all.findIndex(
            (other) => other.at === v.at && other.text === v.text,
          ) === i,
      )
      .sort((x, y) => Date.parse(y.at) - Date.parse(x.at))
      .slice(0, 20),
  });
}
export class LocalProgressRepository implements ProgressRepository {
  constructor(
    private storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  ) {}
  async load() {
    return parseProgress(this.storage.getItem(STORAGE_KEY));
  }
  // Synchronous local writes finish before navigation/close. Merge protects other-tab milestones.
  private compose(progress: Progress, importedRaw?: string) {
    const raw = this.storage.getItem(STORAGE_KEY);
    const existing = parseProgress(raw);
    const next = mergeProgress(progress, existing);
    const old = raw ? JSON.parse(raw) : {};
    const imported = importedRaw ? JSON.parse(importedRaw) : {};
    const document = {
      ...imported,
      ...old,
      ...next,
      completed: [
        ...new Set([
          ...(imported.completed ?? []),
          ...(old.completed ?? []),
          ...next.completed,
        ]),
      ],
      sections: [
        ...new Set([
          ...(imported.sections ?? []),
          ...(old.sections ?? []),
          ...next.sections,
        ]),
      ],
      completedLessons: [
        ...new Set([
          ...(imported.completedLessons ?? []),
          ...(old.completedLessons ?? []),
          ...(next.completedLessons ?? []),
        ]),
      ],
      drafts: {
        ...(imported.drafts ?? {}),
        ...(old.drafts ?? {}),
        ...next.drafts,
      },
      answers: {
        ...(imported.answers ?? {}),
        ...(old.answers ?? {}),
        ...next.answers,
      },
    };
    const serialized = JSON.stringify(document);
    return { raw, serialized, next: parseProgress(serialized) };
  }
  persist(progress: Progress, importedRaw?: string): Progress {
    const { raw, serialized, next } = this.compose(progress, importedRaw);
    if (raw && this.storage.getItem(BACKUP_KEY) === null)
      this.storage.setItem(BACKUP_KEY, raw);
    this.storage.setItem(STORAGE_KEY, serialized);
    return next;
  }
  exportMerged(progress: Progress) {
    return this.compose(progress).serialized;
  }
  async save(progress: Progress) {
    this.persist(progress);
  }
  async clear() {
    this.storage.removeItem(STORAGE_KEY);
    this.storage.removeItem(BACKUP_KEY);
  }
  exportRaw() {
    return this.storage.getItem(STORAGE_KEY) ?? JSON.stringify(emptyProgress());
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
export function completionRequirementsMet(
  p: Progress,
  lessonId = "first-program",
) {
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
export function lessonComplete(p: Progress, lessonId = "first-program") {
  return reconcileCompletion(p).completedLessons?.includes(lessonId) ?? false;
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
