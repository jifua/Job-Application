import { describe, it, expect, beforeEach } from "vitest";
import {
  applyEntryEdit,
  applyStatusChange,
  createEntry,
  exportEntriesToXlsx,
  loadEntries,
  parseImportedEntries,
  saveEntries,
} from "./trackerStorage";
import type { TrackerEntryDraft } from "../types/tracker";

const STORAGE_KEY = "jobAppToolkit.trackerEntries.v1";

const FULL_DRAFT: TrackerEntryDraft = {
  company: "PT Contoh Sejahtera",
  position: "IT Support",
  location: "Jakarta",
  jobUrl: "https://example.com/job/123",
  site: "jobstreet",
  applicationDate: "2026-08-01",
  deadline: "2026-08-15",
  status: "applied",
  jobDescription: "Handle IT support tickets.",
  qualifications: "D3 Teknik Informatika.",
  notes: "Referred by a friend.",
};

describe("createEntry", () => {
  it("stamps schemaVersion 2 and seeds statusHistory with the initial status", () => {
    const entry = createEntry(FULL_DRAFT);
    expect(entry.schemaVersion).toBe(2);
    expect(entry.statusHistory).toHaveLength(1);
    expect(entry.statusHistory[0].status).toBe("applied");
  });
});

describe("applyEntryEdit / applyStatusChange — status history", () => {
  it("appends to statusHistory only when the status actually changes", () => {
    const entry = createEntry(FULL_DRAFT);
    const sameStatus = applyEntryEdit(entry, { ...FULL_DRAFT, notes: "Updated notes" });
    expect(sameStatus.statusHistory).toHaveLength(1); // status unchanged -> no new history entry

    const changedStatus = applyEntryEdit(entry, { ...FULL_DRAFT, status: "interview" });
    expect(changedStatus.statusHistory).toHaveLength(2);
    expect(changedStatus.statusHistory[1].status).toBe("interview");
  });

  it("applyStatusChange is a no-op when the status is unchanged", () => {
    const entry = createEntry(FULL_DRAFT);
    const result = applyStatusChange(entry, "applied");
    expect(result).toBe(entry); // same reference — no update triggered
  });

  it("applyStatusChange records a new history entry when the status changes", () => {
    const entry = createEntry(FULL_DRAFT);
    const result = applyStatusChange(entry, "ghosted");
    expect(result.status).toBe("ghosted");
    expect(result.statusHistory).toHaveLength(2);
    expect(result.statusHistory[1].status).toBe("ghosted");
  });
});

describe("schema migration — old (v1) data must load without breaking", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("migrates a v1 entry (no site/jobDescription/qualifications/statusHistory) into the current shape", () => {
    const v1Entry = {
      id: "legacy-1",
      company: "PT Lama",
      position: "Staff Admin",
      location: "Bandung",
      jobUrl: "",
      applicationDate: "2026-01-10",
      deadline: "",
      status: "interview",
      notes: "Old note",
      schemaVersion: 1,
      createdAt: "2026-01-10T00:00:00.000Z",
      updatedAt: "2026-01-12T00:00:00.000Z",
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([v1Entry]));

    const { entries, error } = loadEntries();
    expect(error).toBeNull();
    expect(entries).toHaveLength(1);

    const migrated = entries[0];
    expect(migrated.id).toBe("legacy-1");
    expect(migrated.company).toBe("PT Lama");
    expect(migrated.status).toBe("interview");
    expect(migrated.schemaVersion).toBe(2);
    // New fields backfilled with safe defaults rather than crashing/undefined:
    expect(migrated.site).toBe("other");
    expect(migrated.jobDescription).toBe("");
    expect(migrated.qualifications).toBe("");
    // History backfilled from what we know (current status, created date):
    expect(migrated.statusHistory).toHaveLength(1);
    expect(migrated.statusHistory[0].status).toBe("interview");
  });

  it("drops entries missing the bare minimum fields instead of crashing", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ notCompany: true }, { id: "x" }]));
    const { entries, error } = loadEntries();
    expect(error).toBeNull();
    expect(entries).toHaveLength(0);
  });

  it("falls back to a safe status if the stored status value is unrecognized", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: "1", company: "X", position: "Y", status: "some_future_status" }])
    );
    const { entries } = loadEntries();
    expect(entries[0].status).toBe("applied");
  });

  it("round-trips a full v2 entry through save/load without losing fields", () => {
    const entry = createEntry(FULL_DRAFT);
    saveEntries([entry]);
    const { entries } = loadEntries();
    expect(entries[0]).toEqual(entry);
  });

  it("migrates old-schema data on import too, not just on load", () => {
    const backup = JSON.stringify({
      exportedAt: "2026-01-01T00:00:00.000Z",
      schemaVersion: 1,
      entries: [
        {
          id: "legacy-2",
          company: "PT Backup Lama",
          position: "Analyst",
          status: "rejected",
        },
      ],
    });
    const imported = parseImportedEntries(backup);
    expect(imported).toHaveLength(1);
    expect(imported[0].schemaVersion).toBe(2);
    expect(imported[0].site).toBe("other");
  });
});

describe("exportEntriesToXlsx", () => {
  it("produces a non-empty spreadsheet blob containing one row per entry", async () => {
    const entries = [createEntry(FULL_DRAFT), createEntry({ ...FULL_DRAFT, company: "PT Kedua", status: "offer" })];
    const blob = await exportEntriesToXlsx(entries);

    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Parse it back to confirm the data actually made it into the sheet.
    const XLSX = await import("xlsx");
    const buffer = await blob.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet) as Record<string, string>[];

    expect(rows).toHaveLength(2);
    expect(rows[0]["Company"]).toBe("PT Contoh Sejahtera");
    expect(rows[0]["Site applied"]).toBe("JobStreet");
    expect(rows[1]["Status"]).toBe("Offer / Accepted");
  });
});
