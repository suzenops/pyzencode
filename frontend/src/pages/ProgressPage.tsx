import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTitle, Stat } from "../components/Shared";
import { exercises } from "../content/exercises";
import { quiz } from "../content/lesson";
import { useProgress } from "../progress/ProgressProvider";
import { lessonComplete, points } from "../progress/store";
export function ProgressPage() {
  const { progress, reset } = useProgress();
  const solved = exercises.filter((e) =>
    progress.completed.includes(e.id),
  ).length;
  const correct = quiz.filter(
    (q) => progress.answers[q.id] === q.correct,
  ).length;
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
          detail="Out of 100 available"
        />
        <Stat
          label="Exercises solved"
          value={`${solved} / 10`}
          detail="Checked working solutions"
        />
        <Stat
          label="Knowledge check"
          value={`${correct} / 5`}
          detail="Correct current answers"
        />
        <Stat
          label="Lesson completion"
          value={lessonComplete(progress) ? "Complete" : "In progress"}
          detail="Read 8 sections, pass quiz and lab"
        />
      </div>
      <section className="panel">
        <h2>Your first program</h2>
        <p>
          {progress.sections.length} of 8 reading sections marked · {solved} lab
          tasks solved · {correct} knowledge answers correct
        </p>
        <div className="progress-track">
          <span
            style={{
              width: `${((progress.sections.length + solved + correct) / 23) * 100}%`,
            }}
          />
        </div>
        <div className="completion-list">
          {exercises.map((e, i) => (
            <Link to={`/lab/${i + 1}`} key={e.id}>
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
      </section>
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
