/** Formats a whole number of seconds as m:ss (e.g. 125 -> "2:05"). Negative input clamps to 0. */
export function formatSeconds(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
