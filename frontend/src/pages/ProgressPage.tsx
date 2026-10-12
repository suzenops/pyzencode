import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTitle, Stat } from "../components/Shared";
import { lessons, labPath, sectionKey } from "../content/lessons";
import { useProgress } from "../progress/ProgressProvider";
import { lessonComplete, lessonUnlocked, points } from "../progress/store";
export function ProgressPage() {
  const { progress, reset } = useProgress();
  const solved = lessons
    .flatMap((l) => l.exercises)
    .filter((e) => progress.completed.includes(e.id)).length;
  const correct = lessons
    .flatMap((l) => l.quiz)
    .filter((q) => progress.answers[q.id] === q.correct).length;
  return (
    <>
      <PageTitle
        label="YOUR PROGRESS"
        title="Understanding adds up."
        subtitle="Your progress and drafts stay in this browser. No account is needed."
      />
      <div className="stats-grid">
        <Stat
          label="Lab points"
          value={points(progress)}
          detail="100 per lesson · 200 total"
        />
        <Stat
          label="Exercises solved"
          value={`${solved} / 20`}
          detail="Checked working solutions"
        />
        <Stat
          label="Knowledge check"
          value={`${correct} / 10`}
          detail="Correct final-check answers"
        />
        <Stat
          label="Lesson completion"
          value={`${lessons.filter((l) => lessonComplete(progress, l.id)).length} / 2`}
          detail="Read sections, pass each quiz and lab"
        />
      </div>
      {lessons.map((lesson) => {
        const read = lesson.sections.filter((s) =>
          progress.sections.includes(sectionKey(lesson, s.id)),
        ).length;
        const lab = lesson.exercises.filter((e) =>
          progress.completed.includes(e.id),
        ).length;
        const answers = lesson.quiz.filter(
          (q) => progress.answers[q.id] === q.correct,
        ).length;
        const unlocked = lessonUnlocked(progress, lesson.id);
        return (
          <section className="panel lesson-progress" key={lesson.id}>
            <span className="eyebrow">
              LESSON {lesson.number} ·{" "}
              {lessonComplete(progress, lesson.id)
                ? "COMPLETE"
                : unlocked
                  ? "IN PROGRESS"
                  : "LOCKED"}
            </span>
            <h2>{lesson.title}</h2>
            <p>
              {read} of 8 reading sections marked · {lab} lab tasks solved ·{" "}
              {answers} knowledge answers correct ·{" "}
              {points(progress, lesson.id)} / 100 points
            </p>
            <div className="progress-track">
              <span
                style={{ width: `${((read + lab + answers) / 23) * 100}%` }}
              />
            </div>
            {unlocked ? (
              <div className="completion-list">
                {lesson.exercises.map((e, i) => (
                  <Link to={labPath(lesson, i + 1)} key={e.id}>
                    <span>
                      {progress.completed.includes(e.id) ? (
                        <Check size={17} />
                      ) : (
                        <span className="empty-circle" />
                      )}
                      {e.title}
                    </span>
                    <span>
                      {progress.completed.includes(e.id)
                        ? "10 points"
                        : "Not completed"}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p>Complete Lesson 1 to unlock these exercises.</p>
            )}
          </section>
        );
      })}
      <section className="panel privacy-panel">
        <h3>Your data, on this device</h3>
        <p>
          Drafts, checked exercise completions, knowledge-check answers and
          recent activity are stored locally. They are not synced to Supabase or
          sent to an AI provider. Clearing browser data or switching devices can
          remove or separate your progress.
        </p>
        <button
          className="secondary"
          onClick={() => {
            if (
              window.confirm(
                "Delete all local PyZenCode progress, activity and code drafts? This cannot be undone.",
              )
            )
              void reset();
          }}
        >
          Delete local progress
        </button>
      </section>
    </>
  );
}
