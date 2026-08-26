import type { ApplicationSite, ApplicationStatus, TrackerEntry, TrackerEntryDraft } from "../types/tracker";
import { SITE_LABELS, STATUS_LABELS } from "../types/tracker";

const STORAGE_KEY = "jobAppToolkit.trackerEntries.v1";
const SCHEMA_VERSION = 2;

function generateEntryId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEntry(draft: TrackerEntryDraft): TrackerEntry {
  const now = new Date().toISOString();
  return {
    ...draft,
    id: generateEntryId(),
    schemaVersion: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    statusHistory: [{ status: draft.status, changedAt: now }],
  };
}

/**
 * Applies an edit to an entry. If the status changed, appends to
 * statusHistory so "when did this change" is answerable later (e.g. for
 * the ghosting-suggestion heuristic, or a future timeline view).
 */
export function applyEntryEdit(entry: TrackerEntry, draft: TrackerEntryDraft): TrackerEntry {
  const now = new Date().toISOString();
  const statusChanged = draft.status !== entry.status;
  return {
    ...entry,
    ...draft,
    updatedAt: now,
    statusHistory: statusChanged
      ? [...entry.statusHistory, { status: draft.status, changedAt: now }]
      : entry.statusHistory,
  };
}

/** Quick status-only update, for the "update status" shortcut on the entry card (no full form). */
export function applyStatusChange(entry: TrackerEntry, status: ApplicationStatus): TrackerEntry {
  if (status === entry.status) return entry;
  const now = new Date().toISOString();
  return {
    ...entry,
    status,
    updatedAt: now,
    statusHistory: [...entry.statusHistory, { status, changedAt: now }],
  };
}

/**
 * Migrates a raw stored/imported record (possibly from an older
 * schemaVersion, or missing fields entirely) up to the current shape.
 * Returns null if the record is too malformed to recover (missing the
 * bare minimum: id/company/position/status).
 */
function migrateEntry(raw: unknown): TrackerEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  if (typeof r.id !== "string" || typeof r.company !== "string" || typeof r.position !== "string") {
    return null;
  }

  const status: ApplicationStatus =
    typeof r.status === "string" && r.status in STATUS_LABELS ? (r.status as ApplicationStatus) : "applied";

  const site: ApplicationSite =
    typeof r.site === "string" && r.site in SITE_LABELS ? (r.site as ApplicationSite) : "other";

  const createdAt = typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString();
  const updatedAt = typeof r.updatedAt === "string" ? r.updatedAt : createdAt;

  const statusHistory =
    Array.isArray(r.statusHistory) && r.statusHistory.length > 0
      ? (r.statusHistory as TrackerEntry["statusHistory"])
      : [{ status, changedAt: createdAt }];

  return {
    id: r.id,
    company: r.company,
    position: r.position,
    location: typeof r.location === "string" ? r.location : "",
    jobUrl: typeof r.jobUrl === "string" ? r.jobUrl : "",
    site,
    applicationDate: typeof r.applicationDate === "string" ? r.applicationDate : "",
    deadline: typeof r.deadline === "string" ? r.deadline : "",
    status,
    jobDescription: typeof r.jobDescription === "string" ? r.jobDescription : "",
    qualifications: typeof r.qualifications === "string" ? r.qualifications : "",
    notes: typeof r.notes === "string" ? r.notes : "",
    schemaVersion: SCHEMA_VERSION,
    createdAt,
    updatedAt,
    statusHistory,
  };
}

/**
 * Reads saved entries from localStorage. Never throws — on any failure
 * (corrupted JSON, unexpected shape, storage disabled) it returns an
 * empty list plus a human-readable error the UI can display once.
 * Entries from an older schema version are transparently migrated.
 */
export function loadEntries(): { entries: TrackerEntry[]; error: string | null } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [], error: null };

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Stored tracker data is not an array");
    }
    const migrated = parsed.map(migrateEntry).filter((e): e is TrackerEntry => e !== null);
    return { entries: migrated, error: null };
  } catch {
    return {
      entries: [],
      error:
        "We couldn't load your saved applications — the saved data looks corrupted. Starting with an empty tracker.",
    };
  }
}

/** Writes entries to localStorage. Returns an error message on failure (e.g. storage full/disabled). */
export function saveEntries(entries: TrackerEntry[]): { success: boolean; error: string | null } {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return { success: true, error: null };
  } catch {
    return {
      success: false,
      error:
        "We couldn't save your changes. Your browser storage may be full or disabled (e.g. private browsing mode).",
    };
  }
}

export function clearAllEntries(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

/** Serializes entries into a downloadable JSON backup. */
export function exportEntriesToJson(entries: TrackerEntry[]): string {
  return JSON.stringify(
    { exportedAt: new Date().toISOString(), schemaVersion: SCHEMA_VERSION, entries },
    null,
    2
  );
}

/**
 * Parses a previously exported JSON backup back into entries.
 * Throws an Error with a human-readable message on invalid input —
 * callers should catch it and show `error.message` directly.
 * Also migrates older-schema backups, same as loadEntries.
 */
export function parseImportedEntries(jsonText: string): TrackerEntry[] {
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    throw new Error("That file doesn't look like valid JSON. Please choose a file exported from this app.");
  }

  const candidate = Array.isArray(data)
    ? data
    : typeof data === "object" && data !== null && "entries" in data
      ? (data as { entries: unknown }).entries
      : null;

  if (!Array.isArray(candidate)) {
    throw new Error("That file doesn't look like a Job Application Toolkit export.");
  }

  const validEntries = candidate.map(migrateEntry).filter((e): e is TrackerEntry => e !== null);

  if (validEntries.length === 0) {
    throw new Error("No valid application entries were found in that file.");
  }

  return validEntries;
}

/**
 * Builds an .xlsx workbook (as a Blob) from the current entries — one row
 * per application, columns matching what's shown in the tracker plus the
 * fuller text fields (job description / qualifications / notes) for
 * reference. Uses SheetJS entirely client-side; nothing is uploaded.
 *
 * The `xlsx` library is ~600KB, so it's dynamically imported here rather
 * than at the top of this file — it's only downloaded the first time
 * someone actually clicks "Export .xlsx", not on every page load.
 */
export async function exportEntriesToXlsx(entries: TrackerEntry[]): Promise<Blob> {
  const XLSX = await import("xlsx");

  const rows = entries.map((e) => ({
    Company: e.company,
    Position: e.position,
    Location: e.location,
    "Site applied": SITE_LABELS[e.site],
    "Application date": e.applicationDate,
    Deadline: e.deadline,
    Status: STATUS_LABELS[e.status],
    "Job description": e.jobDescription,
    Qualifications: e.qualifications,
    Notes: e.notes,
    "Job URL": e.jobUrl,
    "Last updated": e.updatedAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  // Reasonable column widths so long text fields don't render as a sliver.
  worksheet["!cols"] = [
    { wch: 22 }, // Company
    { wch: 24 }, // Position
    { wch: 18 }, // Location
    { wch: 14 }, // Site
    { wch: 14 }, // Application date
    { wch: 12 }, // Deadline
    { wch: 16 }, // Status
    { wch: 50 }, // Job description
    { wch: 40 }, // Qualifications
    { wch: 30 }, // Notes
    { wch: 30 }, // Job URL
    { wch: 20 }, // Last updated
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
  const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
