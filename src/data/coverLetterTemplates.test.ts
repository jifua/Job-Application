import { describe, it, expect } from "vitest";
import { COVER_LETTER_TEMPLATES, COVER_LETTER_STRUCTURE_GUIDE } from "./coverLetterTemplates";

describe("COVER_LETTER_TEMPLATES", () => {
  it("has unique, non-empty ids", () => {
    const ids = COVER_LETTER_TEMPLATES.map((t) => t.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every template has a title, use case, tips, and a substantial body", () => {
    for (const template of COVER_LETTER_TEMPLATES) {
      expect(template.title.length).toBeGreaterThan(0);
      expect(template.useCase.length).toBeGreaterThan(10);
      expect(template.tips.length).toBeGreaterThan(0);
      // A real letter, not a stub — guards against accidentally shipping a placeholder.
      expect(template.body.length).toBeGreaterThan(300);
    }
  });

  it("every template's body ends with a name (no dangling placeholder like '[Nama]')", () => {
    for (const template of COVER_LETTER_TEMPLATES) {
      expect(template.body).not.toMatch(/\[Nama[^\]]*\]/i);
      expect(template.body).not.toMatch(/\[Name[^\]]*\]/i);
    }
  });

  it("includes at least one template in each category", () => {
    const categories = new Set(COVER_LETTER_TEMPLATES.map((t) => t.category));
    expect(categories.has("general")).toBe(true);
    expect(categories.has("position-specific")).toBe(true);
    expect(categories.has("format-specific")).toBe(true);
    expect(categories.has("experience-level")).toBe(true);
  });

  it("includes at least one English template", () => {
    expect(COVER_LETTER_TEMPLATES.some((t) => t.language === "en")).toBe(true);
  });
});

describe("COVER_LETTER_STRUCTURE_GUIDE", () => {
  it("has 8 sequential steps starting at 1", () => {
    expect(COVER_LETTER_STRUCTURE_GUIDE).toHaveLength(8);
    COVER_LETTER_STRUCTURE_GUIDE.forEach((step, index) => {
      expect(step.step).toBe(index + 1);
    });
  });

  it("every step has a title, description, and example", () => {
    for (const step of COVER_LETTER_STRUCTURE_GUIDE) {
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.description.length).toBeGreaterThan(10);
      expect(step.example.length).toBeGreaterThan(0);
    }
  });
});
