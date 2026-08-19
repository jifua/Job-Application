import type { JobAnalysis, DetectedField, JobChecks } from "../types/job";
import { splitLines, isBulletLine, stripBulletMarker } from "./textNormalizer";
import { extractSkills } from "./skillExtractor";

const LABELED_FIELD_PATTERNS: Record<string, RegExp> = {
  position: /^(job\s*title|position|role|posisi|jabatan)\s*[:\-]\s*(.+)$/i,
  company: /^(company|perusahaan)\s*[:\-]\s*(.+)$/i,
  location: /^(location|lokasi)\s*[:\-]\s*(.+)$/i,
};

const RESPONSIBILITY_HEADERS =
  /^(responsibilities|job\s*description|duties|key\s*responsibilities|tanggung\s*jawab|deskripsi\s*pekerjaan|tugas)\s*:?\s*$/i;

const REQUIREMENT_HEADERS =
  /^(requirements?|qualifications?|kualifikasi|persyaratan|syarat(\s*&?\s*ketentuan)?)\s*:?\s*$/i;

const SECTION_HEADER = new RegExp(
  `${RESPONSIBILITY_HEADERS.source}|${REQUIREMENT_HEADERS.source}`,
  "i"
);

const CITY_OR_REMOTE_PATTERN =
  /\b(jakarta|bandung|surabaya|yogyakarta|semarang|medan|makassar|denpasar|bali|tangerang|bekasi|depok|bogor|remote|hybrid|on-?site|work from home|wfh)\b/i;

const EXPERIENCE_PATTERN =
  /(\d+\s*[-–to]+\s*\d+\s*(years?|tahun))|(\d+\+?\s*(years?|tahun)\s*(of)?\s*(experience|pengalaman)?)|(fresh\s*graduate)|(entry[-\s]?level)|(no\s*experience\s*required)/i;

const EDUCATION_PATTERN =
  /\b(bachelor'?s?( degree)?|master'?s?( degree)?|diploma|d3|s1|s2|sma\/smk|sma|smk|associate degree)\b/i;

const SALARY_PATTERN = /\b(rp\.?\s?\d|idr\s?\d|salary range|gaji\s*[:\-]?\s*rp|\$\s?\d{2,}|take[-\s]?home\s*pay)\b/i;

const DEADLINE_PATTERN =
  /\b(deadline|batas\s*(waktu\s*)?lamaran|apply\s*before|application\s*deadline|closing\s*date|paling\s*lambat)\b/i;

const DOCUMENT_KEYWORDS: { pattern: RegExp; label: string }[] = [
  { pattern: /\bcv\b/i, label: "CV" },
  { pattern: /\bresume\b/i, label: "Resume" },
  { pattern: /\bportfolio\b/i, label: "Portfolio" },
  { pattern: /\btranscript|transkrip\b/i, label: "Transcript" },
  { pattern: /\bcover letter|surat lamaran\b/i, label: "Cover letter" },
  { pattern: /\bijazah\b/i, label: "Ijazah" },
  { pattern: /\bktp\b/i, label: "KTP" },
];

function detectLabeledField(lines: string[], key: keyof typeof LABELED_FIELD_PATTERNS): DetectedField<string> {
  const pattern = LABELED_FIELD_PATTERNS[key];
  for (const line of lines) {
    const match = line.match(pattern);
    if (match && match[2]?.trim()) {
      return { value: match[2].trim(), detected: true };
    }
  }
  return { value: "Not detected — please check manually", detected: false };
}

function detectExperience(text: string): DetectedField<string> {
  const match = text.match(EXPERIENCE_PATTERN);
  if (match) {
    return { value: match[0].trim(), detected: true };
  }
  return { value: "Not detected — please check manually", detected: false };
}

function detectEducation(text: string): DetectedField<string> {
  const match = text.match(EDUCATION_PATTERN);
  if (match) {
    return { value: match[0].trim(), detected: true };
  }
  return { value: "Not detected — please check manually", detected: false };
}

