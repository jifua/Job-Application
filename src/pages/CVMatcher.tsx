import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { matchCvToJob } from "../utils/skillMatcher";
import { extractTextFromFile } from "../utils/fileReader";
import type { CvMatchResult } from "../types/cv";
import { Badge } from "../components/Badge";
import { MatchGauge } from "../components/MatchGauge";

const SAMPLE_CV = `Jane Doe
Fresh graduate in Statistics, Universitas Indonesia

Skills: Python, SQL, Excel, Power BI, Communication, Teamwork

Experience:
- Data Analysis intern at a fintech startup, built weekly reporting dashboards
- Built a course project analyzing survey data using Python and Excel`;

const SAMPLE_JD = `Junior Data Analyst

Requirements:
- Bachelor's degree in a related field
- Proficient in Python, SQL, and Excel
- Familiar with Power BI or Tableau
- Experience with data visualization
- Strong communication and problem solving skills`;

function SkillList({
  title,
  skills,
  tone,
  emptyText,
}: {
  title: string;
  skills: string[];
  tone: "match" | "warn" | "blueprint";
  emptyText: string;
}) {
  return (
    <div>
      <p className="eyebrow mb-2">{title}</p>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} tone={tone}>
              {tone === "match" ? "✓ " : tone === "warn" ? "× " : ""}
              {skill}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm italic text-ink-soft/70">{emptyText}</p>
      )}
    </div>
  );
}

export function CVMatcher() {
  const [cvText, setCvText] = useState("");
  const [jdText, setJdText] = useState("");
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<CvMatchResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    setFileError(null);

    try {
      const text = await extractTextFromFile(file);
      setCvText(text);
      setCvFileName(file.name);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "We couldn't read that file.");
      setCvFileName(null);
    } finally {
      setIsParsingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleAnalyze(event: FormEvent) {
    event.preventDefault();

    if (!cvText.trim()) {
      setFormError("Please paste your CV before analyzing.");
      setResult(null);
      return;
    }
    if (!jdText.trim()) {
      setFormError("Please paste the job description before analyzing.");
      setResult(null);
      return;
    }
    if (cvText.length > 20000 || jdText.length > 20000) {
      setFormError("That text looks unusually long. Please paste just the CV / job description content.");
      setResult(null);
      return;
    }

    setFormError(null);
    setResult(matchCvToJob(cvText, jdText));
  }

  function handleUseSample() {
    setCvText(SAMPLE_CV);
    setJdText(SAMPLE_JD);
    setCvFileName(null);
    setFormError(null);
    setFileError(null);
    setResult(null);
  }

  function handleClear() {
    setCvText("");
    setJdText("");
    setCvFileName(null);
    setFormError(null);
    setFileError(null);
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="eyebrow mb-3">CV Matcher</p>
      <h1 className="text-3xl font-bold sm:text-4xl">See how your CV matches a job</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Paste or upload your CV and a job description. Matching runs locally in your browser —
        your CV is never uploaded to a server.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <form onSubmit={handleAnalyze} className="flex flex-col gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <label htmlFor="cv-input" className="text-sm font-semibold text-ink">
                Your CV
              </label>
              <label className="cursor-pointer text-sm font-medium text-blueprint-600 hover:underline">
                Upload PDF/TXT
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,application/pdf,text/plain"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Upload CV as PDF or TXT"
                />
              </label>
            </div>

            {isParsingFile && <p className="mt-1 text-xs text-blueprint-600">Reading file…</p>}
            {cvFileName && !isParsingFile && (
              <p className="mt-1 text-xs text-ink-soft">Loaded from: {cvFileName}</p>
            )}
            {fileError && (
              <p role="alert" className="mt-1 text-xs font-medium text-warn">
                {fileError}
              </p>
            )}

            <textarea
              id="cv-input"
              value={cvText}
              onChange={(e) => {
                setCvText(e.target.value);
                setCvFileName(null);
              }}
              placeholder="Paste your CV text here, or upload a PDF/TXT file above..."
              rows={10}
              className="mt-2 w-full resize-y rounded-md border border-surface-border p-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none"
            />
          </div>

          <div className="card">
            <label htmlFor="jd-input" className="text-sm font-semibold text-ink">
              Job description
            </label>
            <textarea
              id="jd-input"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description you're matching against..."
              rows={10}
              className="mt-2 w-full resize-y rounded-md border border-surface-border p-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none"
            />
          </div>

          {formError && (
            <p role="alert" className="text-sm font-medium text-warn">
              {formError}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={isParsingFile}>
              Analyze Match
            </button>
            <button type="button" onClick={handleUseSample} className="btn-secondary">
              Use a sample CV &amp; job
            </button>
            {(cvText || jdText) && (
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
              <p className="font-medium text-ink">No match yet</p>
              <p className="max-w-xs text-sm">
                Fill in your CV and a job description, then click "Analyze Match" to see your
                score here.
              </p>
            </div>
          )}

          {result && (
            <>
              {result.requiredSkills.length === 0 ? (
                <div className="card">
                  <p className="eyebrow mb-2">No skills detected in this job description</p>
                  <p className="text-sm text-ink-soft">
                    We couldn't find any skills from our dictionary in the job description, so a
                    match score wouldn't be meaningful here. Try pasting the full posting
                    (including the requirements section), or check the Job Description Analyzer
                    for a closer look at this posting.
                  </p>
                </div>
              ) : (
                <div className="card">
                  <div className="flex items-center gap-4">
                    <MatchGauge score={result.matchScore} size={88} />
                    <div>
                      <p className="eyebrow">Match score</p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {result.matchedSkills.length} of {result.requiredSkills.length} required
                        skills found in your CV.
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-ink-soft">
                    The score is based on keyword/skill matching and is not a prediction of
                    hiring success.
                  </p>
                </div>
              )}

              <div className="card space-y-5">
                <SkillList
                  title="Matched skills"
                  skills={result.matchedSkills}
                  tone="match"
                  emptyText="None of the required skills were found in your CV yet."
                />
                <SkillList
                  title="Missing skills"
                  skills={result.missingSkills}
                  tone="warn"
                  emptyText="Nothing missing — your CV covers every skill this job mentions."
                />
              </div>

              {result.missingSkills.length > 0 && (
                <div className="card">
                  <p className="eyebrow mb-2">Recommended keywords to add</p>
                  <p className="mb-3 text-sm text-ink-soft">
                    If you genuinely have these skills, adding these exact words can help your CV
                    surface in keyword-based searches.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((skill) => (
                      <Badge key={skill} tone="blueprint">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.additionalCvSkills.length > 0 && (
                <div className="card">
                  <p className="eyebrow mb-2">Other skills on your CV</p>
                  <p className="mb-3 text-sm text-ink-soft">
                    Not required by this job, but worth keeping visible for other roles.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.additionalCvSkills.map((skill) => (
                      <Badge key={skill} tone="neutral">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
