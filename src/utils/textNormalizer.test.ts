import { describe, it, expect } from "vitest";
import { normalizeText, splitLines, isBulletLine, stripBulletMarker } from "./textNormalizer";

describe("normalizeText", () => {
  it("lowercases text", () => {
    expect(normalizeText("Python SQL")).toBe("python sql");
  });

  it("strips punctuation", () => {
    expect(normalizeText("Python, SQL, Excel!")).toBe("python sql excel");
  });

  it("collapses repeated whitespace", () => {
    expect(normalizeText("Python    SQL\t\tExcel")).toBe("python sql excel");
  });

  it("trims leading and trailing whitespace", () => {
    expect(normalizeText("  Python  ")).toBe("python");
  });

  it("handles empty input", () => {
    expect(normalizeText("")).toBe("");
  });
});

describe("splitLines", () => {
  it("splits on newlines and drops empty lines", () => {
    expect(splitLines("line one\n\nline two\n   \nline three")).toEqual([
      "line one",
      "line two",
      "line three",
    ]);
  });

  it("trims whitespace from each line", () => {
    expect(splitLines("  padded line  \nanother")).toEqual(["padded line", "another"]);
  });
});

describe("isBulletLine / stripBulletMarker", () => {
  it("recognizes dash, dot, and asterisk bullets", () => {
    expect(isBulletLine("- item")).toBe(true);
    expect(isBulletLine("• item")).toBe(true);
    expect(isBulletLine("* item")).toBe(true);
    expect(isBulletLine("1. item")).toBe(true);
    expect(isBulletLine("2) item")).toBe(true);
  });

  it("does not treat a plain sentence as a bullet", () => {
    expect(isBulletLine("This is a normal sentence.")).toBe(false);
  });

  it("strips the bullet marker but keeps the content", () => {
    expect(stripBulletMarker("- Build dashboards")).toBe("Build dashboards");
    expect(stripBulletMarker("1. Build dashboards")).toBe("Build dashboards");
  });
});
