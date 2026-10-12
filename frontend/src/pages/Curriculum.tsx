import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/Shared";
import { curriculum } from "../content/curriculum";
export function Curriculum() {
  return (
    <>
      <PageTitle
        label="THE LEARNING PATH"
        title="A foundation. Then possibility."
        subtitle="One complete lesson today. A structured path for what comes next."
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
                {c.topics.map((t, i) =>
                  c.level === 1 && i === 0 ? (
                    <Link key={t} to="/lesson/a" className="topic available">
                      <span>
                        <BookOpen size={16} />
                        {t}
                      </span>
                      <span className="success-text">
                        Start lesson <ArrowRight size={15} />
                      </span>
                    </Link>
                  ) : (
                    <div className="topic" key={t}>
                      <span>{t}</span>
                      <span className="pill muted">Coming soon</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
