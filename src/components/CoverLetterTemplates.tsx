import { useState } from "react";
import {
  COVER_LETTER_TEMPLATES,
  COVER_LETTER_STRUCTURE_GUIDE,
  type CoverLetterTemplate,
} from "../data/coverLetterTemplates";
import { Badge } from "./Badge";
import { CoverLetterGenerateFromData } from "./CoverLetterGenerateFromData";

interface CoverLetterTemplatesProps {
  onUseTemplate: (body: string) => void;
}

const CATEGORY_LABELS: Record<CoverLetterTemplate["category"], string> = {
  general: "Umum",
  "position-specific": "Posisi tertentu",
  "format-specific": "Format tertentu",
  "experience-level": "Level pengalaman",
};

const CATEGORY_ORDER: CoverLetterTemplate["category"][] = [
  "general",
  "position-specific",
  "experience-level",
  "format-specific",
];

export function CoverLetterTemplates({ onUseTemplate }: CoverLetterTemplatesProps) {
  const [activeCategory, setActiveCategory] = useState<CoverLetterTemplate["category"] | "all">("all");
  const [selected, setSelected] = useState<CoverLetterTemplate | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [generateMode, setGenerateMode] = useState(false);

  const visibleTemplates =
    activeCategory === "all"
      ? COVER_LETTER_TEMPLATES
      : COVER_LETTER_TEMPLATES.filter((t) => t.category === activeCategory);

  if (selected && generateMode) {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setGenerateMode(false)}
          className="text-sm font-medium text-blueprint-600 hover:underline"
        >
          ← Kembali ke pratinjau template
        </button>
        <CoverLetterGenerateFromData
          template={selected}
          onGenerated={(letter) => {
            onUseTemplate(letter);
            setGenerateMode(false);
            setSelected(null);
          }}
        />
      </div>
    );
  }

  if (selected) {
    return (
      <div className="card">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mb-4 text-sm font-medium text-blueprint-600 hover:underline"
        >
          ← Kembali ke daftar template
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">{selected.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{selected.useCase}</p>
          </div>
          <Badge tone="blueprint">{selected.language === "en" ? "English" : "Bahasa Indonesia"}</Badge>
        </div>

        {selected.tips.length > 0 && (
          <div className="mt-4 rounded-md bg-blueprint-50 p-3">
            <p className="text-xs font-semibold text-blueprint-600">Tips untuk template ini:</p>
            <ul className="mt-1.5 list-inside list-disc space-y-1 text-xs text-blueprint-600">
              {selected.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <pre className="mt-4 whitespace-pre-wrap rounded-md border border-surface-border bg-surface-muted p-4 font-body text-sm text-ink">
          {selected.body}
        </pre>

        <p className="mt-3 text-xs text-ink-soft">
          Ini adalah contoh, bukan template untuk disalin mentah-mentah — ganti nama, perusahaan, dan detail
          pengalaman dengan milikmu sendiri sebelum dikirim.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => onUseTemplate(selected.body)} className="btn-secondary">
            Gunakan sebagai draf awal
          </button>
          <button type="button" onClick={() => setGenerateMode(true)} className="btn-primary">
            Generate dari CV & lowongan
          </button>
          <button type="button" onClick={() => setSelected(null)} className="btn-secondary">
            Pilih template lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <button
          type="button"
          onClick={() => setShowGuide((prev) => !prev)}
          className="flex w-full items-center justify-between text-left"
          aria-expanded={showGuide}
        >
          <p className="font-semibold text-ink">Struktur surat lamaran yang baik</p>
          <span className="text-sm font-medium text-blueprint-600">{showGuide ? "Tutup" : "Lihat panduan"}</span>
        </button>

        {showGuide && (
          <ol className="mt-4 flex flex-col gap-4">
            {COVER_LETTER_STRUCTURE_GUIDE.map((step) => (
              <li key={step.step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blueprint-50 text-xs font-bold text-blueprint-600">
                  {step.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{step.description}</p>
                  <p className="mt-1 whitespace-pre-wrap rounded bg-surface-muted px-2 py-1 font-mono text-xs text-ink-soft">
                    {step.example}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === "all"
              ? "border-blueprint-500 bg-blueprint-50 text-blueprint-600"
              : "border-surface-border text-ink-soft hover:border-blueprint-400"
          }`}
        >
          Semua ({COVER_LETTER_TEMPLATES.length})
        </button>
        {CATEGORY_ORDER.map((category) => {
          const count = COVER_LETTER_TEMPLATES.filter((t) => t.category === category).length;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === category
                  ? "border-blueprint-500 bg-blueprint-50 text-blueprint-600"
                  : "border-surface-border text-ink-soft hover:border-blueprint-400"
              }`}
            >
              {CATEGORY_LABELS[category]} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {visibleTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => setSelected(template)}
            className="card flex flex-col items-start gap-1.5 text-left transition-shadow hover:shadow-md"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <p className="font-semibold text-ink">{template.title}</p>
              <Badge tone="neutral">{template.language === "en" ? "EN" : "ID"}</Badge>
            </div>
            <p className="text-sm text-ink-soft">{template.useCase}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
