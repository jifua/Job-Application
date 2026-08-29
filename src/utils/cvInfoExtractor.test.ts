import { describe, it, expect } from "vitest";
import { extractApplicantName, extractLikelyAchievement } from "./cvInfoExtractor";

describe("extractApplicantName", () => {
  it("prefers an explicit 'Nama: X' label", () => {
    const cv = "CURRICULUM VITAE\nNama: Siti Aminah\nEmail: siti@email.com";
    expect(extractApplicantName(cv)).toEqual({ value: "Siti Aminah", detected: true });
  });

  it("prefers an explicit 'Name: X' label (English)", () => {
    const cv = "RESUME\nName: John Carter\nPhone: 0812xxxx";
    expect(extractApplicantName(cv)).toEqual({ value: "John Carter", detected: true });
  });

  it("falls back to the first line if it looks like a Title Case name", () => {
    const cv = "Budi Santoso\nFresh Graduate in Accounting\n\nSkills: Excel, SAP";
    expect(extractApplicantName(cv)).toEqual({ value: "Budi Santoso", detected: true });
  });

  it("does not mistake a 'Curriculum Vitae' header for a name", () => {
    const cv = "Curriculum Vitae\nBudi Santoso\nAccounting Graduate";
    expect(extractApplicantName(cv)).toEqual({ value: "Budi Santoso", detected: true });
  });

  it("returns undetected when nothing plausible is found", () => {
    const cv = "SKILLS AND EXPERIENCE SUMMARY\n\nProficient in various tools and technologies used across industries.";
    expect(extractApplicantName(cv).detected).toBe(false);
  });

  it("does not treat a long sentence as a name", () => {
    const cv = "This is a summary paragraph about my professional background and goals.";
    expect(extractApplicantName(cv).detected).toBe(false);
  });
});

describe("extractLikelyAchievement", () => {
  it("prefers a bullet with both an achievement verb and a number", () => {
    const cv = [
      "Experience:",
      "- Responsible for daily reporting",
      "- Berhasil meningkatkan efisiensi tim sebesar 25% dalam 3 bulan",
      "- Attended weekly meetings",
    ].join("\n");
    const result = extractLikelyAchievement(cv);
    expect(result.detected).toBe(true);
    expect(result.value).toContain("25%");
  });

  it("falls back to a verb-only bullet when no bullet has both verb and number", () => {
    const cv = ["- Managed a small team of interns", "- Attended weekly meetings"].join("\n");
    const result = extractLikelyAchievement(cv);
    expect(result.detected).toBe(true);
    expect(result.value).toContain("Managed");
  });

  it("returns undetected when no line looks achievement-shaped", () => {
    const cv = "- Attended meetings\n- Used email regularly";
    expect(extractLikelyAchievement(cv).detected).toBe(false);
  });

  it("ignores overly short or overly long lines", () => {
    const cv = `- Increased 5%\n- ${"Led a very long and detailed initiative that spanned many teams and departments across the company for over a year and a half ".repeat(2)}`;
    const result = extractLikelyAchievement(cv);
    // Both candidates are filtered out by length bounds, so nothing should be detected.
    expect(result.detected).toBe(false);
  });
});
