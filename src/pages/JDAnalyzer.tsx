import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { analyzeJobDescription } from "../utils/jobAnalyzer";
import { extractTextFromFiles } from "../utils/fileReader";
import type { JobAnalysis } from "../types/job";
import { Badge } from "../components/Badge";

const SAMPLE_JD = `Job Title: Junior Data Analyst
Company: Contoh Teknologi Indonesia
Location: Jakarta (Hybrid)

Job Description:
We are looking for a Junior Data Analyst to join our growing team.

Responsibilities:
- Collect and clean data from multiple internal sources
- Build dashboards and reports using Power BI and Tableau
- Support ad-hoc data analysis requests from the business team

Requirements:
- Bachelor's degree in a related field
- 0-2 years of experience
- Proficient in Python, SQL, and Excel
- Familiar with Power BI or Tableau
- Strong communication and problem solving skills

Please send your CV and portfolio. Application deadline: 30 September 2026.`;

function SummaryRow({ label, value, detected }: { label: string; value: string; detected: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-b border-surface-border py-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <span className={`text-sm ${detected ? "text-ink" : "italic text-ink-soft/70"}`}>{value}</span>
    </div>
  );
}

function CheckRow({ label, status }: { label: string; status: "ok" | "review" }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
          status === "ok" ? "bg-match-soft text-match" : "bg-signal-soft text-signal"
        }`}
        aria-hidden="true"
      >
        {status === "ok" ? "✓" : "!"}
      </span>
      <span className="text-ink-soft">{label}</span>
    </li>
  );
}

export function JDAnalyzer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JobAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsingFiles, setIsParsingFiles] = useState(false);
  const [parseProgress, setParseProgress] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleScreenshotUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setIsParsingFiles(true);
    setFileError(null);
    setParseProgress(files.length > 1 ? "Reading screenshots…" : "Reading screenshot…");

    try {
      const { text, skippedCount } = await extractTextFromFiles(files, (current, total, message) => {
        setParseProgress(total > 1 ? `Image ${current} of ${total}: ${message}` : message);
      });
      setInput(text);
      setResult(null);
      if (skippedCount > 0) {
        setFileError(`Only the first 6 images were processed (${skippedCount} skipped).`);
      }
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "We couldn't read those images.");
    } finally {
      setIsParsingFiles(false);
      setParseProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleAnalyze(event: FormEvent) {
    event.preventDefault();

    if (!input.trim()) {
      setError("Please paste a job description before analyzing.");
      setResult(null);
      return;
    }
    if (input.trim().length < 40) {
      setError("This looks too short to be a full job description. Please paste the complete posting.");
      setResult(null);
      return;
    }

    setError(null);
    setResult(analyzeJobDescription(input));
  }

  function handleUseSample() {
    setInput(SAMPLE_JD);
    setError(null);
    setResult(null);
  }

  function handleClear() {
    setInput("");
    setResult(null);
    setError(null);
    setFileError(null);
  }

  const checks = result?.checks;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="eyebrow mb-3">Job Description Analyzer</p>
      <h1 className="text-3xl font-bold sm:text-4xl">Understand a job posting in seconds</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Paste a job description, or upload one or more screenshots of the posting. Everything —
        including screenshot text recognition — runs in your browser; nothing is uploaded to a
        server.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <form onSubmit={handleAnalyze} className="card flex flex-col">
          <div className="flex items-center justify-between">
            <label htmlFor="jd-input" className="text-sm font-semibold text-ink">
              Job description
            </label>
            <label className="cursor-pointer text-sm font-medium text-blueprint-600 hover:underline">
              Upload screenshot(s)
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleScreenshotUpload}
                className="sr-only"
                aria-label="Upload one or more screenshots of the job posting"
              />
            </label>
          </div>

          {isParsingFiles && (
            <p className="mt-1 text-xs text-blueprint-600">{parseProgress ?? "Reading screenshot…"}</p>
          )}
          {fileError && (
            <p role="alert" className="mt-1 text-xs font-medium text-warn">
              {fileError}
            </p>
          )}

          <textarea
            id="jd-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste the full job posting here, or upload one or more screenshots above..."
            rows={16}
            className="mt-2 w-full resize-y rounded-md border border-surface-border p-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none"
            aria-describedby={error ? "jd-error" : undefined}
          />

          {error && (
            <p id="jd-error" role="alert" className="mt-2 text-sm font-medium text-warn">
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={isParsingFiles}>
              Analyze Job
            </button>
            <button type="button" onClick={handleUseSample} className="btn-secondary">
              Use a sample posting
            </button>
            {input && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-auto text-sm font-medium text-ink-soft hover:text-warn"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Results */}
        <div className="flex flex-col gap-6">
          {!result && (
            <div className="card flex h-full flex-col items-center justify-center gap-2 py-16 text-center text-ink-soft">
              <p className="font-medium text-ink">No analysis yet</p>
              <p className="max-w-xs text-sm">
                Paste a job description on the left and click "Analyze Job" to see the summary
                here.
              </p>
            </div>
          )}

          {result && (
            <>
              <div className="card">
                <p className="eyebrow mb-3">Job Summary</p>

                <SummaryRow label="Position" value={result.position.value} detected={result.position.detected} />
                <SummaryRow label="Company" value={result.company.value} detected={result.company.detected} />
                <SummaryRow label="Location" value={result.location.value} detected={result.location.detected} />
                <SummaryRow label="Experience" value={result.experience.value} detected={result.experience.detected} />
                <SummaryRow label="Education" value={result.education.value} detected={result.education.detected} />

                <div className="pt-3">
                  <span className="text-sm font-medium text-ink-soft">Skills mentioned</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.skills.length > 0 ? (
                      result.skills.map((skill) => (
                        <Badge key={skill} tone="blueprint">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm italic text-ink-soft/70">
                        No skills from our dictionary were detected.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {(result.responsibilities.length > 0 || result.requirements.length > 0) && (
                <div className="card grid gap-6 sm:grid-cols-2">
                  {result.responsibilities.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3">Responsibilities</p>
                      <ul className="space-y-2 text-sm text-ink-soft">
                        {result.responsibilities.map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span aria-hidden="true">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.requirements.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3">Requirements</p>
                      <ul className="space-y-2 text-sm text-ink-soft">
                        {result.requirements.map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span aria-hidden="true">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {checks && (
                <div className="card">
                  <p className="eyebrow mb-1">Potential things to review</p>
                  <p className="mb-4 text-sm text-ink-soft">
                    These are informational checks based on keywords in the posting — not a
                    judgment about whether the listing is legitimate.
                  </p>
                  <ul className="space-y-3">
                    <CheckRow
                      label={checks.salaryDisclosed ? "Salary information is disclosed" : "Salary is not disclosed in the posting"}
                      status={checks.salaryDisclosed ? "ok" : "review"}
                    />
                    <CheckRow
                      label={
                        checks.experienceStated
                          ? `Experience requirement stated: ${result.experience.value}`
                          : "Experience requirement not clearly stated"
                      }
                      status={checks.experienceStated ? "ok" : "review"}
                    />
                    <CheckRow
                      label={
                        checks.locationStated
                          ? `Location mentioned: ${result.location.value}`
                          : "Location not clearly mentioned"
                      }
                      status={checks.locationStated ? "ok" : "review"}
                    />
                    <CheckRow
                      label={`Work arrangement: ${checks.workArrangement.value}`}
                      status={checks.workArrangement.detected ? "ok" : "review"}
                    />
                    <CheckRow
                      label={checks.deadlineStated ? "Application deadline is mentioned" : "No application deadline mentioned"}
                      status={checks.deadlineStated ? "ok" : "review"}
                    />
                    <CheckRow
                      label={
                        checks.requiredDocuments.length > 0
                          ? `Documents mentioned: ${checks.requiredDocuments.join(", ")}`
                          : "No specific required documents mentioned"
                      }
                      status={checks.requiredDocuments.length > 0 ? "ok" : "review"}
                    />
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
