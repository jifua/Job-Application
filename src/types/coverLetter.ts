export type CoverLetterTone = "formal" | "friendly";

export interface CoverLetterInput {
  fullName: string;
  position: string;
  company: string;
  /** Optional. Empty means "Dear Hiring Manager" / "Hi there". */
  hiringManager: string;
  /** Raw comma-separated input, e.g. "Python, SQL, Excel". */
  keySkillsRaw: string;
  /** One or two sentences about a relevant achievement or experience. Optional. */
  achievement: string;
  /** Why this company specifically, in the user's own words. Optional. */
  whyCompany: string;
  tone: CoverLetterTone;
}
