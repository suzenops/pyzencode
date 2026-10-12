import { ArrowRight, BookOpen, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/Shared";
import { curriculum } from "../content/curriculum";
import { lessons, lessonPath } from "../content/lessons";
import { useProgress } from "../progress/ProgressProvider";
import { lessonUnlocked, lessonComplete } from "../progress/store";
export function Curriculum() {
  const { progress } = useProgress();
  return (
    <>
      <PageTitle
        label="THE LEARNING PATH"
        title="A foundation. Then possibility."
        subtitle="Two complete lessons. Build your foundation in order, then explore what comes next."
      />
      <div className="curriculum-list">
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
                  const lesson =
                    c.level === 1
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
                            : "Complete Lesson 1 first"}
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
