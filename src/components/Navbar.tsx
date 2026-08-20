import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "CV Matcher", path: "/cv-matcher" },
  { label: "JD Analyzer", path: "/jd-analyzer" },
  { label: "Cover Letter", path: "/cover-letter" },
  { label: "Interview Practice", path: "/interview-practice" },
  { label: "Tracker", path: "/tracker" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blueprint-50 text-blueprint-600"
        : "text-ink-soft hover:text-blueprint-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Main navigation"
      >
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold text-ink"
          onClick={() => setIsOpen(false)}
        >
          <img
            src="/logo-navbar.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-cover"
          />
          Job Application Toolkit
        </NavLink>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass} end={link.path === "/"}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <NavLink to="/cv-matcher" className="btn-primary">
            Try the Tools
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-surface-border p-2 text-ink md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-menu" className="border-t border-surface-border bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={linkClass}
                end={link.path === "/"}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/cv-matcher"
              className="btn-primary mt-2 justify-center"
              onClick={() => setIsOpen(false)}
            >
              Try the Tools
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
