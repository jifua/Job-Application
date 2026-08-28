import { describe, it, expect } from "vitest";
import { parseApplicationScreenshot } from "./applicationScreenshotParser";

describe("parseApplicationScreenshot", () => {
  it("extracts labeled fields (Position/Company/Date) in English", () => {
    const text = [
      "JobStreet",
      "Application Sent!",
      "Position: Junior Data Analyst",
      "Company: Contoh Teknologi Indonesia",
      "Application date: 23 January 2026",
    ].join("\n");

    const { guess, fieldsFound } = parseApplicationScreenshot(text);
    expect(guess.position).toBe("Junior Data Analyst");
    expect(guess.company).toBe("Contoh Teknologi Indonesia");
    expect(guess.applicationDate).toBe("2026-01-23");
    expect(guess.site).toBe("jobstreet");
    expect(fieldsFound).toEqual(
      expect.arrayContaining(["position", "company", "applicationDate", "site"])
    );
  });

  it("extracts labeled fields in Indonesian", () => {
    const text = [
      "Glints",
      "Posisi: Staff Administrasi",
      "Perusahaan: PT Sinar Maju",
      "Tanggal melamar: 15/08/2026",
    ].join("\n");

    const { guess } = parseApplicationScreenshot(text);
    expect(guess.position).toBe("Staff Administrasi");
    expect(guess.company).toBe("PT Sinar Maju");
    expect(guess.applicationDate).toBe("2026-08-15");
    expect(guess.site).toBe("glints");
  });

  it("falls back to the 'applied for X' confirmation banner when there are no labeled fields", () => {
    const text = "Lamaran Anda untuk Junior Data Analyst telah terkirim ke PT Contoh Sejahtera.";
    const { guess, fieldsFound } = parseApplicationScreenshot(text);
    expect(guess.position).toBe("Junior Data Analyst");
    expect(fieldsFound).toContain("position");
  });

  it("recognizes Dealls, Talentic, and LinkedIn as sites", () => {
    expect(parseApplicationScreenshot("Applied via Dealls").guess.site).toBe("dealls");
    expect(parseApplicationScreenshot("Talentic - Application submitted").guess.site).toBe("talentic");
    expect(parseApplicationScreenshot("Your application was sent · LinkedIn").guess.site).toBe("linkedin");
  });

  it("returns an empty guess (not a crash) for unrecognizable/garbled OCR text", () => {
    const { guess, fieldsFound } = parseApplicationScreenshot("asdkj ##@@ 123 blah blah\nrandom noise");
    expect(fieldsFound).toEqual([]);
    expect(guess.position).toBeUndefined();
    expect(guess.company).toBeUndefined();
  });

  it("parses numeric dd-mm-yyyy dates", () => {
    const { guess } = parseApplicationScreenshot("Melamar pada: 01-09-2026");
    expect(guess.applicationDate).toBe("2026-09-01");
  });

  it("extracts both position and company from English 'for X at Y' phrasing with no labels", () => {
    const text = "Your application for Frontend Developer at PT Digital Karya has been sent via Glints.";
    const { guess, fieldsFound } = parseApplicationScreenshot(text);
    expect(guess.position).toBe("Frontend Developer");
    expect(guess.company).toBe("PT Digital Karya");
    expect(guess.site).toBe("glints");
    expect(fieldsFound).toEqual(expect.arrayContaining(["position", "company", "site"]));
  });

  it("falls back to a bare 'PT ...' line for company when nothing else matches", () => {
    const text = ["Lamaran berhasil dikirim!", "PT Solusi Digital Nusantara", "Software Engineer"].join("\n");
    const { guess, fieldsFound } = parseApplicationScreenshot(text);
    expect(guess.company).toBe("PT Solusi Digital Nusantara");
    expect(fieldsFound).toContain("company");
  });
});
