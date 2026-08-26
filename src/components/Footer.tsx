import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-surface-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} {t.footer.tagline}</p>
        <Link to="/about" className="font-medium text-blueprint-600 hover:underline">
          {t.footer.aboutPrivacy}
        </Link>
      </div>
    </footer>
  );
}
