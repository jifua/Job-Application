import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Dictionary, Language } from "./types";
import { en } from "./en";
import { id } from "./id";

const STORAGE_KEY = "jobAppToolkit.lang";
const DICTIONARIES: Record<Language, Dictionary> = { en, id };

interface LanguageContextValue {
  lang: Language;
  t: Dictionary;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "id" || saved === "en") return saved;
  } catch {
    // localStorage unavailable (private mode, disabled) — fall through to browser detection
  }
  // Default to Indonesian unless the browser is clearly set to English,
  // since most of this toolkit's audience is Indonesian jobseekers.
  const browserLang = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "id";
  return browserLang.startsWith("en") ? "en" : "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore — storage may be disabled
    }
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      t: DICTIONARIES[lang],
      setLang: setLangState,
      toggleLang: () => setLangState((prev) => (prev === "id" ? "en" : "id")),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** Access the current language, its dictionary (`t`), and setters. */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
