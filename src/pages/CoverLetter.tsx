import { useState, type FormEvent } from "react";
import { generateCoverLetter } from "../utils/coverLetterGenerator";
import type { CoverLetterInput, CoverLetterTone } from "../types/coverLetter";

const EMPTY_INPUT: CoverLetterInput = {
  fullName: "",
  position: "",
  company: "",
  hiringManager: "",
  keySkillsRaw: "",
  achievement: "",
  whyCompany: "",
  tone: "formal",
};

const SAMPLE_INPUT: CoverLetterInput = {
  fullName: "Jane Doe",
  position: "Junior Data Analyst",
  company: "Acme Analytics",
  hiringManager: "",
  keySkillsRaw: "Python, SQL, Excel, Power BI",
  achievement:
    "During my internship at a fintech startup, I built weekly reporting dashboards that helped the team spot revenue trends faster.",
  whyCompany: "your focus on making data accessible to non-technical teams",
  tone: "formal",
};

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label} {!required && <span className="font-normal text-ink-soft">(optional)</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-surface-border p-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none";

export function CoverLetter() {
  const [input, setInput] = useState<CoverLetterInput>(EMPTY_INPUT);
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  function update<K extends keyof CoverLetterInput>(key: K, value: CoverLetterInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function handleGenerate(event: FormEvent) {
    event.preventDefault();

    if (!input.fullName.trim() || !input.position.trim() || !input.company.trim()) {
      setFormError("Please fill in your name, the position, and the company — those are required.");
      setDraft(null);
      return;
    }
    if (Object.values(input).some((v) => typeof v === "string" && v.length > 2000)) {
      setFormError("One of the fields looks unusually long. Please keep entries short and specific.");
      setDraft(null);
      return;
    }

    setFormError(null);
    setVariantIndex(0);
    setDraft(generateCoverLetter(input, 0));
    setCopied(false);
  }

  function handleTryAnotherWording() {
    const nextIndex = variantIndex + 1;
    setVariantIndex(nextIndex);
    setDraft(generateCoverLetter(input, nextIndex));
    setCopied(false);
  }

  function handleUseSample() {
    setInput(SAMPLE_INPUT);
    setFormError(null);
    setDraft(null);
  }

  function handleClear() {
    setInput(EMPTY_INPUT);
    setFormError(null);
    setDraft(null);
  }

  async function handleCopy() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setFormError("Couldn't copy automatically — please select and copy the text manually.");
    }
  }

  function handleDownload() {
    if (!draft) return;
    const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (input.fullName || "cover-letter").trim().replace(/\s+/g, "-").toLowerCase();
    a.download = `${safeName}-cover-letter.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="eyebrow mb-3">Cover Letter Generator</p>
      <h1 className="text-3xl font-bold sm:text-4xl">Draft a cover letter in minutes</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Fill in a few details about the role and your background. Everything runs locally in your
        browser — nothing is sent to a server or an AI API. The result is a starting draft, not a
        finished letter: read it over and make it sound like you before sending.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleGenerate} className="flex flex-col gap-5">
          <div className="card space-y-4">
            <Field label="Your full name" htmlFor="fullName" required>
              <input
                id="fullName"
                type="text"
                value={input.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Position you're applying for" htmlFor="position" required>
                <input
                  id="position"
                  type="text"
                  value={input.position}
                  onChange={(e) => update("position", e.target.value)}
                  placeholder="Junior Data Analyst"
                  className={inputClass}
                />
              </Field>
              <Field label="Company" htmlFor="company" required>
                <input
                  id="company"
                  type="text"
                  value={input.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Acme Analytics"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Hiring manager's name" htmlFor="hiringManager">
              <input
                id="hiringManager"
                type="text"
                value={input.hiringManager}
                onChange={(e) => update("hiringManager", e.target.value)}
                placeholder="Leave blank to use 'Hiring Manager'"
                className={inputClass}
              />
            </Field>

            <Field label="Key skills" htmlFor="keySkills">
              <input
                id="keySkills"
                type="text"
                value={input.keySkillsRaw}
                onChange={(e) => update("keySkillsRaw", e.target.value)}
                placeholder="Python, SQL, Excel, Power BI"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-ink-soft">Comma-separated, up to 8.</p>
            </Field>

            <Field label="A relevant achievement or experience" htmlFor="achievement">
              <textarea
                id="achievement"
                value={input.achievement}
                onChange={(e) => update("achievement", e.target.value)}
                placeholder="e.g. Built weekly reporting dashboards during my internship that helped the team spot trends faster."
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field label="What draws you to this company" htmlFor="whyCompany">
              <input
                id="whyCompany"
                type="text"
                value={input.whyCompany}
                onChange={(e) => update("whyCompany", e.target.value)}
                placeholder="e.g. your focus on making data accessible to non-technical teams"
                className={inputClass}
              />
            </Field>

            <fieldset>
              <legend className="text-sm font-semibold text-ink">Tone</legend>
              <div className="mt-1.5 flex gap-2">
                {(["formal", "friendly"] as CoverLetterTone[]).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => update("tone", tone)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                      input.tone === tone
                        ? "border-blueprint-500 bg-blueprint-50 text-blueprint-600"
                        : "border-surface-border text-ink-soft hover:border-blueprint-400"
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {formError && (
            <p role="alert" className="text-sm font-medium text-warn">
              {formError}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              Generate Draft
            </button>
            <button type="button" onClick={handleUseSample} className="btn-secondary">
              Use a sample
            </button>
            {(input.fullName || input.position || input.company) && (
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

        {/* Draft output */}
        <div className="flex flex-col gap-4">
          {!draft && (
            <div className="card flex h-full flex-col items-center justify-center gap-2 py-16 text-center text-ink-soft">
              <p className="font-medium text-ink">No draft yet</p>
              <p className="max-w-xs text-sm">
                Fill in the required fields and click "Generate Draft" to see your cover letter
                here. You'll be able to edit it directly before copying or downloading.
              </p>
            </div>
          )}

          {draft && (
            <div className="card flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Your draft (editable)</p>
                <button
                  type="button"
                  onClick={handleTryAnotherWording}
                  className="text-sm font-medium text-blueprint-600 hover:underline"
                >
                  Try another wording
                </button>
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={18}
                className="mt-2 w-full flex-1 resize-y rounded-md border border-surface-border p-3 font-body text-sm text-ink focus:border-blueprint-400 focus:outline-none"
              />
              <p className="mt-2 text-xs text-ink-soft">
                This is a starting point, not a finished letter — read it over, adjust the wording,
                and make sure every detail is accurate before you send it.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={handleCopy} className="btn-primary">
                  {copied ? "Copied!" : "Copy to clipboard"}
                </button>
                <button type="button" onClick={handleDownload} className="btn-secondary">
                  Download as .txt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
