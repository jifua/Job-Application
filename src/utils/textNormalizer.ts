/**
 * Lowercases, strips punctuation, and collapses whitespace.
 * Used before running keyword/skill matching so that formatting
 * differences (casing, commas, extra spaces) don't affect results.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Splits raw text into trimmed, non-empty lines. */
export function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** True if a line looks like a bullet point ("-", "•", "*", "1.", "1)"). */
export function isBulletLine(line: string): boolean {
  return /^([-•*]|\d+[.)])\s+/.test(line.trim());
}

/** Strips a leading bullet marker ("- ", "• ", "1. ") from a line. */
export function stripBulletMarker(line: string): string {
  return line.trim().replace(/^([-•*]|\d+[.)])\s+/, "");
}
