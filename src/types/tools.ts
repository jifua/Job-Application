// Shared types for the tool cards shown on the Home page.
// Feature-specific types (CV, JobDescription, TrackerEntry, etc.)
// will be added in their respective phases.

export interface ToolSummary {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: "match" | "analyze" | "letter" | "practice" | "tracker";
}
