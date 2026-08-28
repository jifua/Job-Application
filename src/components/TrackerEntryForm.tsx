import { useState, type FormEvent } from "react";
import type { ApplicationSite, ApplicationStatus, TrackerEntry, TrackerEntryDraft } from "../types/tracker";
import { SITE_ORDER, STATUS_ORDER } from "../types/tracker";
import { useLanguage } from "../i18n/LanguageContext";

interface TrackerEntryFormProps {
  initialEntry: TrackerEntry | null; // null = creating a new entry
  /** Partial values to pre-fill when creating a new entry (e.g. from a parsed screenshot). Ignored when editing. */
  prefill?: Partial<TrackerEntryDraft>;
  /** Field names that were auto-detected from a screenshot, so the UI can flag them for review. */
  autoDetectedFields?: (keyof TrackerEntryDraft)[];
  onSubmit: (draft: TrackerEntryDraft) => void;
  onCancel: () => void;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_DRAFT: TrackerEntryDraft = {
  company: "",
  position: "",
  location: "",
  jobUrl: "",
  site: "other",
  applicationDate: todayIsoDate(),
  deadline: "",
  status: "applied",
  jobDescription: "",
  qualifications: "",
  notes: "",
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-surface-border p-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none";

export function TrackerEntryForm({
  initialEntry,
  prefill,
  autoDetectedFields = [],
  onSubmit,
  onCancel,
}: TrackerEntryFormProps) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState<TrackerEntryDraft>(
    initialEntry
      ? {
          company: initialEntry.company,
          position: initialEntry.position,
          location: initialEntry.location,
          jobUrl: initialEntry.jobUrl,
          site: initialEntry.site,
          applicationDate: initialEntry.applicationDate,
          deadline: initialEntry.deadline,
          status: initialEntry.status,
          jobDescription: initialEntry.jobDescription,
          qualifications: initialEntry.qualifications,
          notes: initialEntry.notes,
        }
      : { ...EMPTY_DRAFT, ...prefill }
  );
  const [error, setError] = useState<string | null>(null);
  const hasAutoDetected = !initialEntry && autoDetectedFields.length > 0;

  function update<K extends keyof TrackerEntryDraft>(key: K, value: TrackerEntryDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function autoTag(field: keyof TrackerEntryDraft) {
    if (!hasAutoDetected || !autoDetectedFields.includes(field)) return null;
    return <span className="ml-1.5 text-xs font-normal text-blueprint-600">{t.tracker.form.autoDetected}</span>;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.company.trim() || !draft.position.trim()) {
      setError(t.tracker.form.requiredFieldsError);
      return;
    }
    setError(null);
    onSubmit({
      ...draft,
      company: draft.company.trim(),
      position: draft.position.trim(),
      location: draft.location.trim(),
      jobUrl: draft.jobUrl.trim(),
      jobDescription: draft.jobDescription.trim(),
      qualifications: draft.qualifications.trim(),
      notes: draft.notes.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <p className="eyebrow mb-4">{initialEntry ? t.tracker.form.editTitle : t.tracker.form.addTitle}</p>

      {hasAutoDetected && (
        <p className="mb-4 rounded-md bg-blueprint-50 px-3 py-2 text-xs font-medium text-blueprint-600">
          {t.tracker.form.autoDetectedNotice}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="entry-company" className="text-sm font-medium text-ink">
            {t.tracker.form.company} <span className="text-warn">*</span>
            {autoTag("company")}
          </label>
          <input
            id="entry-company"
            type="text"
            value={draft.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder={t.tracker.form.companyPlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="entry-position" className="text-sm font-medium text-ink">
            {t.tracker.form.position} <span className="text-warn">*</span>
            {autoTag("position")}
          </label>
          <input
            id="entry-position"
            type="text"
            value={draft.position}
            onChange={(e) => update("position", e.target.value)}
            placeholder={t.tracker.form.positionPlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="entry-location" className="text-sm font-medium text-ink">
            {t.tracker.form.location}
          </label>
          <input
            id="entry-location"
            type="text"
            value={draft.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder={t.tracker.form.locationPlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="entry-site" className="text-sm font-medium text-ink">
            {t.tracker.form.appliedVia}
            {autoTag("site")}
          </label>
          <select
            id="entry-site"
            value={draft.site}
            onChange={(e) => update("site", e.target.value as ApplicationSite)}
            className={inputClass}
          >
            {SITE_ORDER.map((site) => (
              <option key={site} value={site}>
                {t.tracker.site[site]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="entry-status" className="text-sm font-medium text-ink">
            {t.tracker.form.status}
          </label>
          <select
            id="entry-status"
            value={draft.status}
            onChange={(e) => update("status", e.target.value as ApplicationStatus)}
            className={inputClass}
          >
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {t.tracker.status[status]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="entry-application-date" className="text-sm font-medium text-ink">
            {t.tracker.form.applicationDate}
            {autoTag("applicationDate")}
          </label>
          <input
            id="entry-application-date"
            type="date"
            value={draft.applicationDate}
            onChange={(e) => update("applicationDate", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="entry-deadline" className="text-sm font-medium text-ink">
            {t.tracker.form.deadline} <span className="font-normal text-ink-soft">{t.tracker.form.optional}</span>
          </label>
          <input
            id="entry-deadline"
            type="date"
            value={draft.deadline}
            onChange={(e) => update("deadline", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="entry-job-url" className="text-sm font-medium text-ink">
            {t.tracker.form.jobUrl} <span className="font-normal text-ink-soft">{t.tracker.form.optional}</span>
          </label>
          <input
            id="entry-job-url"
            type="url"
            value={draft.jobUrl}
            onChange={(e) => update("jobUrl", e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="entry-job-description" className="text-sm font-medium text-ink">
            {t.tracker.form.jobDescription}{" "}
            <span className="font-normal text-ink-soft">{t.tracker.form.optional}</span>
          </label>
          <textarea
            id="entry-job-description"
            value={draft.jobDescription}
            onChange={(e) => update("jobDescription", e.target.value)}
            rows={3}
            placeholder={t.tracker.form.jobDescriptionPlaceholder}
            className={`${inputClass} resize-y`}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="entry-qualifications" className="text-sm font-medium text-ink">
            {t.tracker.form.qualifications}{" "}
            <span className="font-normal text-ink-soft">{t.tracker.form.optional}</span>
          </label>
          <textarea
            id="entry-qualifications"
            value={draft.qualifications}
            onChange={(e) => update("qualifications", e.target.value)}
            rows={3}
            placeholder={t.tracker.form.qualificationsPlaceholder}
            className={`${inputClass} resize-y`}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="entry-notes" className="text-sm font-medium text-ink">
            {t.tracker.form.notes} <span className="font-normal text-ink-soft">{t.tracker.form.optional}</span>
          </label>
          <textarea
            id="entry-notes"
            value={draft.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            placeholder={t.tracker.form.notesPlaceholder}
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-warn">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="btn-primary">
          {initialEntry ? t.tracker.form.saveChanges : t.tracker.form.addApplication}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t.tracker.form.cancel}
        </button>
      </div>
    </form>
  );
}
