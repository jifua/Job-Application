import type { TrackerEntry, TrackerEntryDraft } from "../types/tracker";

const STORAGE_KEY = "jobAppToolkit.trackerEntries.v1";
const SCHEMA_VERSION = 1;

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
  };
}

export function applyEntryEdit(entry: TrackerEntry, draft: TrackerEntryDraft): TrackerEntry {
  return { ...entry, ...draft, updatedAt: new Date().toISOString() };
}

/**
 * Reads saved entries from localStorage. Never throws — on any failure
 * (corrupted JSON, unexpected shape, storage disabled) it returns an
 * empty list plus a human-readable error the UI can display once.
 */
export function loadEntries(): { entries: TrackerEntry[]; error: string | null } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [], error: null };

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Stored tracker data is not an array");
    }
    return { entries: parsed as TrackerEntry[], error: null };
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

  const validEntries = candidate.filter(
    (item): item is TrackerEntry =>
      !!item &&
      typeof item === "object" &&
      typeof (item as TrackerEntry).id === "string" &&
      typeof (item as TrackerEntry).company === "string" &&
      typeof (item as TrackerEntry).position === "string" &&
      typeof (item as TrackerEntry).status === "string"
  );

  if (validEntries.length === 0) {
    throw new Error("No valid application entries were found in that file.");
  }

  return validEntries;
}
