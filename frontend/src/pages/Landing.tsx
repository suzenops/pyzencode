import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "../components/Shared";
export function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Brand />
        <div>
          <Link to="/curriculum" className="quiet-link">
            Explore the curriculum
          </Link>
          <Link to="/dashboard" className="button secondary">
            Enter workspace <ArrowRight size={15} />
          </Link>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="live-dot" /> YOUR FIRST LINE STARTS HERE
            </span>
            <h1>
              Understand the code.
              <br />
              <span>Own the possibility.</span>
            </h1>
            <p>
              Python, from the very beginning. A thoughtful place to learn,
              experiment, make mistakes—and understand why.
            </p>
            <div className="hero-actions">
              <Link to="/lesson/a" className="button">
                Start learning <ArrowRight size={17} />
              </Link>
              <Link to="/playground" className="button secondary">
                Open playground
              </Link>
            </div>
            <div className="hero-note">
              <ShieldCheck size={15} />
              No account. No API key. Just curiosity.
            </div>
          </div>
          <div className="hero-code">
            <div className="window-bar">
              <i />
              <i />
              <i />
              <span>your_first_program.py</span>
            </div>
            <div className="hero-code-body">
              <span className="line-number">1</span>
              <span className="code-comment">
                # Every journey starts somewhere.
              </span>
              <br />
              <span className="line-number">2</span>
              <span className="code-fn">print</span>(
              <span className="code-string">"Hello, World!"</span>)<br />
              <span className="line-number">3</span>
              <span className="cursor"> </span>
            </div>
            <div className="hero-output">
              <span>ILLUSTRATIVE EXPECTED OUTPUT</span>
              <pre>Hello, World!</pre>
            </div>
            <div className="floating-note">
              <Sparkles size={16} />
              <div>
                Small steps. Real understanding.
                <small>Learn. Break. Fix. Master.</small>
              </div>
            </div>
          </div>
        </section>
        <section className="learning-strip">
          <div>
            <span>01 / LEARN</span>
            <h3>Nothing left unexplained.</h3>
            <p>From the first quotation mark to the last parenthesis.</p>
          </div>
          <div>
            <span>02 / EXPERIMENT</span>
            <h3>Run real Python.</h3>
            <p>A working interpreter, right in your browser.</p>
          </div>
          <div>
            <span>03 / UNDERSTAND</span>
            <h3>Let mistakes teach you.</h3>
            <p>Read the clues. Make a change. See what happens.</p>
          </div>
        </section>
        <section className="landing-course">
          <div>
            <span className="eyebrow">A CLEAR PATH FORWARD</span>
            <h2>
              Start with one line.
              <br />
              Build from there.
            </h2>
            <p>
              Seven levels planned. Your first complete lesson is ready now.
            </p>
            <Link className="text-button" to="/curriculum">
              Explore your learning path <ArrowRight size={16} />
            </Link>
          </div>
          <Link to="/lesson/a" className="featured-lesson">
            <span className="pill">LEVEL 01 · AVAILABLE NOW</span>
            <h3>Your First Python Program</h3>
            <p>
              Understand Python and print(), practice with ten real exercises,
              and learn to repair common mistakes.
            </p>
            <span>
              Begin lesson <ArrowRight size={18} />
            </span>
          </Link>
        </section>
      </main>
      <footer>
        <Brand />
        <span>Learn. Break. Fix. Master.</span>
        <span>Built for the beginning.</span>
      </footer>
    </div>
  );
}
