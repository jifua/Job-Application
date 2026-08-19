export interface CvMatchResult {
  /** Skills detected in the job description (the "required" set). */
  requiredSkills: string[];
  /** Required skills that also appear in the CV. */
  matchedSkills: string[];
  /** Required skills that do NOT appear in the CV. */
  missingSkills: string[];
  /** Skills found in the CV that the job description didn't ask for. */
  additionalCvSkills: string[];
  /** matchedSkills.length / requiredSkills.length * 100, rounded. 0 if no required skills. */
  matchScore: number;
}
