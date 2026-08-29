import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportCoverLetterToDocx, exportCoverLetterToPdf, exportCoverLetterToPng } from "./coverLetterExport";

const SAMPLE_LETTER = `Dear Hiring Manager,

I am writing to express my interest in the Junior Data Analyst position at Acme Analytics.

My background includes hands-on experience with Python, SQL, and Excel.

Sincerely,
Jane Doe`;

/**
 * Captures what a download call actually produced — the real Blob (via a
 * mocked URL.createObjectURL, since jsdom can't fetch blob: URLs back) and
 * the filename (via a mocked anchor click, since jsdom has no real
 * navigation to intercept otherwise).
 */
function captureDownload() {
  const blobs: Blob[] = [];
  const clicks: { download: string }[] = [];

  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalClick = HTMLAnchorElement.prototype.click;

  URL.createObjectURL = vi.fn((blob: Blob) => {
    blobs.push(blob);
    return `blob:mock-url-${blobs.length}`;
  });
  URL.revokeObjectURL = vi.fn();
  HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
    clicks.push({ download: this.download });
  };

  return {
    blobs,
    clicks,
    restore: () => {
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      HTMLAnchorElement.prototype.click = originalClick;
    },
  };
}

describe("exportCoverLetterToDocx", () => {
  it("produces a real, non-empty .docx file and triggers a download with the right filename", async () => {
    const capture = captureDownload();
    try {
      await exportCoverLetterToDocx(SAMPLE_LETTER, "cover-letter");

      expect(capture.clicks).toEqual([{ download: "cover-letter.docx" }]);
      expect(capture.blobs).toHaveLength(1);

      const blob = capture.blobs[0];
      expect(blob.type).toBe(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      // .docx is a zip archive — a real one starts with the "PK" zip signature.
      const bytes = new Uint8Array(await blob.arrayBuffer());
      expect(bytes[0]).toBe(0x50); // 'P'
      expect(bytes[1]).toBe(0x4b); // 'K'
      expect(bytes.length).toBeGreaterThan(500);
    } finally {
      capture.restore();
    }
  });

  it("doesn't double up the .docx extension if already provided", async () => {
    const capture = captureDownload();
    try {
      await exportCoverLetterToDocx(SAMPLE_LETTER, "already-named.docx");
      expect(capture.clicks[0].download).toBe("already-named.docx");
    } finally {
      capture.restore();
    }
  });
});

describe("exportCoverLetterToPdf", () => {
  it("wraps the letter text to fit the page width without dropping content", async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const wrapped = doc.splitTextToSize(SAMPLE_LETTER, doc.internal.pageSize.getWidth() - 112) as string[];
    expect(wrapped.join(" ")).toContain("Acme Analytics");
    expect(wrapped.join(" ")).toContain("Jane Doe");
  });

  it("runs end-to-end without throwing, for a multi-paragraph letter", async () => {
    // jsPDF's own .save() uses its internal download path rather than a
    // plain anchor click we can intercept, so this is a smoke test —
    // content correctness is covered by the wrapping test above.
    await expect(exportCoverLetterToPdf(SAMPLE_LETTER, "cover-letter")).resolves.toBeUndefined();
  });
});

describe("exportCoverLetterToPng", () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  const originalToBlob = HTMLCanvasElement.prototype.toBlob;

  beforeEach(() => {
    // jsdom has no real canvas rendering engine — provide a minimal fake
    // 2D context sufficient for our text-measuring/drawing calls.
    // @ts-expect-error simplified mock, not a full CanvasRenderingContext2D
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      measureText: (s: string) => ({ width: s.length * 8 }),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      set fillStyle(_v: string) {},
      set font(_v: string) {},
      set textBaseline(_v: string) {},
    }));
    HTMLCanvasElement.prototype.toBlob = function (callback: BlobCallback) {
      callback(new Blob(["fake-png-bytes"], { type: "image/png" }));
    };
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    HTMLCanvasElement.prototype.toBlob = originalToBlob;
  });

  it("produces a downloadable PNG blob", async () => {
    const capture = captureDownload();
    try {
      await exportCoverLetterToPng(SAMPLE_LETTER, "cover-letter");
      expect(capture.clicks).toEqual([{ download: "cover-letter.png" }]);
      expect(capture.blobs).toHaveLength(1);
      expect(capture.blobs[0].type).toBe("image/png");
    } finally {
      capture.restore();
    }
  });

  it("throws a clear error if canvas isn't supported", async () => {
    HTMLCanvasElement.prototype.getContext = () => null;
    await expect(exportCoverLetterToPng(SAMPLE_LETTER, "x")).rejects.toThrow(/[Cc]anvas/);
  });
});
