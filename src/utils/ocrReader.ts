export interface OcrProgress {
  status: string;
  progress: number; // 0–1
}

/**
 * Extracts text from an image file entirely in the browser using
 * Tesseract.js (runs in a Web Worker, so it doesn't freeze the UI).
 * Uses English + Indonesian language data since job postings pasted by
 * Indonesian jobseekers are frequently bilingual.
 */
export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: OcrProgress) => void
): Promise<string> {
  const Tesseract = await import("tesseract.js");

  const { data } = await Tesseract.recognize(file, "eng+ind", {
    logger: (message) => {
      if (onProgress && typeof message.progress === "number") {
        onProgress({ status: message.status, progress: message.progress });
      }
    },
  });

  return data.text.trim();
}
