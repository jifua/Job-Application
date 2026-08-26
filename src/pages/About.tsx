import { useLanguage } from "../i18n/LanguageContext";

export function About() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">{t.about.title}</h1>
      <p className="mt-4 text-ink-soft">{t.about.intro}</p>

      <h2 className="mt-10 text-xl font-bold">{t.about.privacyTitle}</h2>
      <div className="mt-4 space-y-4 text-ink-soft">
        {t.about.privacyParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <p className="text-sm">{t.about.disclaimer}</p>
      </div>
    </div>
  );
}
