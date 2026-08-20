import { describe, it, expect } from "vitest";
import { extractSkills } from "./skillExtractor";

describe("extractSkills", () => {
  it("finds skills mentioned in plain text", () => {
    const result = extractSkills("We need someone skilled in Python and SQL.");
    expect(result).toContain("Python");
    expect(result).toContain("SQL");
  });

  it("is case-insensitive", () => {
    const result = extractSkills("PYTHON, sql, ExCeL");
    expect(result).toEqual(expect.arrayContaining(["Python", "SQL", "Excel"]));
  });

  it("matches common aliases, not just the canonical label", () => {
    const result = extractSkills("Experience with JS and reactjs required.");
    expect(result).toContain("JavaScript");
    expect(result).toContain("React");
  });

  it("does not match a skill that only appears as a substring of another word", () => {
    // "js" should not match inside "jsonify" or similar — alias matching is whole-word.
    const result = extractSkills("We use a jsonify-based internal tool.");
    expect(result).not.toContain("JavaScript");
  });

  it("returns an empty array when no known skills are present", () => {
    expect(extractSkills("We are a friendly team looking for a great culture fit.")).toEqual([]);
  });

  it("does not return duplicate entries for a skill mentioned multiple times", () => {
    const result = extractSkills("Python developer. Must know Python well. Python, Python!");
    const pythonCount = result.filter((skill) => skill === "Python").length;
    expect(pythonCount).toBe(1);
  });
});
