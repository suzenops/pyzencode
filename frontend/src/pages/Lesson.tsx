import { ArrowRight, Check, ChevronRight } from "lucide-react";
import {
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { KnowledgeCheck } from "../components/KnowledgeCheck";
import { PageTitle } from "../components/Shared";
import { CodeWorkspace } from "../components/Workspace";
import { lesson, syntaxTokens } from "../content/lesson";
import { useProgress } from "../progress/ProgressProvider";
export function Lesson() {
  const { section = "a" } = useParams();
  const navigate = useNavigate();
  const { progress, update } = useProgress();
  const index = lesson.sections.findIndex((s) => s.id === section);
  const current = lesson.sections[index];
  const sections = [
    ...lesson.sections.map((s) => ({ id: s.id, title: s.title })),
    { id: "quiz", title: "Knowledge check" },
    { id: "lab", title: "Coding lab" },
  ];
  if (!current && !["quiz", "lab"].includes(section))
    return <Navigate to="/lesson/a" replace />;
  return (
    <>
      <div className="breadcrumb">
        <Link to="/curriculum">Foundations</Link>
        <ChevronRight size={13} />
        Lesson 01
      </div>
      <PageTitle
        label="LEVEL 1 · LESSON 1"
        title={lesson.title}
        subtitle={lesson.subtitle}
      />
      <div className="lesson-layout">
        <aside className="lesson-outline">
          <span className="eyebrow">IN THIS LESSON</span>
          {sections.map((s, i) => (
            <NavLink key={s.id} to={`/lesson/${s.id}`}>
              <span>{String.fromCharCode(65 + i)}</span>
              {s.title}
              {progress.sections.includes(s.id) && <Check size={13} />}
            </NavLink>
          ))}
        </aside>
        <article className="lesson-body" key={section}>
          {current && (
            <>
              <span className="eyebrow">
                SECTION {current.id.toUpperCase()}
              </span>
              <h2>{current.title}</h2>
              <p className="lead">{current.intro}</p>
              {current.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section === "d" && (
                <div
                  className="syntax-breakdown"
                  aria-label="Annotated breakdown of print Hello"
                >
                  {syntaxTokens.map((t, i) => (
                    <div key={i}>
                      <code>{t.token}</code>
                      <strong>{t.label}</strong>
                      <p>{t.detail}</p>
                    </div>
                  ))}
                </div>
              )}
              {current.code && (
                <>
                  <div className="example">
                    <span className="eyebrow">
                      {section === "h"
                        ? "INTENTIONALLY BROKEN EXAMPLE"
                        : "WORKING EXAMPLE"}
                    </span>
                    <pre>{current.code}</pre>
                    {current.output !== undefined && (
                      <div>
                        <span>EXPECTED OUTPUT</span>
                        <pre>{current.output}</pre>
                      </div>
                    )}
                  </div>
                  <div className="practice-heading">
                    <h3>Try it for yourself</h3>
                    <p>{current.practice}</p>
                  </div>
                  <CodeWorkspace
                    key={current.id}
                    id={`section-${current.id}`}
                    starter={current.code}
                  />
                </>
              )}
              <div className="callout">
                <span>COMMON BEGINNER MISTAKE</span>
                <p>{current.mistakes}</p>
              </div>
              <div className="lesson-next">
                <button
                  onClick={() => {
                    update((p) => ({
                      ...p,
                      sections: [...new Set([...p.sections, current.id])],
                    }));
                    navigate(
                      `/lesson/${lesson.sections[index + 1]?.id ?? "quiz"}`,
                    );
                  }}
                >
                  Mark as read & continue <ArrowRight size={16} />
                </button>
                <span>Reading alone does not award lab points.</span>
              </div>
            </>
          )}
          {section === "quiz" && (
            <>
              <KnowledgeCheck />
              <Link to="/lesson/lab" className="button">
                Go to the practical lab <ArrowRight size={16} />
              </Link>
            </>
          )}
          {section === "lab" && (
            <>
              <span className="eyebrow">SECTION J</span>
              <h2>Turn understanding into practice.</h2>
              <p>
                Ten exercises, real Python and ten points for each working
                solution. Run Code helps you experiment. Check Answer executes
                your current code and grades the result. Navigation alone earns
                no points.
              </p>
              <p>
                You can retry, use progressive hints and return later. Different
                valid Python solutions are accepted when they meet the output,
                type and call-count requirements.
              </p>
              <Link to="/lab/1" className="button">
                Start the ten-question lab <ArrowRight size={16} />
              </Link>
            </>
          )}
        </article>
      </div>
    </>
  );
}
