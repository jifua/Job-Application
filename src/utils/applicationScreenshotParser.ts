import type { ApplicationSite, TrackerEntryDraft } from "../types/tracker";
import { splitLines } from "./textNormalizer";

export interface ScreenshotParseResult {
  guess: Partial<TrackerEntryDraft>;
  /** Which fields were actually found (vs. left as defaults), so the UI can highlight what needs review. */
  fieldsFound: (keyof TrackerEntryDraft)[];
}

const SITE_KEYWORDS: { pattern: RegExp; site: ApplicationSite }[] = [
  { pattern: /jobstreet/i, site: "jobstreet" },
  { pattern: /glints/i, site: "glints" },
  { pattern: /dealls/i, site: "dealls" },
  { pattern: /talentic/i, site: "talentic" },
  { pattern: /linkedin/i, site: "linkedin" },
];

// English + Indonesian phrasings seen on "application submitted" confirmation
// screens across major job portals.
const POSITION_LABEL = /^(posisi|position|job title|jabatan)\s*[:\-]\s*(.+)$/i;
const COMPANY_LABEL = /^(perusahaan|company|pt\.?)\s*[:\-]\s*(.+)$/i;
const DATE_LABEL =
  /^(tanggal (melamar|lamaran)|melamar pada|application date|applied on|date applied)\s*[:\-]?\s*(.+)$/i;

