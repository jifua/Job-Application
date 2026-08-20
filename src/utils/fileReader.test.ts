import { describe, it, expect } from "vitest";
import { extractTextFromFiles } from "./fileReader";

function makeTextFile(name: string, content: string): File {
  return new File([content], name, { type: "text/plain" });
}

describe("extractTextFromFiles", () => {
  it("reads a single text file", async () => {
    const { text, skippedCount } = await extractTextFromFiles([makeTextFile("cv.txt", "Hello CV")]);
    expect(text).toBe("Hello CV");
    expect(skippedCount).toBe(0);
  });

  it("joins multiple text files with a blank line between them", async () => {
    const { text } = await extractTextFromFiles([
      makeTextFile("a.txt", "Part one"),
      makeTextFile("b.txt", "Part two"),
    ]);
    expect(text).toBe("Part one\n\nPart two");
  });

  it("caps processing at 6 files and reports how many were skipped", async () => {
    const files = Array.from({ length: 9 }, (_, i) => makeTextFile(`f${i}.txt`, `content ${i}`));
    const { text, skippedCount } = await extractTextFromFiles(files);
    expect(skippedCount).toBe(3);
    expect(text.split("\n\n")).toHaveLength(6);
  });

  it("reports progress for each file as it's read", async () => {
    const progressCalls: string[] = [];
    await extractTextFromFiles(
      [makeTextFile("a.txt", "x"), makeTextFile("b.txt", "y")],
      (current, total) => progressCalls.push(`${current}/${total}`)
    );
    expect(progressCalls).toContain("1/2");
    expect(progressCalls).toContain("2/2");
  });

  it("rejects an unsupported file type with a human-readable error", async () => {
    const weirdFile = new File(["binary junk"], "archive.zip", { type: "application/zip" });
    await expect(extractTextFromFiles([weirdFile])).rejects.toThrow(/unsupported file type/i);
  });
});
