export type ApplicationStatus =
  | "applied"
  | "screening"
  | "test"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface TrackerEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  jobUrl: string;
  applicationDate: string; // ISO date string, e.g. "2026-08-19"
  deadline: string; // ISO date string, or "" if none
  status: ApplicationStatus;
  notes: string;
  /** Bumped when the shape of TrackerEntry changes, so future migrations are possible. */
  schemaVersion: 1;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export type TrackerEntryDraft = Omit<TrackerEntry, "id" | "schemaVersion" | "createdAt" | "updatedAt">;

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  screening: "Screening",
  test: "Test",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "applied",
  "screening",
  "test",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

export interface TrackerStats {
  total: number;
  interviews: number;
  tests: number;
  offers: number;
  rejected: number;
  pending: number;
  interviewRate: number; // %
  responseRate: number; // %
  offerRate: number; // %
}
