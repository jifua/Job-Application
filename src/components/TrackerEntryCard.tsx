import type { TrackerEntry } from "../types/tracker";
import { STATUS_LABELS } from "../types/tracker";
import { getDeadlineState } from "../utils/deadlineStatus";
import { Badge } from "./Badge";

interface TrackerEntryCardProps {
  entry: TrackerEntry;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_TONE: Record<TrackerEntry["status"], "neutral" | "match" | "warn" | "blueprint"> = {
  applied: "blueprint",
  screening: "blueprint",
  test: "blueprint",
  interview: "blueprint",
  offer: "match",
  rejected: "warn",
  withdrawn: "neutral",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function TrackerEntryCard({ entry, onEdit, onDelete }: TrackerEntryCardProps) {
  const deadlineState = getDeadlineState(entry.deadline);

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">{entry.position}</h3>
          <p className="text-sm text-ink-soft">
            {entry.company}
            {entry.location && ` · ${entry.location}`}
          </p>
        </div>
        <Badge tone={STATUS_TONE[entry.status]}>{STATUS_LABELS[entry.status]}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft">
        {entry.applicationDate && <span>Applied {formatDate(entry.applicationDate)}</span>}
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
            Deadline {formatDate(entry.deadline)}
            {deadlineState === "overdue" && " — Deadline passed"}
            {deadlineState === "soon" && " — Deadline soon"}
          </span>
        )}
        {entry.jobUrl && (
          <a
            href={entry.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blueprint-600 hover:underline"
          >
            View posting ↗
          </a>
        )}
      </div>

      {entry.notes && <p className="mt-3 text-sm text-ink-soft">{entry.notes}</p>}

      <div className="mt-4 flex gap-4 border-t border-surface-border pt-3 text-sm">
        <button type="button" onClick={onEdit} className="font-medium text-blueprint-600 hover:underline">
          Edit
        </button>
        <button type="button" onClick={onDelete} className="font-medium text-ink-soft hover:text-warn">
          Delete
        </button>
      </div>
    </div>
  );
}
