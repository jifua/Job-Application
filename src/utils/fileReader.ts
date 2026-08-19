const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — generous for a CV, keeps parsing fast

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function isPlainText(file: File): boolean {
  return file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt");
}

/**
 * Reads a File into plain text, supporting PDF and TXT.
 * Throws an Error with a human-readable message on failure —
 * callers should catch it and show `error.message` directly.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("This file is too large. Please upload a CV under 5MB.");
  }

  if (isPdf(file)) {
    let text: string;
    try {
      const { extractTextFromPdf } = await import("./pdfReader");
      text = await extractTextFromPdf(file);
    } catch {
      throw new Error(
        "We couldn't read that PDF. Please try a different file or paste your CV text instead."
      );
    }
    if (!text.trim()) {
      throw new Error(
        "We couldn't find any text in that PDF. It may be a scanned image — please paste your CV text instead."
      );
    }
    return text;
  }

  if (isPlainText(file)) {
    try {
      return await file.text();
    } catch {
      throw new Error("We couldn't read that file. Please try pasting your CV text instead.");
    }
  }

  throw new Error("Unsupported file type. Please upload a PDF or TXT file.");
}
