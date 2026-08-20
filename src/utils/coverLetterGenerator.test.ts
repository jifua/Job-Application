import { describe, it, expect } from "vitest";
import { generateCoverLetter, parseSkillsInput } from "./coverLetterGenerator";
import type { CoverLetterInput } from "../types/coverLetter";

const BASE_INPUT: CoverLetterInput = {
  fullName: "Jane Doe",
  position: "Junior Data Analyst",
  company: "Acme Analytics",
  hiringManager: "",
  keySkillsRaw: "Python, SQL, Excel",
  achievement: "",
  whyCompany: "",
  tone: "formal",
};

describe("generateCoverLetter", () => {
  it("includes the applicant's name, position, and company", () => {
    const letter = generateCoverLetter(BASE_INPUT);
    expect(letter).toContain("Jane Doe");
    expect(letter).toContain("Junior Data Analyst");
    expect(letter).toContain("Acme Analytics");
  });

  it("defaults to 'Dear Hiring Manager,' when no hiring manager name is given (formal tone)", () => {
    const letter = generateCoverLetter(BASE_INPUT);
    expect(letter).toContain("Dear Hiring Manager,");
  });

  it("greets the named hiring manager when one is provided", () => {
    const letter = generateCoverLetter({ ...BASE_INPUT, hiringManager: "Mr. Tan" });
    expect(letter).toContain("Dear Mr. Tan,");
  });

  it("uses a friendlier greeting and sign-off for the 'friendly' tone", () => {
    const letter = generateCoverLetter({ ...BASE_INPUT, tone: "friendly" });
    expect(letter).toContain("Hi there,");
    expect(letter).toContain("Best,");
  });

  it("still produces a complete, sensible letter with only the required fields filled in", () => {
    const minimal: CoverLetterInput = {
      fullName: "John Smith",
      position: "Marketing Intern",
      company: "Contoh Corp",
      hiringManager: "",
      keySkillsRaw: "",
      achievement: "",
      whyCompany: "",
      tone: "formal",
    };
    const letter = generateCoverLetter(minimal);

    expect(letter).toContain("John Smith");
    expect(letter).toContain("Marketing Intern");
    expect(letter).toContain("Contoh Corp");
    expect(letter).not.toContain("undefined");
    expect(letter).not.toContain("null");
  });

  it("produces a different opening sentence for a different variantIndex, without changing the facts", () => {
    const first = generateCoverLetter(BASE_INPUT, 0);
    const second = generateCoverLetter(BASE_INPUT, 1);

    expect(first).not.toBe(second);
    // Still the same applicant/role/company regardless of wording variant.
    for (const letter of [first, second]) {
      expect(letter).toContain("Jane Doe");
      expect(letter).toContain("Acme Analytics");
    }
  });
});

describe("parseSkillsInput", () => {
  it("splits on commas and trims whitespace", () => {
    expect(parseSkillsInput("Python,  SQL ,Excel")).toEqual(["Python", "SQL", "Excel"]);
  });

  it("drops empty entries", () => {
    expect(parseSkillsInput("Python,, SQL,")).toEqual(["Python", "SQL"]);
  });

  it("de-duplicates case-insensitively", () => {
    expect(parseSkillsInput("Python, python, PYTHON")).toEqual(["Python"]);
  });

  it("caps the list at 8 skills", () => {
    const many = Array.from({ length: 12 }, (_, i) => `Skill${i}`).join(", ");
    expect(parseSkillsInput(many)).toHaveLength(8);
  });
});
