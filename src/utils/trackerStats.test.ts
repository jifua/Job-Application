import { describe, it, expect } from "vitest";
import { calculateStats } from "./trackerStats";
import { createEntry } from "../services/trackerStorage";
import type { ApplicationStatus } from "../types/tracker";

function makeEntries(statuses: ApplicationStatus[]) {
  return statuses.map((status) =>
    createEntry({
      company: "Test Co",
      position: "Test Role",
      location: "",
      jobUrl: "",
      applicationDate: "2026-08-01",
      deadline: "",
      status,
      notes: "",
    })
  );
}

describe("calculateStats", () => {
  it("reproduces the spec's worked example (47 applications, 17% interview rate)", () => {
    const statuses: ApplicationStatus[] = [
      ...Array(8).fill("interview"),
      ...Array(5).fill("test"),
      ...Array(1).fill("offer"),
      ...Array(10).fill("rejected"),
      ...Array(23).fill("applied"),
    ];
    const stats = calculateStats(makeEntries(statuses));

    expect(stats.total).toBe(47);
    expect(stats.interviews).toBe(8);
    expect(stats.tests).toBe(5);
    expect(stats.offers).toBe(1);
    expect(stats.interviewRate).toBe(17);
  });

  it("returns all zeros for an empty tracker, without NaN", () => {
    const stats = calculateStats([]);
    expect(stats.total).toBe(0);
    expect(stats.interviewRate).toBe(0);
    expect(stats.responseRate).toBe(0);
    expect(stats.offerRate).toBe(0);
  });

  it("counts anything not offer/rejected/withdrawn as pending", () => {
    const stats = calculateStats(
      makeEntries(["applied", "screening", "test", "interview", "offer", "rejected", "withdrawn"])
    );
    expect(stats.pending).toBe(4); // applied, screening, test, interview
  });
});
