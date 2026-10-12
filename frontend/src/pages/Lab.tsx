import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageTitle } from "../components/Shared";
import { CodeWorkspace } from "../components/Workspace";
import { debugExercises } from "../content/exercises";
import { getLesson, lessonPath, labPath } from "../content/lessons";
import { LessonAccess } from "../components/LessonAccess";
import { useProgress } from "../progress/ProgressProvider";
export function Lab({ debug = false }: { debug?: boolean }) {
  const { number = "1", lessonId = "first-program" } = useParams();
  const lesson = getLesson(lessonId);
  const list = debug ? debugExercises : (lesson?.exercises ?? []);
  const index = Number(number) - 1;
  const exercise = list[index];
  const base = debug
    ? "/debug"
    : labPath(lesson ?? getLesson()!).replace(/\/1$/, "");
  const { progress } = useProgress();
  if (!lesson) return <Navigate to="/curriculum" replace />;
  if (!exercise) return <Navigate to={`${base}/1`} replace />;
  const solved = list.filter((e) => progress.completed.includes(e.id)).length;
  return (
    <LessonAccess lesson={lesson}>
      <PageTitle
        label={
          debug
            ? "LEARN THROUGH MISTAKES"
            : `LEVEL 1 · LESSON ${lesson.number} · PRACTICAL LAB`
        }
        title={
          debug
            ? "Debug Lab. Find the clue."
            : "Small challenges. Real progress."
        }
        subtitle={
          debug
            ? "Run the broken code. Read the error. Make one careful change."
            : lesson.id === "variables"
              ? "Ten exercises to store, update and use information with confidence."
              : "Ten exercises to make your first Python concepts your own."
        }
      />
      <div className="lab-nav">
        {list.map((e, i) => (
          <Link
            aria-label={`${debug ? "Debug challenge" : "Question"} ${i + 1}${progress.completed.includes(e.id) ? ", completed" : ""}`}
            aria-current={index === i ? "step" : undefined}
            className={index === i ? "active" : ""}
            key={e.id}
            to={`${base}/${i + 1}`}
          >
            {progress.completed.includes(e.id) ? <Check size={16} /> : i + 1}
          </Link>
        ))}
        <span>
          {solved} / {list.length} completed
        </span>
      </div>
      <div className="lab-layout">
        <section key={exercise.id}>
          <div className="exercise-heading">
            <span className="eyebrow">
              {debug ? "CHALLENGE" : "QUESTION"} {index + 1} OF {list.length}
            </span>
            <h2>{exercise.title}</h2>
            <p>{exercise.description}</p>
            {progress.completed.includes(exercise.id) && (
              <span className="pill success-text">
                Completed{!debug ? " · 10 points" : ""}
              </span>
            )}
          </div>
          <CodeWorkspace
            id={exercise.id}
            starter={exercise.starter}
            exercise={exercise}
          />
          <div className="prev-next">
            <Link
              to={`${base}/${Math.max(1, index)}`}
              aria-disabled={index === 0}
              className={`button secondary ${index === 0 ? "disabled" : ""}`}
            >
              <ArrowLeft size={15} />
              Previous
            </Link>
            {index + 1 < list.length ? (
              <Link to={`${base}/${index + 2}`} className="button secondary">
                Next <ArrowRight size={15} />
              </Link>
            ) : (
              <Link to="/progress" className="button">
                View progress <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </section>
        <aside className="lab-sidebar">
          <div className="panel">
            <span className="eyebrow">TARGET OUTPUT</span>
            <pre>{exercise.expected}</pre>
            <p className="muted">Spelling, spaces and line breaks matter.</p>
          </div>
          <div className="panel">
            <LightbulbNote />
            <p>
              Run Code is for experimenting. Check Answer runs your current code
              again and checks the requirements.
            </p>
            <p>
              {debug
                ? "Debug challenges record completion but do not award lab points."
                : "Each lab question awards 10 points once. Repeated checks never add duplicate points."}
            </p>
          </div>
          <Link to={lessonPath(lesson, "h")} className="quiet-link">
            How to read Python errors <ArrowRight size={14} />
          </Link>
        </aside>
      </div>
    </LessonAccess>
  );
}
function LightbulbNote() {
  return <h3>A thoughtful approach</h3>;
}
