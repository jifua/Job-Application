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

  it("generates a customized letter from pasted job + CV text, using matched skills and extracted name", () => {
    render(<CoverLetter />);
    fireEvent.click(screen.getByRole("button", { name: "Template & Panduan" }));

    const target = COVER_LETTER_TEMPLATES.find((t) => t.id === "it-tech")!;
    fireEvent.click(screen.getByText(target.title));
    fireEvent.click(screen.getByRole("button", { name: "Generate dari CV & lowongan" }));

    fireEvent.change(screen.getByLabelText("Info lowongan / kualifikasi job"), {
      target: {
        value: "Backend Developer\nPT Teknologi Maju\n\nRequirements:\n- Proficient in Python and SQL",
      },
    });
    fireEvent.change(screen.getByLabelText("CV / data diri"), {
      target: { value: "Nama: Rangga Saputra\n\nSkills: Python, SQL, Docker" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Analisis & tinjau data" }));

    // Review screen should be pre-filled from the extraction.
    const nameInput = screen.getByLabelText(/Nama lengkap/) as HTMLInputElement;
    const positionInput = screen.getByLabelText(/Posisi/) as HTMLInputElement;
    const companyInput = screen.getByLabelText(/Perusahaan/) as HTMLInputElement;
    expect(nameInput.value).toBe("Rangga Saputra");
    expect(positionInput.value).toBe("Backend Developer");
    expect(companyInput.value).toBe("PT Teknologi Maju");

    fireEvent.click(screen.getByRole("button", { name: "Generate" }));

    // Should land back on the build tab with the generated letter in the editable draft.
    const draftTextarea = screen.getByLabelText(/Generated cover letter draft, editable/i) as HTMLTextAreaElement;
    expect(draftTextarea.value).toContain("Rangga Saputra");
    expect(draftTextarea.value).toContain("PT Teknologi Maju");
    expect(draftTextarea.value).toContain("Python");
  });

  it("shows all four download options once a draft exists", () => {
    render(<CoverLetter />);
    fireEvent.click(screen.getByRole("button", { name: "Template & Panduan" }));
    fireEvent.click(screen.getByText(COVER_LETTER_TEMPLATES[0].title));
    fireEvent.click(screen.getByRole("button", { name: "Gunakan sebagai draf awal" }));

    expect(screen.getByRole("button", { name: "Download .docx" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download .pdf" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download .png" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download .txt" })).toBeInTheDocument();
  });
});
