import type { DetectedField } from "../types/job";

const NAME_LABEL_PATTERN = /^(nama|name)\s*[:\-]\s*(.+)$/i;

// Headers that commonly appear as the very first line of a CV/resume and
// must NOT be mistaken for the applicant's name.
const NON_NAME_FIRST_LINE = /^(curriculum vitae|daftar riwayat hidup|resume|cv)\.?$/i;

/** A line that plausibly reads as "First Last" or "First Middle Last": 2-4 Title Case words, no digits, not a known non-name header. */
function looksLikePersonName(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 60) return false;
  if (NON_NAME_FIRST_LINE.test(trimmed)) return false;
  if (/\d/.test(trimmed)) return false;
  if (/@|https?:\/\//i.test(trimmed)) return false;
  // ALL-CAPS lines are almost always section headers ("SKILLS SUMMARY",
  // "CURRICULUM VITAE"), not a person's name.
  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) return false;

  const words = trimmed.split(/\s+/);
  if (words.length < 2 || words.length > 4) return false;

  // Each word should start with a capital letter (allows for "Al-", "van", "bin" style particles being lowercase).
  const capitalizedEnough = words.filter((w) => /^[A-Z]/.test(w)).length;
  return capitalizedEnough >= words.length - 1;
}

/**
 * Looks for an explicit "Nama: X" / "Name: X" label first (most reliable),
 * then falls back to treating the first short, Title-Case-looking line as
 * the applicant's name (common when a CV opens with just the name as a
 * heading). Returns detected=false rather than guessing wildly if neither
 * pattern is found.
 */
export function extractApplicantName(cvText: string): DetectedField<string> {
  const lines = cvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 15)) {
    const labelMatch = line.match(NAME_LABEL_PATTERN);
    if (labelMatch?.[2]?.trim()) {
      return { value: labelMatch[2].trim(), detected: true };
    }
  }

  if (lines.length > 0 && looksLikePersonName(lines[0])) {
    return { value: lines[0], detected: true };
  }
  // If the first line is just a document header ("Curriculum Vitae"), the
  // name is often the very next line instead.
  if (lines.length > 1 && NON_NAME_FIRST_LINE.test(lines[0]) && looksLikePersonName(lines[1])) {
    return { value: lines[1], detected: true };
  }

  return { value: "", detected: false };
}

// A bullet/line that reads like an achievement: starts with a bullet
// marker or a past-tense action verb, and ideally contains a number
// (percentages, counts, currency) since that's what makes an achievement
// concrete rather than a generic responsibility statement.
const BULLET_LINE = /^[-•*]\s*(.+)$/;
const ACHIEVEMENT_VERB_PATTERN =
  /\b(berhasil|meningkatkan|menurunkan|mengelola|memimpin|mencapai|achieved|improved|increased|reduced|led|managed|built|launched)\b/i;
const HAS_NUMBER = /\d/;

/**
 * Scans CV text for the single most "achievement-shaped" bullet point:
 * prefers lines with both an achievement verb and a number (e.g. "Increased
 * sales by 20%"), falls back to verb-only, then number-only, then nothing.
 * This is a starting suggestion for the cover letter's achievement field —
 * always shown to the user as editable, never inserted silently.
 */
export function extractLikelyAchievement(cvText: string): DetectedField<string> {
  const lines = cvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const candidates: string[] = [];
  for (const line of lines) {
    const bulletMatch = line.match(BULLET_LINE);
    const text = bulletMatch ? bulletMatch[1] : line;
    if (text.length < 15 || text.length > 220) continue;
    candidates.push(text);
  }

  const verbAndNumber = candidates.find((c) => ACHIEVEMENT_VERB_PATTERN.test(c) && HAS_NUMBER.test(c));
  if (verbAndNumber) return { value: verbAndNumber, detected: true };

  const verbOnly = candidates.find((c) => ACHIEVEMENT_VERB_PATTERN.test(c));
  if (verbOnly) return { value: verbOnly, detected: true };

  return { value: "", detected: false };
}
