import type { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    home: "Home",
    cvMatcher: "CV Matcher",
    jdAnalyzer: "JD Analyzer",
    coverLetter: "Cover Letter",
    interviewPractice: "Interview Practice",
    tracker: "Tracker",
    tryTools: "Try the Tools",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    tagline: "Job Application Toolkit. Free tools for smarter job applications.",
    aboutPrivacy: "About & Privacy",
  },
  home: {
    eyebrow: "Free tools for smarter job applications",
    title: "Make Your Job Application Smarter",
    subtitle:
      "Free tools to analyze job descriptions, match your CV, prepare applications, and practice interviews — all in your browser.",
    ctaAnalyze: "Analyze a Job",
    ctaExplore: "Explore Tools",
    previewLabel: "CV Matcher — preview",
    previewMatch: "Python, SQL, Excel",
    previewMissing: "Tableau, Data Viz",
    previewDisclaimer: "Based on keyword matching — not a prediction of hiring success.",
    toolkitTitle: "The toolkit",
    toolkitSubtitle: "Five focused tools that cover the parts of applying that actually take time.",
    tryNow: "Try Now",
    howItWorksTitle: "How it works",
    steps: [
      {
        number: "01",
        title: "Paste your job description",
        description: "Drop in a posting from anywhere — LinkedIn, a company site, or a recruiter email.",
      },
      {
        number: "02",
        title: "Analyze your skills",
        description: "See exactly which required skills your CV already covers, and which ones are missing.",
      },
      {
        number: "03",
        title: "Improve your application",
        description: "Use the gaps to tailor your CV, draft a cover letter, and prep for the interview.",
      },
    ],
    privacyTitle: "Your CV stays on your device.",
    privacyBody:
      "This toolkit processes your CV and job descriptions locally in your browser wherever possible. Nothing is uploaded to a server just to run an analysis.",
    privacyCta: "Read the privacy page",
  },
  tools: {
    "cv-matcher": {
      name: "CV Matcher",
      description:
        "Compare your CV against a job description and see which skills match, which are missing, and what to add.",
      cta: "Try Now",
    },
    "jd-analyzer": {
      name: "Job Description Analyzer",
      description:
        "Paste a job posting to pull out the role, required skills, experience level, and things worth double-checking.",
      cta: "Try Now",
    },
    "cover-letter": {
      name: "Cover Letter Generator",
      description: "Fill in a short form and get a clean cover letter draft you can copy, edit, and download.",
      cta: "Try Now",
    },
    "interview-practice": {
      name: "Interview Practice",
      description:
        "Pick a role and rehearse common interview questions with tips and a simple prep/answer timer.",
      cta: "Try Now",
    },
    tracker: {
      name: "Application Tracker",
      description:
        "Keep every application in one place, with status, deadlines, and stats — saved only on your device.",
      cta: "Try Now",
    },
  },
  about: {
    title: "About & Privacy",
    intro:
      "Job Application Toolkit is a free set of tools to help jobseekers analyze job descriptions, match their CV against a role, draft cover letters, and practice interviews.",
    privacyTitle: "Privacy",
    privacyParagraphs: [
      "Your CV is not stored on a server for the core tools — analysis is designed to run locally in your browser wherever possible.",
      "The Application Tracker saves the data you enter (company, position, status, and so on) in your browser's local storage, on your own device. It is not sent anywhere.",
      "No CV or job description content is sent to third-party AI APIs by this toolkit.",
      "Screenshot uploads (for the Job Description Analyzer or CV Matcher) are read using on-device text recognition — the image itself is never uploaded anywhere. The first time you use this feature, your browser downloads the recognition engine from a public library CDN (not this app's server); after that it's cached locally.",
      "You can clear your locally saved tracker data at any time from the Tracker page, or back it up first using Export Data (downloads a JSON file you can re-import later or on another device via Import Data). Clearing your browser data, using a different browser, or switching devices will remove this local data — there is no account or automatic cloud backup in this version.",
    ],
    disclaimer: "This is general information about how the app is built, not an absolute security guarantee.",
  },
  common: {
    skipToContent: "Skip to content",
  },
};
