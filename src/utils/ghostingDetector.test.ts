import { describe, it, expect } from "vitest";
import { isLikelyGhosted } from "./ghostingDetector";
import { createEntry } from "../services/trackerStorage";
import type { TrackerEntryDraft } from "../types/tracker";

const BASE_DRAFT: TrackerEntryDraft = {
  company: "PT Contoh",
  position: "Staff",
  location: "",
  jobUrl: "",
  site: "other",
  applicationDate: "2026-01-01",
  deadline: "",
  status: "applied",
  jobDescription: "",
  qualifications: "",
  notes: "",
};

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

describe("isLikelyGhosted", () => {
  it("is false for a freshly created entry (updated moments ago)", () => {
    const entry = createEntry(BASE_DRAFT);
    expect(isLikelyGhosted(entry)).toBe(false);
  });

  it("is true once 30+ days have passed with no update, for a non-terminal status", () => {
    const entry = createEntry(BASE_DRAFT);
    const oldEntry = { ...entry, updatedAt: new Date(daysAgo(31)).toISOString() };
    expect(isLikelyGhosted(oldEntry)).toBe(true);
  });

  it("is false just under the threshold (29 days)", () => {
    const entry = createEntry(BASE_DRAFT);
    const recentEntry = { ...entry, updatedAt: new Date(daysAgo(29)).toISOString() };
    expect(isLikelyGhosted(recentEntry)).toBe(false);
  });

  it("is false for terminal statuses even if old, since there's nothing left to ghost", () => {
    const entry = createEntry({ ...BASE_DRAFT, status: "offer" });
    const oldOffer = { ...entry, updatedAt: new Date(daysAgo(90)).toISOString() };
    expect(isLikelyGhosted(oldOffer)).toBe(false);

    const oldRejected = { ...createEntry({ ...BASE_DRAFT, status: "rejected" }), updatedAt: new Date(daysAgo(90)).toISOString() };
    expect(isLikelyGhosted(oldRejected)).toBe(false);

    const oldGhosted = { ...createEntry({ ...BASE_DRAFT, status: "ghosted" }), updatedAt: new Date(daysAgo(90)).toISOString() };
    expect(isLikelyGhosted(oldGhosted)).toBe(false);
  });
});
