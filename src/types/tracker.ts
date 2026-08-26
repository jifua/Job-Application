export type ApplicationStatus =
  | "applied"
  | "screening"
  | "test"
  | "interview"
  | "offer"
  | "rejected"
  | "ghosted"
  | "withdrawn";

/**
 * Where the application was submitted. This is a free-text-friendly enum:
 * the UI offers these as quick-pick options, but "other" + a note covers
 * anything not listed. Kept intentionally small — this is NOT a live
 * integration with these platforms (no such public API exists for any of
 * them), just a label the user chooses for their own records.
 */
export type ApplicationSite =
  | "jobstreet"
  | "glints"
  | "dealls"
  | "talentic"
  | "linkedin"
  | "company_site"
  | "email"
  | "referral"
  | "other";

export const SITE_LABELS: Record<ApplicationSite, string> = {
  jobstreet: "JobStreet",
  glints: "Glints",
  dealls: "Dealls",
  talentic: "Talentic",
  linkedin: "LinkedIn",
  company_site: "Company website",
  email: "Email",
  referral: "Referral",
  other: "Other",
};

export const SITE_ORDER: ApplicationSite[] = [
  "jobstreet",
  "glints",
  "dealls",
  "talentic",
  "linkedin",
  "company_site",
  "email",
  "referral",
  "other",
];

export interface TrackerEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  jobUrl: string;
  site: ApplicationSite;
  applicationDate: string; // ISO date string, e.g. "2026-08-19"
  deadline: string; // ISO date string, or "" if none
  status: ApplicationStatus;
  jobDescription: string; // pasted/typed job description, for reference later
  qualifications: string; // key qualifications/requirements noted from the posting
  notes: string;
  /** Bumped when the shape of TrackerEntry changes, so future migrations are possible. */
  schemaVersion: 2;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  /** History of status changes, newest last. Populated going forward; older entries may have none. */
  statusHistory: { status: ApplicationStatus; changedAt: string }[];
}

export type TrackerEntryDraft = Omit<
  TrackerEntry,
  "id" | "schemaVersion" | "createdAt" | "updatedAt" | "statusHistory"
>;

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  screening: "Screening",
  test: "Test",
  interview: "Interview",
  offer: "Offer / Accepted",
  rejected: "Rejected",
  ghosted: "Ghosted (no response)",
  withdrawn: "Withdrawn",
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "applied",
  "screening",
  "test",
  "interview",
  "offer",
  "rejected",
  "ghosted",
  "withdrawn",
];

/** Statuses considered "final" for an application — nothing more is expected to happen. */
export const TERMINAL_STATUSES: ApplicationStatus[] = ["offer", "rejected", "ghosted", "withdrawn"];

/**
 * Number of days since the last update after which an "applied"/"screening"
 * entry with no response is *suggested* as possible ghosting. This is a
 * suggestion surfaced in the UI, not an automatic status change — the user
 * decides whether to mark it as ghosted.
 */
export const GHOSTING_THRESHOLD_DAYS = 30;

export interface TrackerStats {
  total: number;
  interviews: number;
  tests: number;
  offers: number;
  rejected: number;
  ghosted: number;
  pending: number;
  interviewRate: number; // %
  responseRate: number; // %
  offerRate: number; // %
  ghostRate: number; // %
}
