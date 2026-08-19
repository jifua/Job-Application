import type { CvMatchResult } from "../types/cv";
import { extractSkills } from "./skillExtractor";
import { calculateMatchScore } from "./scoreCalculator";

/**
 * Compares a CV against a job description using the same skill
 * dictionary as the JD Analyzer, so a skill detected on one screen is
 * detected consistently on the other.
 *
 * "Required skills" = every dictionary skill found in the job
 * description. This is a simplification (a JD doesn't distinguish
 * "must-have" from "nice-to-have" in free text), stated clearly in the
 * UI so the score isn't over-trusted.
 */
export function matchCvToJob(cvText: string, jobDescriptionText: string): CvMatchResult {
  const requiredSkills = extractSkills(jobDescriptionText);
  const cvSkills = extractSkills(cvText);
  const cvSkillSet = new Set(cvSkills);
  const requiredSkillSet = new Set(requiredSkills);

  const matchedSkills = requiredSkills.filter((skill) => cvSkillSet.has(skill));
  const missingSkills = requiredSkills.filter((skill) => !cvSkillSet.has(skill));
  const additionalCvSkills = cvSkills.filter((skill) => !requiredSkillSet.has(skill));

  const matchScore = calculateMatchScore(matchedSkills.length, requiredSkills.length);

  return {
    requiredSkills,
    matchedSkills,
    missingSkills,
    additionalCvSkills,
    matchScore,
  };
}
