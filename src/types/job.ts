/**
 * Wraps a value together with whether it was actually detected in the
 * pasted text, or just defaulted. The UI uses `detected` to decide
 * between showing the value and showing "Not detected — please check
 * manually" (see JD_ANALYZER copy rules: never claim certainty we don't have).
 */
export interface DetectedField<T> {
  value: T;
  detected: boolean;
}

export interface JobChecks {
  salaryDisclosed: boolean;
  experienceStated: boolean;
  locationStated: boolean;
  workArrangement: DetectedField<string>;
  deadlineStated: boolean;
  requiredDocuments: string[];
}

export interface JobAnalysis {
  position: DetectedField<string>;
  company: DetectedField<string>;
  location: DetectedField<string>;
  experience: DetectedField<string>;
  education: DetectedField<string>;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
  checks: JobChecks;
}
