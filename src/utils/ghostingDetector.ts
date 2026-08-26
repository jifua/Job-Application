import type { TrackerEntry } from "../types/tracker";
import { GHOSTING_THRESHOLD_DAYS, TERMINAL_STATUSES } from "../types/tracker";

const TERMINAL_STATUS_SET = new Set(TERMINAL_STATUSES);

/**
 * Returns true if an entry looks like it may have been ghosted: it's not
 * already in a terminal status, and hasn't been updated in
 * GHOSTING_THRESHOLD_DAYS. This only *suggests* — the user still has to
 * confirm by changing the status themselves, since "no update yet" isn't
 * proof of ghosting (a slow-but-real process looks identical from here).
 */
export function isLikelyGhosted(entry: TrackerEntry, now: Date = new Date()): boolean {
  if (TERMINAL_STATUS_SET.has(entry.status)) return false;
  if (!entry.updatedAt) return false;

  const lastUpdate = new Date(entry.updatedAt);
  if (Number.isNaN(lastUpdate.getTime())) return false;

  const diffDays = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= GHOSTING_THRESHOLD_DAYS;
}
