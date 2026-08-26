import { describe, it, expect } from "vitest";
import { analyzeJobDescription } from "./jobAnalyzer";

const STRUCTURED_JD = `Job Title: Junior Data Analyst
Company: Contoh Teknologi Indonesia
Location: Jakarta (Hybrid)

Responsibilities:
- Collect and clean data from multiple internal sources
- Build dashboards and reports using Power BI and Tableau

Requirements:
- Bachelor's degree in a related field
- 0-2 years of experience
- Proficient in Python, SQL, and Excel

Please send your CV and portfolio. Application deadline: 30 September 2026.`;

describe("analyzeJobDescription — labeled fields", () => {
  it("detects labeled position, company, and location", () => {
    const result = analyzeJobDescription(STRUCTURED_JD);
    expect(result.position).toEqual({ value: "Junior Data Analyst", detected: true });
    expect(result.company).toEqual({ value: "Contoh Teknologi Indonesia", detected: true });
    expect(result.location.detected).toBe(true);
  });

  it("honestly reports 'not detected' fields instead of guessing", () => {
    const result = analyzeJobDescription(
      "We are hiring! Join our team. Must know social media marketing and content writing."
    );
    expect(result.position.detected).toBe(false);
    expect(result.company.detected).toBe(false);
  });
});

describe("analyzeJobDescription — unlabeled postings (JobStreet-style)", () => {
  it("detects position and company from bare lines when no explicit labels are present", () => {
    const jobstreetLike = `Digital Marketing Specialist
PT Sukses Maju Mandala
Jakarta Selatan, Indonesia
IDR 6,000,000 – IDR 8,000,000 per month
Quick Apply

Job Description
We are looking for a Digital Marketing Specialist to join our growing team.

Requirements
- Bachelor degree in Marketing or related field
- 2+ years of experience in digital marketing`;

    const result = analyzeJobDescription(jobstreetLike);
    expect(result.position).toEqual({ value: "Digital Marketing Specialist", detected: true });
    expect(result.company).toEqual({ value: "PT Sukses Maju Mandala", detected: true });
    expect(result.checks.salaryDisclosed).toBe(true);
  });

  it("falls back to the line after the title when there's no PT/CV prefix", () => {
    const noPrefix = `Frontend Developer
Acme Digital Studio
Bandung, Indonesia`;
    const result = analyzeJobDescription(noPrefix);
    expect(result.position.detected).toBe(true);
    expect(result.company).toEqual({ value: "Acme Digital Studio", detected: true });
  });

  it("does not let the fallback override an explicitly labeled posting", () => {
    const labeled = `Job Title: Junior Data Analyst
Company: Contoh Teknologi Indonesia
Location: Jakarta`;
    const result = analyzeJobDescription(labeled);
    expect(result.position).toEqual({ value: "Junior Data Analyst", detected: true });
    expect(result.company).toEqual({ value: "Contoh Teknologi Indonesia", detected: true });
  });
});

describe("analyzeJobDescription — section extraction", () => {
  it("does not let a trailing non-bullet sentence leak into the requirements list", () => {
    // Regression test: a bug previously let "Please send your CV..." get
    // appended to the requirements bullet list because it followed the
    // last bullet with no other section header after it.
    const result = analyzeJobDescription(STRUCTURED_JD);
    const leaked = result.requirements.some((item) => item.toLowerCase().includes("please send"));
    expect(leaked).toBe(false);
  });

  it("stops the responsibilities section at the requirements header", () => {
    const result = analyzeJobDescription(STRUCTURED_JD);
    const leaked = result.responsibilities.some((item) => item.toLowerCase().includes("bachelor"));
    expect(leaked).toBe(false);
  });

  it("extracts the expected requirement bullets", () => {
    const result = analyzeJobDescription(STRUCTURED_JD);
    expect(result.requirements).toEqual(
      expect.arrayContaining([
        "Bachelor's degree in a related field",
        "0-2 years of experience",
        "Proficient in Python, SQL, and Excel",
      ])
    );
  });
});

describe("analyzeJobDescription — education", () => {
  it("captures the full education requirement line, not just the matched keyword", () => {
    const text = [
      "IT Support",
      "PT Contoh Sejahtera",
      "Jakarta",
      "",
      "Requirements:",
      "Pendidikan minimal D3 Teknik Informatika / Sistem Informasi / Teknik Komputer, atau SMK TKJ dengan pengalaman relevan.",
      "Pengalaman minimal 1 tahun di bidang IT support.",
    ].join("\n");

    const result = analyzeJobDescription(text);
    expect(result.education.detected).toBe(true);
    expect(result.education.value).toBe(
      "Pendidikan minimal D3 Teknik Informatika / Sistem Informasi / Teknik Komputer, atau SMK TKJ dengan pengalaman relevan."
    );
  });
});

describe("analyzeJobDescription — things to check", () => {
  it("flags a mentioned deadline and required documents", () => {
    const result = analyzeJobDescription(STRUCTURED_JD);
    expect(result.checks.deadlineStated).toBe(true);
    expect(result.checks.requiredDocuments).toEqual(expect.arrayContaining(["CV", "Portfolio"]));
  });

  it("flags salary as not disclosed when no salary information is present", () => {
    const result = analyzeJobDescription(STRUCTURED_JD);
    expect(result.checks.salaryDisclosed).toBe(false);
  });
});
