import type { ApplicationStatus, TrackerEntry } from "../types/tracker";
import { STATUS_ORDER } from "../types/tracker";
import { getDeadlineState } from "../utils/deadlineStatus";
import { isLikelyGhosted } from "../utils/ghostingDetector";
import { Badge } from "./Badge";
import { useLanguage } from "../i18n/LanguageContext";

interface TrackerEntryCardProps {
  entry: TrackerEntry;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
}

const STATUS_TONE: Record<TrackerEntry["status"], "neutral" | "match" | "warn" | "blueprint"> = {
  applied: "blueprint",
  screening: "blueprint",
  test: "blueprint",
  interview: "blueprint",
  offer: "match",
  rejected: "warn",
  ghosted: "warn",
  withdrawn: "neutral",
};

function formatDate(iso: string, locale: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

export function TrackerEntryCard({ entry, onEdit, onDelete, onStatusChange }: TrackerEntryCardProps) {
  const { t, lang } = useLanguage();
  const locale = lang === "id" ? "id-ID" : "en-US";
  const deadlineState = getDeadlineState(entry.deadline);
  const possiblyGhosted = isLikelyGhosted(entry);

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">{entry.position}</h3>
          <p className="text-sm text-ink-soft">
            {entry.company}
            {entry.location && ` · ${entry.location}`}
            {entry.site && ` · ${t.tracker.site[entry.site]}`}
          </p>
        </div>
        <Badge tone={STATUS_TONE[entry.status]}>{t.tracker.status[entry.status]}</Badge>
      </div>

      {possiblyGhosted && (
        <p className="mt-2 rounded-md bg-warn-soft px-3 py-2 text-xs font-medium text-warn">
          {t.tracker.card.ghostWarning}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft">
        {entry.applicationDate && (
          <span>
            {t.tracker.card.applied} {formatDate(entry.applicationDate, locale)}
          </span>
        )}
        {entry.deadline && (
          <span
            className={
              deadlineState === "overdue"
                ? "font-medium text-warn"
                : deadlineState === "soon"
                  ? "font-medium text-signal"
                  : ""
            }
          >
            {t.tracker.card.deadlineLabel} {formatDate(entry.deadline, locale)}
            {deadlineState === "overdue" && ` ${t.tracker.card.deadlinePassed}`}
            {deadlineState === "soon" && ` ${t.tracker.card.deadlineSoon}`}
          </span>
        )}
        {entry.jobUrl && (
          <a
            href={entry.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blueprint-600 hover:underline"
          >
            {t.tracker.card.viewPosting}
          </a>
        )}
      </div>

      {entry.notes && <p className="mt-3 text-sm text-ink-soft">{entry.notes}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-surface-border pt-3 text-sm">
        <div className="flex items-center gap-2">
          <label htmlFor={`quick-status-${entry.id}`} className="text-xs font-medium text-ink-soft">
            {t.tracker.card.updateStatus}
          </label>
          <select
            id={`quick-status-${entry.id}`}
            value={entry.status}
            onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}
            className="rounded-md border border-surface-border px-2 py-1 text-xs text-ink focus:border-blueprint-400 focus:outline-none"
          >
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {t.tracker.status[status]}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={onEdit} className="font-medium text-blueprint-600 hover:underline">
          {t.tracker.card.edit}
        </button>
        <button type="button" onClick={onDelete} className="font-medium text-ink-soft hover:text-warn">
          {t.tracker.card.delete}
        </button>
      </div>
    </div>
  );
}
