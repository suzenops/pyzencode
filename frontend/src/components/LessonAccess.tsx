import { lessons } from "../content/lessons";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LessonContent } from "../content/types";
import { useProgress } from "../progress/ProgressProvider";
import { continueLearning, lessonUnlocked } from "../progress/store";
export function LessonAccess({
  lesson,
  children,
}: {
  lesson: LessonContent;
  children: ReactNode;
}) {
  const { progress } = useProgress();
  if (lessonUnlocked(progress, lesson.id)) return <>{children}</>;
  const prerequisite = lesson.prerequisite
    ? lessons.find((l) => l.id === lesson.prerequisite)
    : undefined;
  return (
    <section className="panel lesson-locked">
      <span className="eyebrow">LESSON {lesson.number} · LOCKED</span>
      <h1>Complete Lesson {prerequisite?.number ?? 1} to continue.</h1>
      <p>
        Finish {prerequisite?.title}: its {prerequisite?.sections.length}{" "}
        reading sections, {prerequisite?.quiz.length}-question knowledge check
        and {prerequisite?.exercises.length} checked lab exercises. Your
        existing progress and drafts are preserved.
      </p>
      <p>
        Already completed this lesson on another site address? Your progress is
        stored separately there.{" "}
        <Link to="/progress">Restore a progress backup</Link> without repeating
        passed exercises.
      </p>
      <Link className="button" to={continueLearning(progress)}>
        Continue learning
      </Link>
    </section>
  );
}
