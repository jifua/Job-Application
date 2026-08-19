import { Link } from "react-router-dom";
import { TOOLS } from "../data/tools";
import { ToolIcon } from "../components/ToolIcon";
import { MatchGauge } from "../components/MatchGauge";

const STEPS = [
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
];

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-surface-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="eyebrow mb-4">Free tools for smarter job applications</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Make Your Job Application Smarter
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              Free tools to analyze job descriptions, match your CV, prepare applications, and
              practice interviews — all in your browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/jd-analyzer" className="btn-primary">
                Analyze a Job
              </Link>
              <Link to="/cv-matcher" className="btn-secondary">
                Explore Tools
              </Link>
            </div>
          </div>

          {/* Signature element: schematic "match gauge" card */}
          <div className="card mx-auto w-full max-w-sm">
            <p className="eyebrow">CV Matcher — preview</p>
            <div className="mt-4 flex items-center gap-4">
              <MatchGauge score={82} size={96} />
              <div className="space-y-1.5 text-sm">
                <p className="flex items-center gap-1.5 text-match">
                  <span aria-hidden="true">✓</span> Python, SQL, Excel
                </p>
                <p className="flex items-center gap-1.5 text-warn">
                  <span aria-hidden="true">×</span> Tableau, Data Viz
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-soft">
              Based on keyword matching — not a prediction of hiring success.
            </p>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold">The toolkit</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Five focused tools that cover the parts of applying that actually take time.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <div key={tool.id} className="card flex flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blueprint-50 text-blueprint-600">
                <ToolIcon icon={tool.icon} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{tool.name}</h3>
              <p className="mt-1.5 flex-1 text-sm text-ink-soft">{tool.description}</p>
              <Link
                to={tool.path}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blueprint-600 hover:underline"
              >
                Try Now <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-surface-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold">How it works</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span className="font-mono text-sm font-semibold text-blueprint-500">
                  {step.number}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Your CV stays on your device.</h2>
            <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">
              This toolkit processes your CV and job descriptions locally in your browser
              wherever possible. Nothing is uploaded to a server just to run an analysis.
            </p>
          </div>
          <Link to="/about" className="btn-secondary shrink-0">
            Read the privacy page
          </Link>
        </div>
      </section>
    </div>
  );
}
