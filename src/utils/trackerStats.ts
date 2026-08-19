import type { TrackerEntry, TrackerStats } from "../types/tracker";

const TERMINAL_STATUSES = new Set(["offer", "rejected", "withdrawn"]);

/**
 * Computes dashboard stats from the current status of each entry.
 * There's no status-history tracking in this MVP, so "Interviews" /
 * "Tests" / "Offers" reflect entries currently at that stage — not a
 * cumulative count of every application that ever reached it.
 */
export function calculateStats(entries: TrackerEntry[]): TrackerStats {
  const total = entries.length;
  const count = (predicate: (e: TrackerEntry) => boolean) => entries.filter(predicate).length;

  const interviews = count((e) => e.status === "interview");
  const tests = count((e) => e.status === "test");
  const offers = count((e) => e.status === "offer");
  const rejected = count((e) => e.status === "rejected");
  const pending = count((e) => !TERMINAL_STATUSES.has(e.status));
  const responded = count((e) => e.status !== "applied");

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return {
    total,
    interviews,
    tests,
    offers,
    rejected,
    pending,
    interviewRate: pct(interviews),
    responseRate: pct(responded),
    offerRate: pct(offers),
  };
}
