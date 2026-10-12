import {
  BarChart3,
  BookOpen,
  Bug,
  Code2,
  Layers,
  LayoutDashboard,
  Menu,
  Terminal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Brand } from "../components/Shared";
import { Curriculum } from "../pages/Curriculum";
import { Dashboard } from "../pages/Dashboard";
import { Lab } from "../pages/Lab";
import { Lesson } from "../pages/Lesson";
import { Playground } from "../pages/Playground";
import { ProgressPage } from "../pages/ProgressPage";
import { useProgress } from "../progress/ProgressProvider";
const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/curriculum", label: "Curriculum", icon: Layers },
  { to: "/lesson/a", label: "Lesson reader", icon: BookOpen },
  { to: "/playground", label: "Playground", icon: Code2 },
  { to: "/lab/1", label: "Coding lab", icon: Terminal },
  { to: "/debug/1", label: "Debug Lab", icon: Bug },
  { to: "/progress", label: "Your progress", icon: BarChart3 },
];
export function Shell() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { error, retry } = useProgress();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <Brand />
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        <div className="sidebar-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                isActive ||
                location.pathname.startsWith(n.to.replace(/\/(a|1)$/, ""))
                  ? "active"
                  : ""
              }
            >
              <n.icon size={18} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-logo">01</div>
          <div>
            Python Foundations<small>Learn. Break. Fix. Master.</small>
          </div>
        </div>
      </aside>
      {open && (
        <button
          className="nav-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
      <div className="app-content">
        <header className="workspace-header">
          <button
            className="mobile-menu icon-button"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <span>THE BEGINNER’S WORKSPACE</span>
          <div>
            <span className="local-badge">
              <span className="live-dot" />
              Local progress
            </span>
            <Link
              to="/progress"
              className="workspace-profile"
              aria-label="Your learning progress"
            >
              PZ
            </Link>
          </div>
        </header>
        <main id="main" className="main-content">
          {error && (
            <div className="storage-alert" role="alert">
              <span>{error}</span>
              <button className="secondary" onClick={retry}>
                Retry saving
              </button>
            </div>
          )}
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="curriculum" element={<Curriculum />} />
            <Route path="lesson/:section?" element={<Lesson />} />
            <Route path="playground" element={<Playground />} />
            <Route path="lab/:number" element={<Lab />} />
            <Route path="debug/:number" element={<Lab debug />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route
              path="*"
              element={
                <div>
                  <h1>Page not found</h1>
                  <Link to="/dashboard">Return to your workspace</Link>
                </div>
              }
            />
          </Routes>
        </main>
        <footer className="workspace-footer">
          <span>Stay curious. Make something.</span>
          <span>Python Foundations · Version 01</span>
        </footer>
      </div>
    </div>
  );
}
