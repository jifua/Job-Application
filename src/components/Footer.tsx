import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} Job Application Toolkit. Free tools for smarter job applications.</p>
        <Link to="/about" className="font-medium text-blueprint-600 hover:underline">
          About &amp; Privacy
        </Link>
      </div>
    </footer>
  );
}
