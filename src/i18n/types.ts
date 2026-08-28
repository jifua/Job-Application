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
  tracker: {
    eyebrow: string;
    title: string;
    subtitle: string;
    addFromScreenshot: string;
    readingScreenshot: string;
    addApplication: string;
    addFirstApplication: string;
    loading: string;
    emptyTitle: string;
    emptyBody: string;
    screenshotOnlyFirstSix: string;
    screenshotNoFieldsFound: string;
    screenshotReadError: string;
    statTotal: string;
    statInterviews: string;
    statTests: string;
    statOffers: string;
    statRejected: string;
    statGhosted: string;
    statPending: string;
    statInterviewRate: string;
    statResponseRate: string;
    statOfferRate: string;
    statGhostRate: string;
    rateDisclaimer: string;
    searchLabel: string;
    searchPlaceholder: string;
    statusFilterLabel: string;
    statusFilterAll: string;
    sortLabel: string;
    sortOptions: Record<"deadline" | "applicationDate" | "company", string>;
    noResultsMatch: string;
    yourDataTitle: string;
    yourDataBody: string;
    exportJson: string;
    exportXlsx: string;
    exportXlsxPreparing: string;
    importJson: string;
    clearAllData: string;
    importedSuccess: string;
    importGenericError: string;
    deleteConfirmTitle: string;
    deleteConfirmDescription: string;
    deleteConfirmButton: string;
    clearConfirmTitle: string;
    clearConfirmDescription: string;
    clearConfirmButton: string;
    form: {
      editTitle: string;
      addTitle: string;
      autoDetectedNotice: string;
      company: string;
      companyPlaceholder: string;
      position: string;
      positionPlaceholder: string;
      location: string;
      locationPlaceholder: string;
      appliedVia: string;
      status: string;
      applicationDate: string;
      deadline: string;
      optional: string;
      jobUrl: string;
      jobDescription: string;
      jobDescriptionPlaceholder: string;
      qualifications: string;
      qualificationsPlaceholder: string;
      notes: string;
      notesPlaceholder: string;
      autoDetected: string;
      requiredFieldsError: string;
      saveChanges: string;
      addApplication: string;
      cancel: string;
    };
    card: {
      ghostWarning: string;
      applied: string;
      deadlineLabel: string;
      deadlinePassed: string;
      deadlineSoon: string;
      viewPosting: string;
      updateStatus: string;
      edit: string;
      delete: string;
    };
    status: Record<
      "applied" | "screening" | "test" | "interview" | "offer" | "rejected" | "ghosted" | "withdrawn",
      string
    >;
    site: Record<
      "jobstreet" | "glints" | "dealls" | "talentic" | "linkedin" | "company_site" | "email" | "referral" | "other",
      string
    >;
  };
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
