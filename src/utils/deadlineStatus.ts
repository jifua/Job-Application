export type DeadlineState = "none" | "overdue" | "soon" | "upcoming";

/**
 * Classifies a deadline (ISO date string, e.g. "2026-09-30") relative
 * to today. "soon" = due within 3 days (inclusive), matching the spec's
 * "Deadline soon" threshold.
 */
export function getDeadlineState(deadlineIso: string, now: Date = new Date()): DeadlineState {
  if (!deadlineIso) return "none";

  const deadline = new Date(`${deadlineIso}T23:59:59`);
  if (Number.isNaN(deadline.getTime())) return "none";

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "soon";
  return "upcoming";
}
