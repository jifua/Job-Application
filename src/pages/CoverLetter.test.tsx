import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { CoverLetter } from "./CoverLetter";
import { COVER_LETTER_TEMPLATES } from "../data/coverLetterTemplates";

afterEach(() => cleanup());

describe("CoverLetter — Templates & Guide tab", () => {
  it("switches to the templates tab and lists every template", () => {
    render(<CoverLetter />);
    fireEvent.click(screen.getByRole("button", { name: "Template & Panduan" }));

    for (const template of COVER_LETTER_TEMPLATES) {
      expect(screen.getByText(template.title)).toBeInTheDocument();
    }
  });

  it("opens a template preview and loads it into the editable draft on the build tab", () => {
    render(<CoverLetter />);
    fireEvent.click(screen.getByRole("button", { name: "Template & Panduan" }));

    const target = COVER_LETTER_TEMPLATES.find((t) => t.id === "formal-general")!;
    fireEvent.click(screen.getByText(target.title));

    // Preview shows the full body.
    expect(screen.getByText(/Gunakan sebagai draf awal/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Gunakan sebagai draf awal" }));

    // Should jump back to the build tab with the template body in the editable textarea.
    const textarea = screen.getByLabelText(/Generated cover letter draft, editable/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe(target.body);
  });

  it("filters templates by category", () => {
    render(<CoverLetter />);
    fireEvent.click(screen.getByRole("button", { name: "Template & Panduan" }));

    const englishCount = COVER_LETTER_TEMPLATES.filter((t) => t.category === "general").length;
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^Umum \\(${englishCount}\\)$`) }));

    const generalTemplates = COVER_LETTER_TEMPLATES.filter((t) => t.category === "general");
    const otherTemplates = COVER_LETTER_TEMPLATES.filter((t) => t.category !== "general");

    for (const template of generalTemplates) {
      expect(screen.getByText(template.title)).toBeInTheDocument();
    }
    for (const template of otherTemplates) {
      expect(screen.queryByText(template.title)).not.toBeInTheDocument();
    }
  });

  it("expands the structure guide to show all 8 steps", () => {
    render(<CoverLetter />);
    fireEvent.click(screen.getByRole("button", { name: "Template & Panduan" }));
    fireEvent.click(screen.getByRole("button", { name: /Lihat panduan/ }));

    expect(screen.getByText("Tempat dan tanggal")).toBeInTheDocument();
    expect(screen.getByText("Tanda tangan")).toBeInTheDocument();
  });
});
