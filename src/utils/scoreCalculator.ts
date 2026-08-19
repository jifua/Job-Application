/**
 * matched skills / required skills * 100, rounded to the nearest whole
 * percent. Returns 0 if there are no required skills to match against
 * (rather than NaN or Infinity).
 */
export function calculateMatchScore(matchedCount: number, requiredCount: number): number {
  if (requiredCount <= 0) return 0;
  const raw = (matchedCount / requiredCount) * 100;
  return Math.round(Math.max(0, Math.min(100, raw)));
}
