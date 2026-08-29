import type { CoverLetterInput } from "../types/coverLetter";
import { joinWithAnd } from "./textList";

/**
 * Splits a comma-separated skills string into a clean list, trims each
 * entry, drops empties/duplicates, and caps the count so the generated
 * paragraph doesn't turn into an unreadable list.
 */
export function parseSkillsInput(raw: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
    if (result.length >= 8) break;
  }
  return result;
}

/** Ensures user-provided free text reads as a sentence fragment: lowercase first letter isn't forced, just trims and drops a trailing period so it fits mid-sentence. */
function fitFragment(text: string): string {
  const trimmed = text.trim();
  return trimmed.replace(/[.!]+$/, "");
}

/** Ensures user-provided free text reads as a standalone sentence. */
function fitSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const withPeriod = /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  return withPeriod.charAt(0).toUpperCase() + withPeriod.slice(1);
}

// ---------- English phrase banks ----------

const EN_FORMAL_OPENERS = [
  (p: string, c: string) =>
    `I am writing to express my interest in the ${p} position at ${c}, as I believe my background is a strong fit for this role.`,
  (p: string, c: string) => `I would like to formally apply for the ${p} position at ${c}.`,
  (p: string, c: string) => `It is with great interest that I submit my application for the ${p} position at ${c}.`,
];

const EN_FRIENDLY_OPENERS = [
  (p: string, c: string) => `I'm excited to apply for the ${p} role at ${c}!`,
  (p: string, c: string) => `I came across the ${p} opening at ${c} and knew I had to apply.`,
  (p: string, c: string) => `I'd love to be considered for the ${p} position at ${c}.`,
];

const EN_FORMAL_CLOSERS = [
  (c: string) =>
    `Thank you for considering my application. I would welcome the opportunity to discuss how my background could contribute to ${c}, and I have attached my CV for your review.`,
  (c: string) =>
    `I appreciate your time reviewing my application and would be glad to discuss my fit for this role at ${c} further. My CV is attached for more detail.`,
];

const EN_FRIENDLY_CLOSERS = [
  (c: string) =>
    `Thanks so much for taking the time to read this — I'd love the chance to chat more about how I could contribute to ${c}. I've attached my CV for a closer look.`,
  (c: string) =>
    `I'd really appreciate the opportunity to talk more about joining ${c}. My CV is attached — looking forward to hearing from you!`,
];

// ---------- Indonesian phrase banks ----------
// Written fresh for this generator (not translated word-for-word from the
// English bank above), so the Indonesian output reads naturally rather
// than like a literal translation.

const ID_FORMAL_OPENERS = [
  (p: string, c: string) =>
    `Dengan hormat, saya bermaksud mengajukan lamaran untuk posisi ${p} di ${c}, karena saya yakin latar belakang saya sesuai dengan kebutuhan posisi ini.`,
  (p: string, c: string) => `Melalui surat ini, saya ingin mengajukan diri untuk posisi ${p} di ${c}.`,
  (p: string, c: string) =>
    `Dengan penuh antusiasme, saya mengajukan lamaran untuk posisi ${p} yang dibuka oleh ${c}.`,
];

const ID_FRIENDLY_OPENERS = [
  (p: string, c: string) => `Saya sangat senang bisa melamar posisi ${p} di ${c}!`,
  (p: string, c: string) => `Begitu melihat lowongan ${p} di ${c}, saya langsung tertarik untuk melamar.`,
  (p: string, c: string) => `Saya ingin mengajukan diri untuk posisi ${p} di ${c}.`,
];

const ID_FORMAL_CLOSERS = [
  (c: string) =>
    `Demikian surat lamaran ini saya sampaikan. Saya sangat terbuka untuk mendiskusikan lebih lanjut bagaimana saya dapat berkontribusi di ${c}, dan CV saya lampirkan sebagai bahan pertimbangan.`,
  (c: string) =>
    `Terima kasih atas waktu dan perhatian Bapak/Ibu dalam meninjau lamaran ini. Saya berharap dapat berdiskusi lebih lanjut mengenai kecocokan saya untuk posisi ini di ${c}. CV terlampir untuk informasi lebih rinci.`,
];

