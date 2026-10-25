import { ArrowRight, BookOpen, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/Shared";
import { curriculum } from "../content/curriculum";
import { lessons, lessonPath } from "../content/lessons";
import { useProgress } from "../progress/ProgressProvider";
import { lessonUnlocked, lessonComplete } from "../progress/store";
import modules from "../../../shared/modules.json";
const topicLessons: Record<string, string> = {
  "Arithmetic operators": "operators",
  "Type conversions": "values",
  "User input": "values",
  "Comparison operators": "operators",
  "Boolean values": "values",
  "if, elif, else": "conditionals",
  "Logical operators": "operators",
};
export function Curriculum() {
  const { progress } = useProgress();
  return (
    <>
      <PageTitle
        label="THE LEARNING PATH"
        title="A foundation. Then possibility."
        subtitle="Build your foundation in order. Expand a module to see its reading lessons, quiz and practical assessment."
      />
      <div className="curriculum-list">
        {modules.map((module) => {
          const units = lessons.filter((l) => module.lessonIds.includes(l.id));
          const completed = units.filter((l) =>
            lessonComplete(progress, l.id),
          ).length;
          return (
            <details
              className="panel module-card"
              key={module.number}
              open={module.number === 1 || undefined}
            >
              <summary>
                Module {module.number}: {module.title} · {completed}/
                {units.length} units complete
              </summary>
              {units.map((lesson) => (
                <section key={lesson.id}>
                  <h2>{lesson.title}</h2>
                  <p>
                    {lesson.sections.length} reading lessons ·{" "}
                    {lesson.quiz.length}-question quiz ·{" "}
                    {lesson.exercises.length} coding exercises
                  </p>
                  <p>
                    {lessonComplete(progress, lesson.id)
                      ? "Complete — review anytime"
                      : lessonUnlocked(progress, lesson.id)
                        ? "Ready to start"
                        : `Complete ${lessons.find((l) => l.id === lesson.prerequisite)?.title} first`}
                  </p>
                  <ol className="module-lessons">
                    {lesson.sections.map((section) => (
                      <li key={section.id}>
                        <Link to={lessonPath(lesson, section.id)}>
                          {section.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <Link
                    className="button secondary"
                    to={lessonPath(lesson, "quiz")}
                  >
                    Quiz and final assessment <ArrowRight size={15} />
                  </Link>
                </section>
              ))}
            </details>
          );
        })}
        <h2>Topic roadmap</h2>
        {curriculum.map((c) => (
          <section className="curriculum-level" key={c.level}>
            <div className="level-number">
              {String(c.level).padStart(2, "0")}
            </div>
            <div>
              <div className="section-row">
                <h2>{c.title}</h2>
                <span className="muted">LEVEL {c.level}</span>
              </div>
              <div className="topic-list">
                {c.topics.map((t) => {
                  const lesson = topicLessons[t]
                    ? lessons.find((l) => l.id === topicLessons[t])
                    : c.level === 1
                      ? lessons.find(
                          (l) =>
                            (l.id === "first-program"
                              ? "Python and print()"
                              : l.title) === t,
                        )
                      : undefined;
                  return lesson ? (
                    <Link
                      key={t}
                      to={lessonPath(lesson)}
                      className={`topic ${lessonUnlocked(progress, lesson.id) ? "available" : ""}`}
                    >
                      <span>
                        <BookOpen size={16} />
                        {t}
                      </span>
                      <span
                        className={
                          lessonUnlocked(progress, lesson.id)
                            ? "success-text"
                            : "muted"
                        }
                      >
                        {lessonComplete(progress, lesson.id)
                          ? "Review lesson"
                          : lessonUnlocked(progress, lesson.id)
                            ? "Start lesson"
                            : "Complete prerequisite first"}
                        {lessonUnlocked(progress, lesson.id) ? (
                          <ArrowRight size={15} />
                        ) : (
                          <LockKeyhole size={15} />
                        )}
                      </span>
                    </Link>
                  ) : (
                    <div className="topic" key={t}>
                      <span>{t}</span>
                      <span className="pill muted">Coming soon</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
