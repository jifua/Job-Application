import { describe, it, expect } from "vitest";
import { calculateMatchScore } from "./scoreCalculator";

describe("calculateMatchScore", () => {
  it("computes matched/required * 100, rounded", () => {
    // 4 of 6 required skills matched, per the spec's worked example.
    expect(calculateMatchScore(4, 6)).toBe(67);
  });

  it("returns 100 when every required skill is matched", () => {
    expect(calculateMatchScore(3, 3)).toBe(100);
  });

  it("returns 0 when no required skills are matched", () => {
    expect(calculateMatchScore(0, 5)).toBe(0);
  });

  it("returns 0 (not NaN or Infinity) when there are no required skills", () => {
    expect(calculateMatchScore(0, 0)).toBe(0);
  });

  it("never exceeds 100 even with unexpected input", () => {
    expect(calculateMatchScore(10, 5)).toBe(100);
  });

  it("never goes below 0 even with unexpected input", () => {
    expect(calculateMatchScore(-2, 5)).toBe(0);
  });
});
