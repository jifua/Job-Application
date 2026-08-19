export type PracticeTrack =
  | "general"
  | "fresh-graduate"
  | "software-engineer"
  | "data-analyst"
  | "ai-engineer"
  | "technician"
  | "admin"
  | "customer-service";

export interface TrackDefinition {
  id: PracticeTrack;
  label: string;
  description: string;
}

export type QuestionCategory = "general" | "behavioral" | "situational" | "role-specific";

export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  /** Short, actionable guidance on how to approach the answer. */
  tip: string;
  /** "all" = shown for every track. Otherwise the specific track(s) this question is tagged for. */
  tracks: PracticeTrack[] | "all";
}
