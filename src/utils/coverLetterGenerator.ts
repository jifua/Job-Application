import type { CoverLetterInput } from "../types/coverLetter";

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

function joinSkills(skills: string[]): string {
  if (skills.length === 0) return "";
  if (skills.length === 1) return skills[0];
  if (skills.length === 2) return `${skills[0]} and ${skills[1]}`;
  return `${skills.slice(0, -1).join(", ")}, and ${skills[skills.length - 1]}`;
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

const FORMAL_OPENERS = [
  (p: string, c: string) =>
    `I am writing to express my interest in the ${p} position at ${c}, as I believe my background is a strong fit for this role.`,
  (p: string, c: string) =>
    `I would like to formally apply for the ${p} position at ${c}.`,
  (p: string, c: string) =>
    `It is with great interest that I submit my application for the ${p} position at ${c}.`,
];

const FRIENDLY_OPENERS = [
  (p: string, c: string) => `I'm excited to apply for the ${p} role at ${c}!`,
  (p: string, c: string) =>
    `I came across the ${p} opening at ${c} and knew I had to apply.`,
  (p: string, c: string) => `I'd love to be considered for the ${p} position at ${c}.`,
];

const FORMAL_CLOSERS = [
  (c: string) =>
    `Thank you for considering my application. I would welcome the opportunity to discuss how my background could contribute to ${c}, and I have attached my CV for your review.`,
  (c: string) =>
    `I appreciate your time reviewing my application and would be glad to discuss my fit for this role at ${c} further. My CV is attached for more detail.`,
];

const FRIENDLY_CLOSERS = [
  (c: string) =>
    `Thanks so much for taking the time to read this — I'd love the chance to chat more about how I could contribute to ${c}. I've attached my CV for a closer look.`,
  (c: string) =>
    `I'd really appreciate the opportunity to talk more about joining ${c}. My CV is attached — looking forward to hearing from you!`,
];

/**
 * Builds a cover letter draft from structured input, using small banks of
 * template phrasing selected deterministically by `variantIndex` (so the
 * "Try another wording" button gives real variety without any AI/API call).
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

  const openers = isFormal ? FORMAL_OPENERS : FRIENDLY_OPENERS;
  const closers = isFormal ? FORMAL_CLOSERS : FRIENDLY_CLOSERS;
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
      `My background includes hands-on experience with ${joinSkills(skills)}, which I believe lines up well with what you're looking for in this role.`
    );
  }

  if (achievement) {
    const sentence = fitSentence(achievement);
    paragraphs.push("", sentence);
  }

  if (whyCompany) {
    paragraphs.push("", `What draws me to ${company} specifically is ${fitFragment(whyCompany).toLowerCase()}.`);
  }

  paragraphs.push("", closer, "", isFormal ? "Sincerely," : "Best,", name || "[Your name]");

  return paragraphs.join("\n");
}
