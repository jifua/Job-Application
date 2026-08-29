import { useState } from "react";
import type { CoverLetterInput, CoverLetterLanguage } from "../types/coverLetter";
import type { CoverLetterTemplate } from "../data/coverLetterTemplates";
import { analyzeJobDescription } from "../utils/jobAnalyzer";
import { matchCvToJob } from "../utils/skillMatcher";
import { extractApplicantName, extractLikelyAchievement } from "../utils/cvInfoExtractor";
import { extractTextFromFiles } from "../utils/fileReader";
import { generateCoverLetter } from "../utils/coverLetterGenerator";

interface CoverLetterGenerateFromDataProps {
  template: CoverLetterTemplate;
  onGenerated: (letter: string) => void;
}

const textareaClass =
  "mt-1.5 w-full rounded-md border border-surface-border p-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none resize-y";
const inputClass =
  "mt-1.5 w-full rounded-md border border-surface-border p-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none";

export function CoverLetterGenerateFromData({ template, onGenerated }: CoverLetterGenerateFromDataProps) {
  const [jobText, setJobText] = useState("");
  const [cvText, setCvText] = useState("");
  const [language, setLanguage] = useState<CoverLetterLanguage>(template.language);
  const [isReadingJob, setIsReadingJob] = useState(false);
  const [isReadingCv, setIsReadingCv] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState<string | null>(null);

  // Fields the person can review/correct before generating — pre-filled
  // from job/CV text once available, but never trusted blindly since
  // extraction is heuristic.
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [achievement, setAchievement] = useState("");
  const [whyCompany, setWhyCompany] = useState("");
  const [reviewReady, setReviewReady] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleFileUpload(files: FileList | null, target: "job" | "cv") {
    if (!files || files.length === 0) return;
    const setReading = target === "job" ? setIsReadingJob : setIsReadingCv;
    setReading(true);
    setReadError(null);
    try {
      const { text } = await extractTextFromFiles(Array.from(files), (current, total, message) => {
        setReadProgress(total > 1 ? `${current}/${total}: ${message}` : message);
      });
      if (target === "job") setJobText((prev) => (prev ? `${prev}\n\n${text}` : text));
      else setCvText((prev) => (prev ? `${prev}\n\n${text}` : text));
    } catch (err) {
      setReadError(err instanceof Error ? err.message : "We couldn't read that file.");
    } finally {
      setReading(false);
      setReadProgress(null);
    }
  }

  function handleAnalyze() {
    if (!jobText.trim() && !cvText.trim()) {
      setFormError("Paste or upload at least the job posting, or your CV, before continuing.");
      return;
    }
    setFormError(null);

    const jobAnalysis = jobText.trim() ? analyzeJobDescription(jobText) : null;
    const nameResult = cvText.trim() ? extractApplicantName(cvText) : { value: "", detected: false };
    const achievementResult = cvText.trim() ? extractLikelyAchievement(cvText) : { value: "", detected: false };

    // Prefer skills that are BOTH in the CV and mentioned in the job posting
    // (matchCvToJob) — that's what's actually worth highlighting in a cover
    // letter. Falls back to whichever side is available if only one input was given.
    let skillsList: string[] = [];
    if (jobText.trim() && cvText.trim()) {
      skillsList = matchCvToJob(cvText, jobText).matchedSkills;
    }

    setFullName(nameResult.value);
    setPosition(jobAnalysis?.position.value ?? "");
    setCompany(jobAnalysis?.company.value ?? "");
    setSkills(skillsList.join(", "));
    setAchievement(achievementResult.value);
    setReviewReady(true);
  }

  function handleGenerate() {
    if (!fullName.trim() || !position.trim() || !company.trim()) {
      setFormError("Please fill in at least your name, the position, and the company before generating.");
      return;
    }
    setFormError(null);

    const input: CoverLetterInput = {
      fullName: fullName.trim(),
      position: position.trim(),
      company: company.trim(),
      hiringManager: "",
      keySkillsRaw: skills,
      achievement,
      whyCompany,
      tone: template.tone,
      language,
    };
    onGenerated(generateCoverLetter(input, 0));
  }

  return (
    <div className="card">
      <p className="eyebrow mb-1">Generate dari data ({template.title})</p>
      <p className="mb-4 text-sm text-ink-soft">
        Tempel atau upload info lowongan dan CV-mu. Kami akan mengambil posisi, perusahaan, dan skill yang cocok
        secara otomatis — kamu tetap bisa mengoreksi sebelum surat dibuat.
      </p>

      {!reviewReady ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="glfd-job" className="text-sm font-medium text-ink">
                Info lowongan / kualifikasi job
              </label>
              <textarea
                id="glfd-job"
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                rows={6}
                placeholder="Tempel deskripsi lowongan di sini..."
                className={textareaClass}
              />
              <label className="btn-secondary mt-2 inline-block cursor-pointer text-xs">
                {isReadingJob ? (readProgress ?? "Membaca…") : "Upload screenshot / PDF lowongan"}
                <input
                  type="file"
                  accept="image/*,application/pdf,.txt"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files, "job")}
                  disabled={isReadingJob}
                  className="sr-only"
                />
              </label>
            </div>

            <div>
              <label htmlFor="glfd-cv" className="text-sm font-medium text-ink">
                CV / data diri
              </label>
              <textarea
                id="glfd-cv"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={6}
                placeholder="Tempel isi CV-mu di sini..."
                className={textareaClass}
              />
              <label className="btn-secondary mt-2 inline-block cursor-pointer text-xs">
                {isReadingCv ? (readProgress ?? "Membaca…") : "Upload CV (PDF / screenshot)"}
                <input
                  type="file"
                  accept="image/*,application/pdf,.txt"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files, "cv")}
                  disabled={isReadingCv}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-ink">Bahasa surat</legend>
            <div className="mt-1.5 flex gap-2">
              {(["id", "en"] as CoverLetterLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    language === lang
                      ? "border-blueprint-500 bg-blueprint-50 text-blueprint-600"
                      : "border-surface-border text-ink-soft hover:border-blueprint-400"
                  }`}
                >
                  {lang === "id" ? "Bahasa Indonesia" : "English"}
                </button>
              ))}
            </div>
          </fieldset>

          {readError && (
            <p role="alert" className="mt-3 text-sm font-medium text-warn">
              {readError}
            </p>
          )}
          {formError && (
            <p role="alert" className="mt-3 text-sm font-medium text-warn">
              {formError}
            </p>
          )}

          <button type="button" onClick={handleAnalyze} className="btn-primary mt-4">
            Analisis & tinjau data
          </button>
        </>
      ) : (
        <>
          <p className="mb-3 rounded-md bg-blueprint-50 px-3 py-2 text-xs font-medium text-blueprint-600">
            Berikut data yang berhasil kami deteksi — periksa dan koreksi sebelum membuat suratnya.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="glfd-name" className="text-sm font-medium text-ink">
                Nama lengkap <span className="text-warn">*</span>
              </label>
              <input id="glfd-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="glfd-position" className="text-sm font-medium text-ink">
                Posisi <span className="text-warn">*</span>
              </label>
              <input
                id="glfd-position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="glfd-company" className="text-sm font-medium text-ink">
                Perusahaan <span className="text-warn">*</span>
              </label>
              <input
                id="glfd-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="glfd-skills" className="text-sm font-medium text-ink">
                Skill yang relevan
              </label>
              <input id="glfd-skills" value={skills} onChange={(e) => setSkills(e.target.value)} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="glfd-achievement" className="text-sm font-medium text-ink">
                Pencapaian
              </label>
              <textarea
                id="glfd-achievement"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                rows={2}
                className={textareaClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="glfd-why" className="text-sm font-medium text-ink">
                Alasan tertarik dengan perusahaan ini <span className="font-normal text-ink-soft">(opsional)</span>
              </label>
              <input
                id="glfd-why"
                value={whyCompany}
                onChange={(e) => setWhyCompany(e.target.value)}
                placeholder="mis. fokus perusahaan pada pengembangan UMKM lokal"
                className={inputClass}
              />
            </div>
          </div>

          {formError && (
            <p role="alert" className="mt-3 text-sm font-medium text-warn">
              {formError}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={handleGenerate} className="btn-primary">
              Generate
            </button>
            <button type="button" onClick={() => setReviewReady(false)} className="btn-secondary">
              Kembali
            </button>
          </div>
        </>
      )}
    </div>
  );
}
