export type Language = "id" | "en";

export interface ToolCopy {
  name: string;
  description: string;
  cta: string;
}

/**
 * Shape of the translation dictionary. Keep this flat-ish and grouped by
 * page/section so it's easy to find a string and add a new one without
 * hunting through nested objects. New pages should add a new top-level
 * key here (e.g. `cvMatcher`, `jdAnalyzer`) as they get translated.
 */
export interface Dictionary {
  nav: {
    home: string;
    cvMatcher: string;
    jdAnalyzer: string;
    coverLetter: string;
    interviewPractice: string;
    tracker: string;
    tryTools: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    tagline: string;
    aboutPrivacy: string;
  };
  home: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaAnalyze: string;
    ctaExplore: string;
    previewLabel: string;
    previewMatch: string;
    previewMissing: string;
    previewDisclaimer: string;
    toolkitTitle: string;
    toolkitSubtitle: string;
    tryNow: string;
    howItWorksTitle: string;
    steps: { number: string; title: string; description: string }[];
    privacyTitle: string;
    privacyBody: string;
    privacyCta: string;
  };
  tools: Record<string, ToolCopy>;
  about: {
    title: string;
    intro: string;
    privacyTitle: string;
    privacyParagraphs: string[];
    disclaimer: string;
  };
  common: {
    skipToContent: string;
  };
}
