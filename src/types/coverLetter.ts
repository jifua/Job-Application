export type CoverLetterTone = "formal" | "friendly";
export type CoverLetterLanguage = "id" | "en";

export interface CoverLetterInput {
  fullName: string;
  position: string;
  company: string;
  /** Optional. Empty means "Dear Hiring Manager" / "Kepada Yth. Bapak/Ibu HRD". */
  hiringManager: string;
  /** Raw comma-separated input, e.g. "Python, SQL, Excel". */
  keySkillsRaw: string;
  /** One or two sentences about a relevant achievement or experience. Optional. */
  achievement: string;
  /** Why this company specifically, in the user's own words. Optional. */
  whyCompany: string;
  tone: CoverLetterTone;
  /** Language of the generated letter — independent of the site's UI language. */
  language: CoverLetterLanguage;
}
