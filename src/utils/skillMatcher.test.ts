import { describe, it, expect } from "vitest";
import { matchCvToJob } from "./skillMatcher";

describe("matchCvToJob", () => {
  it("reproduces the spec's worked example", () => {
    const jd = "Python, SQL, Excel, Power BI, Tableau, data visualization";
    const cv = "Python, SQL, Excel, Power BI";

    const result = matchCvToJob(cv, jd);

    expect(result.requiredSkills).toEqual(
      expect.arrayContaining(["Python", "SQL", "Excel", "Power BI", "Tableau", "Data Visualization"])
    );
    expect(result.matchedSkills).toEqual(expect.arrayContaining(["Python", "SQL", "Excel", "Power BI"]));
    expect(result.missingSkills).toEqual(expect.arrayContaining(["Tableau", "Data Visualization"]));
    expect(result.matchScore).toBe(67);
  });

  it("lists CV skills the job didn't ask for as additionalCvSkills", () => {
    const result = matchCvToJob(
      "I know Python, SQL, Figma, and have strong leadership skills.",
      "We need someone skilled in Python and SQL for this data role."
    );

    expect(result.matchedSkills).toEqual(expect.arrayContaining(["Python", "SQL"]));
    expect(result.additionalCvSkills).toEqual(expect.arrayContaining(["Figma", "Leadership"]));
    expect(result.matchScore).toBe(100);
  });

  it("does not divide by zero when the job description has no detectable skills", () => {
    const result = matchCvToJob("Python developer", "General assistant role, no specific tools required.");

    expect(result.requiredSkills).toEqual([]);
    expect(result.matchScore).toBe(0);
    expect(Number.isNaN(result.matchScore)).toBe(false);
  });
});
