import { joinWithAnd } from "./textList";

export interface TailoredCvOptions {
  cvText: string;
  targetPosition: string; // "" if not detected/known
  matchedSkills: string[];
  missingSkills: string[];
  additionalCvSkills: string[];
}

/**
 * Builds a "tailored CV draft" as plain text:
 *  - A short professional summary generated from the role + matched skills.
 *  - A Key Skills section that puts the job-relevant (matched) skills first.
 *  - The user's original CV content, unchanged, below a clear divider.
 *
 * This intentionally does NOT rewrite work experience or projects — doing
 * that well requires understanding context this app doesn't have (and
 * doing it badly would insert inaccurate claims into someone's CV). The
 * value here is: don't make the user manually reorder skills or write a
 * summary line by hand.
 */
export function generateTailoredCv(options: TailoredCvOptions): string {
  const { cvText, targetPosition, matchedSkills, missingSkills, additionalCvSkills } = options;

  const topMatched = matchedSkills.slice(0, 5);
  const roleLabel = targetPosition ? `${targetPosition} candidate` : "Candidate";

  const summaryParts: string[] = [];
  if (topMatched.length > 0) {
    summaryParts.push(`${roleLabel} with hands-on experience in ${joinWithAnd(topMatched)}.`);
  } else {
    summaryParts.push(`${roleLabel} with a background in ${joinWithAnd(additionalCvSkills.slice(0, 3))}.`);
  }
  if (missingSkills.length > 0) {
    summaryParts.push(`Currently building further skills in ${joinWithAnd(missingSkills.slice(0, 3))}.`);
  }

  const orderedSkills = [...matchedSkills, ...additionalCvSkills];

  const sections = [
    targetPosition && `Target role: ${targetPosition}`,
    "PROFESSIONAL SUMMARY",
    summaryParts.join(" "),
    orderedSkills.length > 0 && "KEY SKILLS",
    orderedSkills.length > 0 && orderedSkills.join(", "),
    "— Original CV content below — review and integrate the summary/skills above, then edit as needed —",
    cvText.trim(),
  ].filter((section): section is string => Boolean(section));

  return sections.join("\n\n");
}
