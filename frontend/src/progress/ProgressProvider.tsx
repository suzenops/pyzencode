import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  LocalProgressRepository,
  completeExercise,
  emptyProgress,
  type Progress,
  type ProgressRepository,
} from "./store";
type Context = {
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  complete: (id: string, passed: boolean) => void;
  reset: () => Promise<void>;
  error: string;
  retry: () => void;
};
const ProgressContext = createContext<Context | null>(null);
export function ProgressProvider({
  children,
  repository,
}: {
  children: ReactNode;
  repository?: ProgressRepository;
}) {
  const [progress, setProgress] = useState(emptyProgress);
  const current = useRef(progress);
  const repo = useRef(repository);
  const queue = useRef(Promise.resolve());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        repo.current ??= new LocalProgressRepository(window.localStorage);
        const saved = await repo.current.load();
        if (active) {
          current.current = saved;
          setProgress(saved);
          setError("");
          setReady(true);
        }
      } catch {
        if (active)
          setError(
            "Saved progress could not be read. Retry or explicitly reset it; the existing data has not been overwritten.",
          );
      }
    })();
    return () => {
      active = false;
    };
  }, [attempt]);
  const update = (fn: (p: Progress) => Progress) => {
    const next = fn(current.current);
    current.current = next;
    setProgress(next);
    queue.current = queue.current
      .then(() => repo.current!.save(next))
      .then(() => setError(""))
      .catch(() =>
        setError(
          "Your changes are in memory, but could not be saved. Retry saving before closing this page.",
        ),
      );
  };
  const retry = () => {
    if (!ready) setAttempt((a) => a + 1);
    else update((p) => p);
  };
  const reset = async () => {
    try {
      await queue.current;
      repo.current ??= new LocalProgressRepository(window.localStorage);
      await repo.current.clear();
      const clean = emptyProgress();
      current.current = clean;
      setProgress(clean);
      setError("");
      setReady(true);
    } catch {
      setError(
        "Progress could not be reset. Browser storage may be unavailable.",
      );
    }
  };
  if (!ready)
    return (
      <main className="boot">
        <h1>Preparing your workspace</h1>
        {error ? (
          <>
            <p role="alert">{error}</p>
            <button onClick={retry}>Retry loading</button>
            <button
              className="secondary"
              onClick={() => {
                if (window.confirm("Delete locally saved progress and drafts?"))
                  void reset();
              }}
            >
              Reset saved progress
            </button>
            <button
              className="secondary"
              onClick={() => {
                repo.current = {
                  load: async () => emptyProgress(),
                  save: async () => {
                    throw new Error("Session only");
                  },
                  clear: async () => {},
                };
                setReady(true);
                setError(
                  "Session-only mode: browser storage is unavailable. Progress will not survive reload.",
                );
              }}
            >
              Continue without persistence
            </button>
          </>
        ) : (
          <p>Reading your saved progress…</p>
        )}
      </main>
    );
  return (
    <ProgressContext.Provider
      value={{
        progress,
        update,
        complete: (id, passed) =>
          update((p) => completeExercise(p, id, passed)),
        reset,
        error,
        retry,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("ProgressProvider required");
  return context;
}
