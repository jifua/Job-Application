import { describe, it, expect } from "vitest";
import { generateTailoredCv } from "./cvTailor";

describe("generateTailoredCv", () => {
  it("puts matched skills before additional skills in the Key Skills section", () => {
    const draft = generateTailoredCv({
      cvText: "Jane Doe\nExperience:\n- Did some data work",
      targetPosition: "Junior Data Analyst",
      matchedSkills: ["Python", "SQL"],
      missingSkills: ["Tableau"],
      additionalCvSkills: ["Figma"],
    });

    const lines = draft.split("\n");
    const skillsHeaderIndex = lines.indexOf("KEY SKILLS");
    expect(skillsHeaderIndex).toBeGreaterThan(-1);
    // The next non-empty line after the header is the skills list itself.
    const skillsLine = lines.slice(skillsHeaderIndex + 1).find((line) => line.trim().length > 0);
    expect(skillsLine).toBe("Python, SQL, Figma");
  });

  it("includes the original CV content unmodified", () => {
    const originalCv = "Jane Doe\nExperience:\n- Built dashboards using Power BI";
    const draft = generateTailoredCv({
      cvText: originalCv,
      targetPosition: "Data Analyst",
      matchedSkills: ["Power BI"],
      missingSkills: [],
      additionalCvSkills: [],
    });

    expect(draft).toContain(originalCv);
  });

  it("still produces a sensible draft when no skills matched at all", () => {
    const draft = generateTailoredCv({
      cvText: "John Smith\nSome CV content",
      targetPosition: "",
      matchedSkills: [],
      missingSkills: [],
      additionalCvSkills: ["Communication"],
    });

    expect(draft).not.toContain("undefined");
    expect(draft).toContain("Communication");
  });

  it("mentions the target position in the summary when one is known", () => {
    const draft = generateTailoredCv({
      cvText: "CV text",
      targetPosition: "Frontend Developer",
      matchedSkills: ["React"],
      missingSkills: [],
      additionalCvSkills: [],
    });
    expect(draft).toContain("Frontend Developer candidate");
  });
});
