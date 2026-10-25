import { lesson, quiz, syntaxTokens } from "./lesson";
import { exercises, debugExercises } from "./exercises";
import { variablesLesson } from "./variables";
import type { LessonContent } from "./types";
import phase2Content from "../../../shared/phase2-content.json" with { type: "json" };
export const phase2Lessons = phase2Content as LessonContent[];
export const firstLesson: LessonContent = {
  ...lesson,
  number: 1,
  time: "25–35 minutes, excluding the lab",
  quiz,
  exercises,
  debugExercises,
  sections: lesson.sections.map((s) => ({
    ...s,
    breakdown: s.id === "d" ? syntaxTokens : undefined,
  })),
};
export const lessons: LessonContent[] = [
  firstLesson,
  variablesLesson,
  ...phase2Lessons,
];
export function getLesson(id = "first-program") {
  return lessons.find((l) => l.id === id);
}
export function sectionKey(lesson: LessonContent, sectionId: string) {
  return lesson.id === "first-program"
    ? sectionId
    : `${lesson.id}:${sectionId}`;
}
export function lessonPath(lesson: LessonContent, section = "a") {
  return lesson.id === "first-program"
    ? `/lesson/${section}`
    : `/lessons/${lesson.id}/${section}`;
}
export function labPath(lesson: LessonContent, number = 1) {
  return lesson.id === "first-program"
    ? `/lab/${number}`
    : `/labs/${lesson.id}/${number}`;
}
export function draftKey(
  lesson: LessonContent,
  section: string,
  example?: string,
) {
  return lesson.id === "first-program" && !example
    ? `section-${section}`
    : `section-${lesson.id}-${section}${example ? `-${example}` : ""}`;
}
export const allExercises = lessons.flatMap((l) => [
  ...l.exercises,
  ...(l.debugExercises ?? []),
]);
export const allQuiz = lessons.flatMap((l) => [
  ...l.quiz,
  ...l.sections.flatMap((s) => (s.quickCheck ? [s.quickCheck] : [])),
]);
