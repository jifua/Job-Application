import type { ToolSummary } from "../types/tools";

export const TOOLS: ToolSummary[] = [
  {
    id: "cv-matcher",
    name: "CV Matcher",
    description:
      "Compare your CV against a job description and see which skills match, which are missing, and what to add.",
    path: "/cv-matcher",
    icon: "match",
  },
  {
    id: "jd-analyzer",
    name: "Job Description Analyzer",
    description:
      "Paste a job posting to pull out the role, required skills, experience level, and things worth double-checking.",
    path: "/jd-analyzer",
    icon: "analyze",
  },
  {
    id: "cover-letter",
    name: "Cover Letter Generator",
    description:
      "Fill in a short form and get a clean cover letter draft you can copy, edit, and download.",
    path: "/cover-letter",
    icon: "letter",
  },
  {
    id: "interview-practice",
    name: "Interview Practice",
    description:
      "Pick a role and rehearse common interview questions with tips and a simple prep/answer timer.",
    path: "/interview-practice",
    icon: "practice",
  },
  {
    id: "tracker",
    name: "Application Tracker",
    description:
      "Keep every application in one place, with status, deadlines, and stats — saved only on your device.",
    path: "/tracker",
    icon: "tracker",
  },
];
