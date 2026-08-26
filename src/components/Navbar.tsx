import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, t, toggleLang } = useLanguage();

  const navLinks = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.cvMatcher, path: "/cv-matcher" },
    { label: t.nav.jdAnalyzer, path: "/jd-analyzer" },
    { label: t.nav.coverLetter, path: "/cover-letter" },
    { label: t.nav.interviewPractice, path: "/interview-practice" },
    { label: t.nav.tracker, path: "/tracker" },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blueprint-50 text-blueprint-600"
        : "text-ink-soft hover:text-blueprint-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6"
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
          <span className="hidden sm:inline">Job Application Toolkit</span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass} end={link.path === "/"}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle lang={lang} onToggle={toggleLang} />
          <NavLink to="/cv-matcher" className="btn-primary">
            {t.nav.tryTools}
          </NavLink>
        </div>

        {/* Mobile: language toggle always visible, menu toggle for links */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle lang={lang} onToggle={toggleLang} />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-surface-border p-2 text-ink"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
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
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-menu" className="border-t border-surface-border bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
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
              {t.nav.tryTools}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * Simple ID/EN switch. Shows both options so it's obvious it's a toggle,
 * not just a label — this matters for jobseekers who don't read English
 * and need to recognize "ID" without already knowing what the button does.
 */
function LanguageToggle({ lang, onToggle }: { lang: "id" | "en"; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center rounded-full border border-surface-border bg-white p-0.5 text-xs font-semibold"
      aria-label={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      <span
        className={`rounded-full px-2 py-1 transition-colors ${
          lang === "id" ? "bg-blueprint-600 text-white" : "text-ink-soft"
        }`}
      >
        ID
      </span>
      <span
        className={`rounded-full px-2 py-1 transition-colors ${
          lang === "en" ? "bg-blueprint-600 text-white" : "text-ink-soft"
        }`}
      >
        EN
      </span>
    </button>
  );
}