function detectLocation(lines: string[], text: string): DetectedField<string> {
  const labeled = detectLabeledField(lines, "location");
  if (labeled.detected) return labeled;

  const match = text.match(CITY_OR_REMOTE_PATTERN);
  if (match) {
    return { value: match[0].trim(), detected: true };
  }
  return { value: "Not detected — please check manually", detected: false };
}

function detectWorkArrangement(text: string): DetectedField<string> {
  const match = text.match(/\b(remote|hybrid|on-?site|work from home|wfh|kerja dari rumah)\b/i);
  if (match) {
    const normalized = match[0].toLowerCase();
    if (normalized.includes("remote") || normalized.includes("wfh") || normalized.includes("kerja dari rumah")) {
      return { value: "Remote", detected: true };
    }
    if (normalized.includes("hybrid")) {
      return { value: "Hybrid", detected: true };
    }
    return { value: "On-site", detected: true };
  }
  return { value: "Not specified", detected: false };
}

/**
 * Extracts bullet or short-line items that follow a section header
 * (e.g. "Responsibilities:") until the next section header or the
 * end of the text.
 */
function extractSection(lines: string[], headerPattern: RegExp): string[] {
  const items: string[] = [];
  let collecting = false;
  let sawBullet = false;

  for (const line of lines) {
    if (headerPattern.test(line)) {
      collecting = true;
      sawBullet = false;
      continue;
    }
    if (!collecting) continue;

    if (SECTION_HEADER.test(line) && !headerPattern.test(line)) {
      break; // hit the *other* section's header — stop collecting this one
    }

    const bulleted = isBulletLine(line);

    if (bulleted) {
      sawBullet = true;
      items.push(stripBulletMarker(line));
    } else if (!sawBullet) {
      // Still intro prose before any bullet has appeared — keep it,
      // since some postings write responsibilities as a paragraph.
      items.push(line);
    } else {
      // We were collecting a bullet list and hit a non-bullet line —
      // treat that as the end of the section (e.g. a closing sentence
      // like "Please send your CV...") rather than part of it.
      break;
    }

    if (items.length >= 12) break; // sane upper bound
  }

  return items;
}

function detectDocuments(text: string): string[] {
  const found: string[] = [];
  for (const { pattern, label } of DOCUMENT_KEYWORDS) {
    if (pattern.test(text) && !found.includes(label)) {
      found.push(label);
    }
  }
  return found;
}

function buildChecks(text: string, location: DetectedField<string>, experience: DetectedField<string>): JobChecks {
  return {
    salaryDisclosed: SALARY_PATTERN.test(text),
    experienceStated: experience.detected,
    locationStated: location.detected,
    workArrangement: detectWorkArrangement(text),
    deadlineStated: DEADLINE_PATTERN.test(text),
    requiredDocuments: detectDocuments(text),
  };
}

/**
 * Analyzes a pasted job description using deterministic keyword/regex
 * heuristics — no AI model or external API. Every result is paired with
 * a `detected` flag so the UI can be honest about what it actually found
 * versus what it's guessing.
 */
export function analyzeJobDescription(rawText: string): JobAnalysis {
  const lines = splitLines(rawText);

  const position = detectLabeledField(lines, "position");
  const company = detectLabeledField(lines, "company");
  const experience = detectExperience(rawText);
  const education = detectEducation(rawText);
  const location = detectLocation(lines, rawText);
  const skills = extractSkills(rawText);
  const responsibilities = extractSection(lines, RESPONSIBILITY_HEADERS);
  const requirements = extractSection(lines, REQUIREMENT_HEADERS);
  const checks = buildChecks(rawText, location, experience);

  return {
    position,
    company,
    location,
    experience,
    education,
    skills,
    responsibilities,
    requirements,
    checks,
  };
}
