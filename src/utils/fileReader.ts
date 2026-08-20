import type { OcrProgress } from "./ocrReader";

const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — generous for a CV/PDF
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB — screenshots run larger than text PDFs
const MAX_IMAGES_PER_UPLOAD = 6; // keeps OCR time reasonable on a low-spec laptop

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function isPlainText(file: File): boolean {
  return file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt");
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name);
}

/**
 * Reads a single File into plain text — supports PDF, TXT, and images
 * (via OCR). Throws an Error with a human-readable message on failure;
 * callers should catch it and show `error.message` directly.
 */
export async function extractTextFromFile(
  file: File,
  onOcrProgress?: (progress: OcrProgress) => void
): Promise<string> {
  if (isImage(file)) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error("This image is too large. Please upload a screenshot under 10MB.");
    }
    let text: string;
    try {
      const { extractTextFromImage } = await import("./ocrReader");
      text = await extractTextFromImage(file, onOcrProgress);
    } catch {
      throw new Error(
        "We couldn't process that image. Try a clearer screenshot, or paste the text instead."
      );
    }
    if (!text.trim()) {
      throw new Error(
        "We couldn't read any text from that image. Try a clearer or higher-resolution screenshot, or paste the text instead."
      );
    }
    return text;
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    throw new Error("This file is too large. Please upload a file under 5MB.");
  }

  if (isPdf(file)) {
    let text: string;
    try {
      const { extractTextFromPdf } = await import("./pdfReader");
      text = await extractTextFromPdf(file);
    } catch {
      throw new Error(
        "We couldn't read that PDF. Please try a different file or paste the text instead."
      );
    }
    if (!text.trim()) {
      throw new Error(
        "We couldn't find any text in that PDF. It may be a scanned image — please paste the text instead."
      );
    }
    return text;
  }

  if (isPlainText(file)) {
    try {
      return await file.text();
    } catch {
      throw new Error("We couldn't read that file. Please try pasting the text instead.");
    }
  }

  throw new Error("Unsupported file type. Please upload a PDF, TXT, or image (screenshot) file.");
}

/**
 * Reads multiple files (PDF/TXT/images, in any combination) and joins
 * their extracted text with blank lines — useful for a job posting or
 * CV captured across several screenshots. Silently caps the number of
 * files processed to keep OCR time reasonable; the caller can inspect
 * `skippedCount` to inform the user.
 */
export async function extractTextFromFiles(
  files: File[],
  onProgress?: (current: number, total: number, message: string) => void
): Promise<{ text: string; skippedCount: number }> {
  const limited = files.slice(0, MAX_IMAGES_PER_UPLOAD);
  const skippedCount = files.length - limited.length;

  const parts: string[] = [];
  for (let i = 0; i < limited.length; i++) {
    const file = limited[i];
    onProgress?.(i + 1, limited.length, `Reading ${file.name}…`);
    const text = await extractTextFromFile(file, (ocr) => {
      onProgress?.(i + 1, limited.length, `Reading ${file.name}: ${ocr.status} (${Math.round(ocr.progress * 100)}%)`);
    });
    parts.push(text);
  }

  return { text: parts.join("\n\n"), skippedCount };
}
