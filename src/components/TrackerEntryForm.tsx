import { useState, type FormEvent } from "react";
import type { ApplicationStatus, TrackerEntry, TrackerEntryDraft } from "../types/tracker";
import { STATUS_LABELS, STATUS_ORDER } from "../types/tracker";

interface TrackerEntryFormProps {
  initialEntry: TrackerEntry | null; // null = creating a new entry
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
  applicationDate: todayIsoDate(),
  deadline: "",
  status: "applied",
  notes: "",
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-surface-border p-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none";

export function TrackerEntryForm({ initialEntry, onSubmit, onCancel }: TrackerEntryFormProps) {
  const [draft, setDraft] = useState<TrackerEntryDraft>(
    initialEntry
      ? {
          company: initialEntry.company,
          position: initialEntry.position,
          location: initialEntry.location,
          jobUrl: initialEntry.jobUrl,
          applicationDate: initialEntry.applicationDate,
          deadline: initialEntry.deadline,
          status: initialEntry.status,
          notes: initialEntry.notes,
        }
      : EMPTY_DRAFT
  );
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof TrackerEntryDraft>(key: K, value: TrackerEntryDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.company.trim() || !draft.position.trim()) {
      setError("Please fill in at least the company and position before saving.");
      return;
    }
    setError(null);
    onSubmit({
      ...draft,
      company: draft.company.trim(),
      position: draft.position.trim(),
      location: draft.location.trim(),
      jobUrl: draft.jobUrl.trim(),
      notes: draft.notes.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <p className="eyebrow mb-4">{initialEntry ? "Edit application" : "Add an application"}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="entry-company" className="text-sm font-medium text-ink">
            Company <span className="text-warn">*</span>
          </label>
          <input
            id="entry-company"
            type="text"
            value={draft.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Contoh Teknologi Indonesia"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="entry-position" className="text-sm font-medium text-ink">
            Position <span className="text-warn">*</span>
          </label>
          <input
            id="entry-position"
            type="text"
            value={draft.position}
            onChange={(e) => update("position", e.target.value)}
            placeholder="Junior Data Analyst"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="entry-location" className="text-sm font-medium text-ink">
            Location
          </label>
          <input
            id="entry-location"
            type="text"
            value={draft.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Jakarta (Hybrid)"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="entry-status" className="text-sm font-medium text-ink">
            Status
          </label>
          <select
            id="entry-status"
            value={draft.status}
            onChange={(e) => update("status", e.target.value as ApplicationStatus)}
            className={inputClass}
          >
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="entry-application-date" className="text-sm font-medium text-ink">
            Application date
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
            Deadline{" "}
            <span className="font-normal text-ink-soft">(optional)</span>
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
            Job URL <span className="font-normal text-ink-soft">(optional)</span>
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
          <label htmlFor="entry-notes" className="text-sm font-medium text-ink">
            Notes <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            id="entry-notes"
            value={draft.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            placeholder="Recruiter contact, interview format, salary discussed, etc."
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
          {initialEntry ? "Save changes" : "Add application"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