// Confirmation banners that usually contain the position name right after
// them, e.g. "Lamaran Anda untuk Junior Data Analyst telah terkirim".
const APPLIED_FOR_PATTERN =
  /(?:lamaran (?:anda )?untuk|applied for|application for|melamar (?:posisi )?)\s+["“]?([^".\n]{3,80}?)["”]?\s+(?:telah terkirim|has been submitted|berhasil|sent|submitted)/i;

// English "for [Position] at [Company]" phrasing — stops the company
// capture before trailing words like "has"/"was"/"via" so it doesn't
// swallow the rest of the sentence.
const FOR_POSITION_AT_COMPANY_PATTERN =
  /\bfor\s+(?:the\s+)?(?:position\s+of\s+)?([A-Z][\w &/\-]{2,60}?)\s+(?:at|@)\s+([A-Z][\w .,&/\-]{2,80}?)(?=\s+(?:has|have|was|is|via)\b|[.,!]|$)/i;

// Indonesian legal-entity prefixes (PT/CV/UD/...) — a strong signal a
// bare line (no "Company:" label) is the company name. Confirmation
// screens from JobStreet/Glints/Dealls frequently print it this way.
const COMPANY_PREFIX_LINE = /^(pt\.?|cv\.?|pd\.?|ud\.?|yayasan|koperasi)\s+\S/i;

const MONTHS_ID: Record<string, string> = {
  januari: "01",
  februari: "02",
  maret: "03",
  april: "04",
  mei: "05",
  juni: "06",
  juli: "07",
  agustus: "08",
  september: "09",
  oktober: "10",
  november: "11",
  desember: "12",
};
const MONTHS_EN: Record<string, string> = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

/** Parses "23 Januari 2026", "Jan 23, 2026", "23/01/2026" into an ISO date (yyyy-mm-dd). Returns null if unrecognized. */
function parseDateToIso(raw: string): string | null {
  const text = raw.trim();

  // dd/mm/yyyy or dd-mm-yyyy
  const numeric = text.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
  if (numeric) {
    const [, d, m, y] = numeric;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // "23 Januari 2026" / "January 23, 2026" / "23 Jan 2026"
  const wordMatch = text.match(/(\d{1,2})\s+([A-Za-zÀ-ÿ]+)\s+(\d{4})/) || text.match(/([A-Za-zÀ-ÿ]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (wordMatch) {
    const parts = wordMatch.slice(1);
    const monthWord = parts.find((p) => Number.isNaN(Number(p)))?.toLowerCase() ?? "";
    const day = parts.find((p) => !Number.isNaN(Number(p)) && Number(p) <= 31 && Number(p) !== Number(parts[2]));
    const year = parts.find((p) => Number(p) > 1900);
    const month =
      MONTHS_ID[monthWord] ??
      MONTHS_ID[Object.keys(MONTHS_ID).find((k) => k.startsWith(monthWord.slice(0, 3))) ?? ""] ??
      MONTHS_EN[monthWord] ??
      MONTHS_EN[Object.keys(MONTHS_EN).find((k) => k.startsWith(monthWord.slice(0, 3))) ?? ""];
    if (month && day && year) {
      return `${year}-${month}-${day.padStart(2, "0")}`;
    }
  }

  return null;
}

/**
 * Best-effort extraction of tracker fields from OCR'd text of a job
 * application confirmation screenshot. This is intentionally
 * conservative: screenshots from different platforms vary wildly in
 * layout, so this returns *guesses* meant to pre-fill the "Add
 * application" form for the user to review and correct — it never
 * creates a tracker entry directly.
 */
export function parseApplicationScreenshot(rawText: string): ScreenshotParseResult {
  const lines = splitLines(rawText);
  const guess: Partial<TrackerEntryDraft> = {};
  const fieldsFound: (keyof TrackerEntryDraft)[] = [];

  // Site: scan the whole text for a platform name.
  for (const { pattern, site } of SITE_KEYWORDS) {
    if (pattern.test(rawText)) {
      guess.site = site;
      fieldsFound.push("site");
      break;
    }
  }

  // Line-by-line labeled fields first (most reliable).
  for (const line of lines) {
    if (!guess.position) {
      const m = line.match(POSITION_LABEL);
      if (m) {
        guess.position = m[2].trim();
        fieldsFound.push("position");
        continue;
      }
    }
    if (!guess.company) {
      const m = line.match(COMPANY_LABEL);
      if (m) {
        guess.company = m[2].trim();
        fieldsFound.push("company");
        continue;
      }
    }
    if (!guess.applicationDate) {
      const m = line.match(DATE_LABEL);
      if (m) {
        const iso = parseDateToIso(m[3] ?? m[2] ?? "");
        if (iso) {
          guess.applicationDate = iso;
          fieldsFound.push("applicationDate");
        }
        continue;
      }
    }
  }

  // Fallback: English "for [Position] at [Company]" — more specific than
  // the banner pattern below, so it's tried first; otherwise a sentence
  // like "application for X at Y has been sent" lets the looser banner
  // pattern's lazy match run all the way to "sent" and swallow "at Y" too.
  if (!guess.position || !guess.company) {
    const m = rawText.match(FOR_POSITION_AT_COMPANY_PATTERN);
    if (m) {
      if (!guess.position) {
        guess.position = m[1].trim();
        fieldsFound.push("position");
      }
      if (!guess.company) {
        guess.company = m[2].trim().replace(/[.,]$/, "");
        fieldsFound.push("company");
      }
    }
  }

  // Fallback: "Lamaran Anda untuk X telah terkirim" style banner (position only).
  if (!guess.position) {
    const m = rawText.match(APPLIED_FOR_PATTERN);
    if (m) {
      guess.position = m[1].trim();
      fieldsFound.push("position");
    }
  }

  // Fallback: a bare "PT ..." line (no label, no surrounding sentence) —
  // common on screens that just print the company name as its own line.
  if (!guess.company) {
    const companyLine = lines.find((l) => COMPANY_PREFIX_LINE.test(l));
    if (companyLine) {
      guess.company = companyLine.trim();
      fieldsFound.push("company");
    }
  }

  // Fallback: scan for any recognizable date anywhere in the text.
  if (!guess.applicationDate) {
    for (const line of lines) {
      const iso = parseDateToIso(line);
      if (iso) {
        guess.applicationDate = iso;
        fieldsFound.push("applicationDate");
        break;
      }
    }
  }

  return { guess, fieldsFound };
}