const ID_FRIENDLY_CLOSERS = [
  (c: string) =>
    `Terima kasih banyak sudah meluangkan waktu membaca surat ini — saya senang sekali kalau bisa ngobrol lebih lanjut soal bagaimana saya bisa berkontribusi di ${c}. CV saya lampirkan untuk dilihat lebih detail.`,
  (c: string) =>
    `Saya akan senang sekali kalau bisa membahas lebih lanjut soal bergabung dengan ${c}. CV terlampir — semoga bisa segera ngobrol!`,
];

/**
 * Builds a cover letter draft from structured input, using small banks of
 * template phrasing selected deterministically by `variantIndex` (so the
 * "Try another wording" button gives real variety without any AI/API call).
 * Output language follows `input.language` — English and Indonesian use
 * separate, independently-written phrase banks rather than a translation
 * of one into the other, so both read naturally.
 */
export function generateCoverLetter(input: CoverLetterInput, variantIndex = 0): string {
  const name = input.fullName.trim();
  const position = input.position.trim();
  const company = input.company.trim();
  const manager = input.hiringManager.trim();
  const skills = parseSkillsInput(input.keySkillsRaw);
  const achievement = input.achievement.trim();
  const whyCompany = input.whyCompany.trim();
  const isFormal = input.tone === "formal";
  const isIndonesian = input.language === "id";

  if (isIndonesian) {
    const openers = isFormal ? ID_FORMAL_OPENERS : ID_FRIENDLY_OPENERS;
    const closers = isFormal ? ID_FORMAL_CLOSERS : ID_FRIENDLY_CLOSERS;
    const opener = openers[variantIndex % openers.length](position, company);
    const closer = closers[variantIndex % closers.length](company);

    const greeting = manager
      ? `Kepada Yth. ${manager},`
      : isFormal
        ? "Kepada Yth. Bapak/Ibu HRD,"
        : "Halo,";

    const paragraphs: string[] = [greeting, "", opener];

    if (skills.length > 0) {
      paragraphs.push(
        "",
        `Saya memiliki pengalaman langsung dengan ${joinWithAnd(skills)}, yang saya yakini relevan dengan kebutuhan posisi ini.`
      );
    }

    if (achievement) {
      paragraphs.push("", fitSentence(achievement));
    }

    if (whyCompany) {
      paragraphs.push("", `Hal yang membuat saya tertarik pada ${company} secara khusus adalah ${fitFragment(whyCompany).toLowerCase()}.`);
    }

    paragraphs.push("", closer, "", "Hormat saya,", name || "[Nama Anda]");

    return paragraphs.join("\n");
  }

  const openers = isFormal ? EN_FORMAL_OPENERS : EN_FRIENDLY_OPENERS;
  const closers = isFormal ? EN_FORMAL_CLOSERS : EN_FRIENDLY_CLOSERS;
  const opener = openers[variantIndex % openers.length](position, company);
  const closer = closers[variantIndex % closers.length](company);

  const greeting = manager
    ? isFormal
      ? `Dear ${manager},`
      : `Hi ${manager},`
    : isFormal
      ? "Dear Hiring Manager,"
      : "Hi there,";

  const paragraphs: string[] = [greeting, "", opener];

  if (skills.length > 0) {
    paragraphs.push(
      "",
      `My background includes hands-on experience with ${joinWithAnd(skills)}, which I believe lines up well with what you're looking for in this role.`
    );
  }

  if (achievement) {
    paragraphs.push("", fitSentence(achievement));
  }

  if (whyCompany) {
    paragraphs.push("", `What draws me to ${company} specifically is ${fitFragment(whyCompany).toLowerCase()}.`);
  }

  paragraphs.push("", closer, "", isFormal ? "Sincerely," : "Best,", name || "[Your name]");

  return paragraphs.join("\n");
}
