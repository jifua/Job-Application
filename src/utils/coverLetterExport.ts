/**
 * Splits letter text into paragraphs on blank lines, preserving single
 * line breaks *within* a paragraph (e.g. a multi-line signature block).
 */
function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n{2,}/).map((p) => p.trim());
}

/** Triggers a browser download for a Blob without leaving the object URL dangling. */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Exports the letter as a .docx file — one Word paragraph per blank-line
 * section, with single line breaks inside a section preserved. Uses the
 * `docx` library, dynamically imported so it's only downloaded when this
 * export is actually used.
 */
export async function exportCoverLetterToDocx(text: string, filename: string): Promise<void> {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const sections = splitIntoParagraphs(text).map((block) => {
    const lines = block.split("\n");
    const children = lines.flatMap((line, i) =>
      i === 0 ? [new TextRun(line)] : [new TextRun({ text: line, break: 1 })]
    );
    return new Paragraph({ children, spacing: { after: 200 } });
  });

  const doc = new Document({
    sections: [{ children: sections }],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, filename.endsWith(".docx") ? filename : `${filename}.docx`);
}

/**
 * Exports the letter as a single-page-flowing .pdf using jsPDF's built-in
 * text wrapping. Dynamically imported for the same reason as the docx export.
 */
export async function exportCoverLetterToPdf(text: string, filename: string): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 56; // ~0.78in
  const marginTop = 64;
  const lineHeight = 16;
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = doc.internal.pageSize.getWidth() - marginX * 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const wrappedLines = doc.splitTextToSize(text, usableWidth) as string[];

  let y = marginTop;
  for (const line of wrappedLines) {
    if (y > pageHeight - marginTop) {
      doc.addPage();
      y = marginTop;
    }
    doc.text(line, marginX, y);
    y += lineHeight;
  }

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

/**
 * Exports the letter as a .png image: wraps text onto an off-screen
 * canvas sized to fit the content, then downloads the canvas as PNG. No
 * extra library needed — canvas is a browser built-in.
 */
export async function exportCoverLetterToPng(text: string, filename: string): Promise<void> {
  const width = 1000;
  const paddingX = 60;
  const paddingY = 60;
  const fontSize = 20;
  const lineHeight = fontSize * 15 / 10; // 30px

  // Measure first using a throwaway canvas, so we can size the real one to fit.
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) throw new Error("Canvas is not supported in this browser.");
  measureCtx.font = `${fontSize}px Arial, sans-serif`;

  const maxTextWidth = width - paddingX * 2;
  const rawLines = text.split("\n");
  const wrappedLines: string[] = [];
  for (const rawLine of rawLines) {
    if (rawLine === "") {
      wrappedLines.push("");
      continue;
    }
    let current = "";
    for (const word of rawLine.split(" ")) {
      const candidate = current ? `${current} ${word}` : word;
      if (measureCtx.measureText(candidate).width > maxTextWidth && current) {
        wrappedLines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    wrappedLines.push(current);
  }

  const height = paddingY * 2 + wrappedLines.length * lineHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.textBaseline = "top";

  wrappedLines.forEach((line, i) => {
    ctx.fillText(line, paddingX, paddingY + i * lineHeight);
  });

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to render image."))), "image/png");
  });

  downloadBlob(blob, filename.endsWith(".png") ? filename : `${filename}.png`);
}
