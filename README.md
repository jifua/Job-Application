# Job Application Toolkit

**Free tools for smarter job applications.**

A free, privacy-friendly web app that helps jobseekers analyze job descriptions, match their
CV against a role, draft cover letters, practice interviews, and track applications — without
needing an account, a server, or a paid API.

> **Status:** Phase 6 — all five tools are functional: Home, Job Description Analyzer, CV
> Matcher, Cover Letter Generator, Interview Practice, and Application Tracker. Remaining
> roadmap items are polish/testing (accessibility pass, unit tests) and deployment; see
> [Roadmap](#future-improvements).

## Features

| Tool | What it does |
|---|---|
| **CV Matcher** | Compares your CV against a job description and shows a match score, matched skills, and missing skills. |
| **Job Description Analyzer** | Extracts position, skills, experience level, and things to double-check from a pasted job posting. |
| **Cover Letter Generator** | Fills a simple form into a clean, editable cover letter draft — no AI API involved. |
| **Interview Practice** | Common interview questions by role, with tips and a prep/answer timer. |
| **Application Tracker** | Tracks applications with status and deadlines, saved locally on your device, with stats like interview rate. |

All analysis is designed to run **locally in your browser** wherever possible — your CV is not
sent to a server just to be analyzed.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — dev server and build tool
- **Tailwind CSS** — styling
- **react-router-dom** — client-side routing
- **pdfjs-dist** — extracts text from uploaded PDF CVs, entirely in the browser (no server
  upload). Dynamically imported only when a user actually uploads a PDF, so it doesn't add to
  the initial page load for everyone else.
- No backend, no database, no paid APIs for the MVP.

## Screenshots

_Add screenshots here once the UI is finalized._

## How to Run

Requires [Node.js](https://nodejs.org/) 18+ and npm.

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# type-check + build for production
npm run build

# preview the production build locally
npm run preview
```

## Project Structure

```
src/
├── components/   # Reusable UI pieces (Navbar, Footer, ToolIcon, ...)
├── pages/        # One file per route (Home, CVMatcher, JDAnalyzer, ...)
├── layouts/      # Page shells (MainLayout: navbar + outlet + footer)
├── hooks/        # Custom React hooks (added from Phase 3 onward)
├── utils/        # Pure logic, no UI (textNormalizer, skillMatcher, ...)
├── data/         # Static data (tools list, skill dictionary, interview questions)
├── types/        # Shared TypeScript types
├── services/     # LocalStorage read/write helpers (Tracker, Phase 6)
├── App.tsx       # Route definitions
└── main.tsx      # App entry point
```

Logic is kept separate from UI: components render, `utils/` functions compute. This keeps the
matching and scoring logic easy to unit test independent of React.

## How Matching Works

The CV Matcher and JD Analyzer use a transparent, deterministic keyword-matching algorithm —
**no AI model or external API**:

1. Extract text from the pasted CV / job description (or an uploaded PDF/TXT file).
2. Normalize the text: lowercase, strip punctuation, collapse whitespace.
3. Compare against a curated skill/keyword dictionary (with common aliases, e.g. "JS" ↔
   "JavaScript").
4. Compute `matched skills ÷ required skills × 100` for the match score.

The score reflects keyword overlap only. It is **not** an ATS score and **not** a prediction of
hiring success — this is stated in the UI itself.

## Privacy

- Your CV is processed locally in the browser wherever possible; it is not uploaded to a
  server just to run an analysis.
- The Application Tracker saves its data in your browser's `localStorage`, on your device
  only. There is no account and no cloud sync in this version — clearing browser data or
  switching devices/browsers will remove it, so use the **Export Data** feature (added in
  Phase 6) to back it up.
- No CV or job description content is sent to third-party AI APIs.
- See the in-app **About & Privacy** page for the full explanation.

## Future Improvements

- Expand the skill dictionary and add more synonym coverage.
- Downloadable cover letter as `.docx` in addition to `.txt`.
- Track status-change history in the tracker (not just current status) for more accurate
  interview/response rate metrics over time.
- Optional PWA support ("install" the app / use offline) once the MVP is stable.
- Unit tests for the pure logic in `utils/` (normalize text, skill matching, score calculation,
  cover letter generation, tracker stats).

_Explicitly out of scope for the MVP: user accounts, cloud sync, a real ATS score, AI-generated
(LLM-based) cover letters, and automatic job recommendations._

## Deployment

This is a static frontend (no backend), so it can be deployed for free on any static hosting
platform, for example:

- **Vercel** — `vercel.com`, connects directly to a GitHub repo, auto-deploys on push.
- **Netlify** — `netlify.com`, same workflow, generous free tier.
- **Cloudflare Pages** — `pages.cloudflare.com`, free tier, fast global CDN.
- **GitHub Pages** — free, works well for a purely static Vite build.

Build command: `npm run build` · Output directory: `dist`
