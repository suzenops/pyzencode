import { ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTitle, Stat } from "../components/Shared";
import { curriculum } from "../content/curriculum";
import { lessons, sectionKey } from "../content/lessons";
import { useProgress } from "../progress/ProgressProvider";
import {
  lessonComplete,
  points,
  currentLesson,
  continueLearning,
} from "../progress/store";
export function Dashboard() {
  const { progress } = useProgress();
  const lesson = currentLesson(progress);
  const solved = lesson.exercises.filter((e) =>
    progress.completed.includes(e.id),
  ).length;
  const continueTo = continueLearning(progress);
  const read = lesson.sections.filter((s) =>
    progress.sections.includes(sectionKey(lesson, s.id)),
  ).length;
  return (
    <>
      <PageTitle
        label="YOUR LEARNING SPACE"
        title="Make room for a new skill."
        subtitle="A little understanding, built one line at a time."
      />
      <div className="stats-grid">
        <Stat label="Current level" value="01" detail="Python Foundations" />
        <Stat
          label="Completed lessons"
          value={`${lessons.filter((l) => lessonComplete(progress, l.id)).length} / 2`}
          detail="Available in this release"
        />
        <Stat
          label="Lab progress"
          value={`${solved} / 10`}
          detail="Working solutions saved"
        />
        <Stat
          label="Points earned"
          value={points(progress)}
          detail="10 per completed lab task"
        />
      </div>
      <div className="dashboard-grid">
        <section className="continue-card">
          <div className="eyebrow">
            CONTINUE YOUR JOURNEY · LESSON {lesson.number}
          </div>
          <h2>{lesson.title}</h2>
          <p>{lesson.subtitle}</p>
          <div className="progress-track">
            <span style={{ width: `${solved * 10}%` }} />
          </div>
          <div className="card-bottom">
            <span>{read} / 8 reading sections marked</span>
            <Link to={continueTo} className="button">
              {lessonComplete(progress, lesson.id)
                ? "Review progress"
                : "Continue learning"}{" "}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <section className="panel">
          <h3>Recent activity</h3>
          {progress.activity.length ? (
            <ul className="activity-list">
              {progress.activity.slice(0, 5).map((a, i) => (
                <li key={a.at + i}>
                  <span className="activity-dot" />
                  <div>
                    {a.text}
                    <small>{new Date(a.at).toLocaleString()}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <BookOpen size={28} />
              <p>Your learning story starts here.</p>
              <small>Completed exercises will appear as you go.</small>
            </div>
          )}
        </section>
      </div>
      <div className="section-row">
        <h3>On your horizon</h3>
        <Link to="/curriculum">
          View curriculum <ChevronRight size={15} />
        </Link>
      </div>
      <div className="upcoming-grid">
        {curriculum[0].topics.slice(2, 5).map((t) => (
          <div className="panel upcoming" key={t}>
            <span>UPCOMING TOPIC</span>
            <h3>{t}</h3>
            <span className="pill muted">Coming soon</span>
          </div>
        ))}
      </div>
    </>
  );
}
