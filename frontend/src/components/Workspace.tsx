import { lazy, Suspense, type ComponentProps } from "react";
const Editor = lazy(() =>
  import("./CodeWorkspace").then((module) => ({
    default: module.CodeWorkspace,
  })),
);
export function CodeWorkspace(props: ComponentProps<typeof Editor>) {
  return (
    <Suspense
      fallback={
        <div className="panel" role="status">
          Loading the code editor…
        </div>
      }
    >
      <Editor {...props} />
    </Suspense>
  );
}
