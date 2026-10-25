import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/Shared";
import { CodeWorkspace } from "../components/Workspace";
import { tutorAvailability } from "../tutor";
export function Playground() {
  return (
    <>
      <PageTitle
        label="YOUR EXPERIMENT SPACE"
        title="What happens if…?"
        subtitle="Change a line. Make a prediction. Run real Python and see for yourself."
      />
      <div className="playground-grid">
        <CodeWorkspace id="playground" />
        <aside>
          <div className="panel">
            <h3>Start small.</h3>
            <p>
              Try changing the message, adding another print call, or comparing
              a number with quoted text.
            </p>
            <pre>
              print(5 + 5)
              <br />
              print("5" + "5")
            </pre>
            <Link to="/lesson/f" className="text-button">
              Understand the difference <ArrowRight size={14} />
            </Link>
          </div>
          <div className="panel">
            <h3>About this workspace</h3>
            <p>
              Your code runs in a browser worker, never on the FastAPI server.
              Runs stop after 3 seconds. Output is limited to 8,192 characters.
            </p>
            <p>
              Prepare input lines before running input(). Installing extra
              packages is not supported in this version. Avoid entering
              passwords or private information into code.
            </p>
          </div>
          <div className="panel">
            <span className="pill muted">{tutorAvailability.label}</span>
            <p>
              Current error explanations are written learning guidance, not live
              AI responses.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
