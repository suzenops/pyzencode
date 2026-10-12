import { quiz } from "../content/lesson";
import { useProgress } from "../progress/ProgressProvider";
export function KnowledgeCheck() {
  const { progress, update } = useProgress();
  const count = quiz.filter((q) => progress.answers[q.id] === q.correct).length;
  return (
    <div>
      <div className="section-heading">
        <span className="eyebrow">SECTION I</span>
        <h2>Check your understanding.</h2>
        <p>
          Choose an answer. Read the explanation, and try again whenever you
          need to.
        </p>
        <span className="pill">{count} / 5 correct</span>
      </div>
      {quiz.map((q, i) => {
        const selected = progress.answers[q.id];
        return (
          <fieldset className="quiz-card" key={q.id}>
            <legend>
              {i + 1}. {q.question}
            </legend>
            {q.options.map((o, index) => (
              <label
                key={o.text}
                className={selected === index ? "selected-answer" : ""}
              >
                <input
                  type="radio"
                  name={q.id}
                  checked={selected === index}
                  onChange={() =>
                    update((p) => ({
                      ...p,
                      answers: { ...p.answers, [q.id]: index },
                    }))
                  }
                />
                <span>{o.text}</span>
              </label>
            ))}
            {selected !== undefined && (
              <p
                role="status"
                className={selected === q.correct ? "success-text" : "muted"}
              >
                {selected === q.correct ? "Correct. " : "Try again. "}
                {q.options[selected].explanation}
              </p>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}
