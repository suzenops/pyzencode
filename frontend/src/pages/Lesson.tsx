import { ArrowRight, Check, ChevronRight } from "lucide-react";
import {
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { KnowledgeCheck } from "../components/KnowledgeCheck";
import { LessonAccess } from "../components/LessonAccess";
import { PageTitle } from "../components/Shared";
import { CodeWorkspace } from "../components/Workspace";
import {
  draftKey,
  getLesson,
  labPath,
  lessonPath,
  sectionKey,
} from "../content/lessons";
import { useProgress } from "../progress/ProgressProvider";
export function Lesson() {
  const { section = "a", lessonId = "first-program" } = useParams();
  const navigate = useNavigate();
  const { progress, update } = useProgress();
  const lesson = getLesson(lessonId);
  if (!lesson) return <Navigate to="/curriculum" replace />;
  const index = lesson.sections.findIndex((s) => s.id === section);
  const current = lesson.sections[index];
  const outline = [
    ...lesson.sections.map((s) => ({ id: s.id, title: s.title })),
    { id: "quiz", title: "Knowledge check" },
    { id: "lab", title: "Coding lab" },
  ];
  if (!current && !["quiz", "lab"].includes(section))
    return <Navigate to={lessonPath(lesson)} replace />;
  return (
    <LessonAccess lesson={lesson}>
      <div className="breadcrumb">
        <Link to="/curriculum">Foundations</Link>
        <ChevronRight size={13} />
        Lesson {String(lesson.number).padStart(2, "0")}
      </div>
      <PageTitle
        label={`LEVEL 1 · LESSON ${lesson.number}`}
        title={lesson.title}
        subtitle={lesson.subtitle}
      />
      {lesson.id === "variables" && (
        <p className="lesson-meta">
          Absolute beginner · {lesson.time} · Prerequisite:{" "}
          <Link to="/lesson/a">Lesson 1 — Python and print()</Link>
        </p>
      )}
      <div className="lesson-layout">
        <aside className="lesson-outline">
          <span className="eyebrow">IN THIS LESSON</span>
          {outline.map((s, i) => (
            <NavLink key={s.id} to={lessonPath(lesson, s.id)}>
              <span>{String.fromCharCode(65 + i)}</span>
              {s.title}
              {progress.sections.includes(sectionKey(lesson, s.id)) && (
                <Check size={13} />
              )}
            </NavLink>
          ))}
        </aside>
        <article className="lesson-body" key={`${lesson.id}-${section}`}>
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
              {current.breakdown && (
                <div
                  className="syntax-breakdown"
                  aria-label={
                    lesson.id === "first-program"
                      ? "Annotated breakdown of print Hello"
                      : `Annotated breakdown: ${current.title}`
                  }
                >
                  {current.breakdown.map((t, i) => (
                    <div key={i}>
                      <code>{t.token}</code>
                      <strong>{t.label}</strong>
                      <p>{t.detail}</p>
                    </div>
                  ))}
                </div>
              )}
              {current.table && (
                <div className="lesson-table">
                  <table>
                    <caption>{current.title}: quick reference</caption>
                    <thead>
                      <tr>
                        {current.table.headers.map((h) => (
                          <th key={h} scope="col">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {current.table.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    key={draftKey(lesson, current.id)}
                    id={draftKey(lesson, current.id)}
                    starter={current.code}
                  />
                </>
              )}
              {(current.examples ?? []).map((example) => (
                <section className="additional-example" key={example.id}>
                  <h3>{example.title}</h3>
                  <p>{example.notes}</p>
                  <div className="example">
                    <span className="eyebrow">EXPECTED OUTPUT</span>
                    <pre>{example.output}</pre>
                  </div>
                  <CodeWorkspace
                    id={draftKey(lesson, current.id, example.id)}
                    starter={example.code}
                  />
                </section>
              ))}
              {lesson.id === "variables" &&
                section === "h" &&
                lesson.debugExercises?.map((exercise, i) => (
                  <section className="additional-example" key={exercise.id}>
                    <span className="eyebrow">DEBUG EXAMPLE {i + 1} OF 7</span>
                    <h3>{exercise.title}</h3>
                    <p>{exercise.description}</p>
                    <div className="example">
                      <span className="eyebrow">
                        INTENDED OUTPUT AFTER YOUR FIX
                      </span>
                      <pre>{exercise.expected}</pre>
                    </div>
                    <CodeWorkspace
                      id={exercise.id}
                      starter={exercise.starter}
                      exercise={exercise}
                    />
                  </section>
                ))}
              <div className="callout">
                <span>COMMON BEGINNER MISTAKE</span>
                <p>{current.mistakes}</p>
              </div>
              {current.quickCheck && (
                <KnowledgeCheck questions={[current.quickCheck]} compact />
              )}
              <div className="lesson-next">
                <button
                  onClick={() => {
                    update((p) => ({
                      ...p,
                      sections: [
                        ...new Set([
                          ...p.sections,
                          sectionKey(lesson, current.id),
                        ]),
                      ],
                    }));
                    navigate(
                      lessonPath(
                        lesson,
                        lesson.sections[index + 1]?.id ?? "quiz",
                      ),
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
              <KnowledgeCheck questions={lesson.quiz} />
              <Link to={lessonPath(lesson, "lab")} className="button">
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
                valid implementations are accepted when they meet the output
                {lesson.id === "variables"
                  ? ", required names, stored types, assignment and changed-value checks"
                  : ", type and call-count requirements"}
                .
              </p>
              <Link to={labPath(lesson)} className="button">
                Start the ten-question lab <ArrowRight size={16} />
              </Link>
            </>
          )}
        </article>
      </div>
    </LessonAccess>
  );
}
