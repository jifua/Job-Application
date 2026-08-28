import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import type { ApplicationStatus, TrackerEntry, TrackerEntryDraft } from "../types/tracker";
import { STATUS_ORDER } from "../types/tracker";
import {
  applyEntryEdit,
  applyStatusChange,
  clearAllEntries,
  createEntry,
  exportEntriesToJson,
  exportEntriesToXlsx,
  loadEntries,
  parseImportedEntries,
  saveEntries,
} from "../services/trackerStorage";
import { calculateStats } from "../utils/trackerStats";
import { extractTextFromFiles } from "../utils/fileReader";
import { parseApplicationScreenshot } from "../utils/applicationScreenshotParser";
import { StatCard } from "../components/StatCard";
import { TrackerEntryForm } from "../components/TrackerEntryForm";
import { TrackerEntryCard } from "../components/TrackerEntryCard";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useLanguage } from "../i18n/LanguageContext";

type SortOption = "deadline" | "applicationDate" | "company";

function sortEntries(entries: TrackerEntry[], sortBy: SortOption): TrackerEntry[] {
  const sorted = [...entries];
  switch (sortBy) {
    case "deadline":
      return sorted.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1; // entries with no deadline go last
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      });
    case "applicationDate":
      return sorted.sort((a, b) => b.applicationDate.localeCompare(a.applicationDate));
    case "company":
      return sorted.sort((a, b) => a.company.localeCompare(b.company));
  }
}

export function Tracker() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TrackerEntry | null>(null);
  const [entryPendingDelete, setEntryPendingDelete] = useState<TrackerEntry | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("deadline");

  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [xlsxExporting, setXlsxExporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Screenshot -> pre-filled form flow.
  const [screenshotDraft, setScreenshotDraft] = useState<Partial<TrackerEntryDraft> | null>(null);
  const [screenshotFields, setScreenshotFields] = useState<(keyof TrackerEntryDraft)[]>([]);
  const [isReadingScreenshot, setIsReadingScreenshot] = useState(false);
  const [screenshotProgress, setScreenshotProgress] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);

  // Load once on mount.
  useEffect(() => {
    const { entries: loaded, error } = loadEntries();
    setEntries(loaded);
    setLoadError(error);
    setHasLoaded(true);
  }, []);

  function persist(nextEntries: TrackerEntry[]) {
    setEntries(nextEntries);
    const { error } = saveEntries(nextEntries);
    setSaveError(error);
  }

  function handleAddEntry(draft: TrackerEntryDraft) {
    persist([...entries, createEntry(draft)]);
    closeForm();
  }

  function handleUpdateEntry(draft: TrackerEntryDraft) {
    if (!editingEntry) return;
    persist(entries.map((e) => (e.id === editingEntry.id ? applyEntryEdit(e, draft) : e)));
    closeForm();
  }

  function handleStatusChange(entry: TrackerEntry, status: ApplicationStatus) {
    persist(entries.map((e) => (e.id === entry.id ? applyStatusChange(e, status) : e)));
  }

  async function handleScreenshotUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setIsReadingScreenshot(true);
    setScreenshotError(null);
    setScreenshotProgress(files.length > 1 ? t.tracker.readingScreenshot : t.tracker.readingScreenshot);

    try {
      const { text, skippedCount } = await extractTextFromFiles(files, (current, total, message) => {
        setScreenshotProgress(total > 1 ? `${current}/${total}: ${message}` : message);
      });
      const { guess, fieldsFound } = parseApplicationScreenshot(text);
      setScreenshotDraft(guess);
      setScreenshotFields(fieldsFound);
      setEditingEntry(null);
      setIsFormOpen(true);
      if (skippedCount > 0) {
        setScreenshotError(t.tracker.screenshotOnlyFirstSix.replace("{count}", String(skippedCount)));
      }
      if (fieldsFound.length === 0) {
        setScreenshotError(t.tracker.screenshotNoFieldsFound);
      }
    } catch (err) {
      setScreenshotError(err instanceof Error ? err.message : t.tracker.screenshotReadError);
    } finally {
      setIsReadingScreenshot(false);
      setScreenshotProgress(null);
      event.target.value = "";
    }
  }

  function openBlankForm() {
    setEditingEntry(null);
    setScreenshotDraft(null);
    setScreenshotFields([]);
    setScreenshotError(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingEntry(null);
    setScreenshotDraft(null);
    setScreenshotFields([]);
    setScreenshotError(null);
  }

  async function handleExportXlsx() {
    setXlsxExporting(true);
    try {
      const blob = await exportEntriesToXlsx(entries);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `job-application-tracker-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } finally {
      setXlsxExporting(false);
    }
  }

  function handleConfirmDelete() {
    if (!entryPendingDelete) return;
    persist(entries.filter((e) => e.id !== entryPendingDelete.id));
    setEntryPendingDelete(null);
  }

  function handleConfirmClearAll() {
    clearAllEntries();
    setEntries([]);
    setShowClearConfirm(false);
  }

  function handleExport() {
    const json = exportEntriesToJson(entries);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `job-application-toolkit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    setImportError(null);
    setImportSuccess(null);
    try {
      const text = await file.text();
      const imported = parseImportedEntries(text);
      const existingIds = new Set(entries.map((e) => e.id));
      const merged = [...entries, ...imported.filter((e) => !existingIds.has(e.id))];
      persist(merged);
      setImportSuccess(t.tracker.importedSuccess.replace("{count}", String(imported.length)));
    } catch (err) {
      setImportError(err instanceof Error ? err.message : t.tracker.importGenericError);
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  }

  const stats = useMemo(() => calculateStats(entries), [entries]);

  const visibleEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = entries.filter((e) => {
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      const matchesQuery =
        !query || e.company.toLowerCase().includes(query) || e.position.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
    return sortEntries(filtered, sortBy);
  }, [entries, searchQuery, statusFilter, sortBy]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">{t.tracker.eyebrow}</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{t.tracker.title}</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">{t.tracker.subtitle}</p>
        </div>
        {hasLoaded && entries.length > 0 && (
          <div className="flex shrink-0 flex-wrap gap-2">
            <label className="btn-secondary cursor-pointer">
              {isReadingScreenshot ? (screenshotProgress ?? t.tracker.readingScreenshot) : t.tracker.addFromScreenshot}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleScreenshotUpload}
                disabled={isReadingScreenshot}
                className="sr-only"
              />
            </label>
            <button type="button" onClick={openBlankForm} className="btn-primary">
              {t.tracker.addApplication}
            </button>
          </div>
        )}
      </div>

      {loadError && (
        <p role="alert" className="mt-4 rounded-md bg-warn-soft px-4 py-3 text-sm font-medium text-warn">
          {loadError}
        </p>
      )}
      {saveError && (
        <p role="alert" className="mt-4 rounded-md bg-warn-soft px-4 py-3 text-sm font-medium text-warn">
          {saveError}
        </p>
      )}

      {screenshotError && (
        <p role="alert" className="mt-4 rounded-md bg-warn-soft px-4 py-3 text-sm font-medium text-warn">
          {screenshotError}
        </p>
      )}

      {!hasLoaded ? (
        <div className="card mt-8 py-16 text-center text-ink-soft">{t.tracker.loading}</div>
      ) : entries.length === 0 ? (
        isFormOpen ? (
          <div className="mt-8">
            <TrackerEntryForm
              initialEntry={null}
              prefill={screenshotDraft ?? undefined}
              autoDetectedFields={screenshotFields}
              onSubmit={handleAddEntry}
              onCancel={closeForm}
            />
          </div>
        ) : (
        <div className="card mt-8 flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-medium text-ink">{t.tracker.emptyTitle}</p>
          <p className="max-w-sm text-sm text-ink-soft">{t.tracker.emptyBody}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <label className="btn-secondary cursor-pointer">
              {isReadingScreenshot ? (screenshotProgress ?? t.tracker.readingScreenshot) : t.tracker.addFromScreenshot}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleScreenshotUpload}
                disabled={isReadingScreenshot}
                className="sr-only"
              />
            </label>
            <button type="button" onClick={openBlankForm} className="btn-primary">
              {t.tracker.addFirstApplication}
            </button>
          </div>
        </div>
        )
      ) : (
        <>
          {/* Dashboard */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            <StatCard label={t.tracker.statTotal} value={stats.total} />
            <StatCard label={t.tracker.statInterviews} value={stats.interviews} />
            <StatCard label={t.tracker.statTests} value={stats.tests} />
            <StatCard label={t.tracker.statOffers} value={stats.offers} tone="match" />
            <StatCard label={t.tracker.statRejected} value={stats.rejected} tone="warn" />
            <StatCard label={t.tracker.statGhosted} value={stats.ghosted} tone="warn" />
            <StatCard label={t.tracker.statPending} value={stats.pending} tone="signal" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label={t.tracker.statInterviewRate} value={`${stats.interviewRate}%`} />
            <StatCard label={t.tracker.statResponseRate} value={`${stats.responseRate}%`} />
            <StatCard label={t.tracker.statOfferRate} value={`${stats.offerRate}%`} tone="match" />
            <StatCard label={t.tracker.statGhostRate} value={`${stats.ghostRate}%`} tone="warn" />
          </div>
          <p className="mt-2 text-xs text-ink-soft">{t.tracker.rateDisclaimer}</p>

          {/* Filters */}
          <div className="card mt-8 flex flex-wrap items-end gap-4">
            <div className="min-w-[200px] flex-1">
              <label htmlFor="tracker-search" className="text-sm font-medium text-ink">
                {t.tracker.searchLabel}
              </label>
              <input
                id="tracker-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.tracker.searchPlaceholder}
                className="mt-1.5 w-full rounded-md border border-surface-border p-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="tracker-status-filter" className="text-sm font-medium text-ink">
                {t.tracker.statusFilterLabel}
              </label>
              <select
                id="tracker-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "all")}
                className="mt-1.5 rounded-md border border-surface-border p-2.5 text-sm text-ink focus:border-blueprint-400 focus:outline-none"
              >
                <option value="all">{t.tracker.statusFilterAll}</option>
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {t.tracker.status[status]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tracker-sort" className="text-sm font-medium text-ink">
                {t.tracker.sortLabel}
              </label>
              <select
                id="tracker-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="mt-1.5 rounded-md border border-surface-border p-2.5 text-sm text-ink focus:border-blueprint-400 focus:outline-none"
              >
                {(Object.keys(t.tracker.sortOptions) as SortOption[]).map((option) => (
                  <option key={option} value={option}>
                    {t.tracker.sortOptions[option]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form (add/edit) */}
          {isFormOpen && (
            <div className="mt-6">
              <TrackerEntryForm
                initialEntry={editingEntry}
                prefill={screenshotDraft ?? undefined}
                autoDetectedFields={screenshotFields}
                onSubmit={editingEntry ? handleUpdateEntry : handleAddEntry}
                onCancel={closeForm}
              />
            </div>
          )}

          {/* List */}
          <div className="mt-6 flex flex-col gap-3">
            {visibleEntries.length === 0 ? (
              <div className="card py-10 text-center text-sm text-ink-soft">{t.tracker.noResultsMatch}</div>
            ) : (
              visibleEntries.map((entry) => (
                <TrackerEntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={() => {
                    setEditingEntry(entry);
                    setIsFormOpen(true);
                  }}
                  onDelete={() => setEntryPendingDelete(entry)}
                  onStatusChange={(status) => handleStatusChange(entry, status)}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Data management */}
      <div className="card mt-10">
        <p className="eyebrow mb-2">{t.tracker.yourDataTitle}</p>
        <p className="mb-4 text-sm text-ink-soft">{t.tracker.yourDataBody}</p>

        {importError && (
          <p role="alert" className="mb-3 text-sm font-medium text-warn">
            {importError}
          </p>
        )}
        {importSuccess && <p className="mb-3 text-sm font-medium text-match">{importSuccess}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleExport} className="btn-secondary" disabled={entries.length === 0}>
            {t.tracker.exportJson}
          </button>
          <button
            type="button"
            onClick={handleExportXlsx}
            className="btn-secondary"
            disabled={entries.length === 0 || xlsxExporting}
          >
            {xlsxExporting ? t.tracker.exportXlsxPreparing : t.tracker.exportXlsx}
          </button>
          <label className="btn-secondary cursor-pointer">
            {t.tracker.importJson}
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
              }}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={entries.length === 0}
            className="ml-auto text-sm font-medium text-warn hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.tracker.clearAllData}
          </button>
        </div>
      </div>

      {entryPendingDelete && (
        <ConfirmDialog
          title={t.tracker.deleteConfirmTitle}
          description={t.tracker.deleteConfirmDescription
            .replace("{position}", entryPendingDelete.position)
            .replace("{company}", entryPendingDelete.company)}
          confirmLabel={t.tracker.deleteConfirmButton}
          onConfirm={handleConfirmDelete}
          onCancel={() => setEntryPendingDelete(null)}
        />
      )}

      {showClearConfirm && (
        <ConfirmDialog
          title={t.tracker.clearConfirmTitle}
          description={t.tracker.clearConfirmDescription}
          confirmLabel={t.tracker.clearConfirmButton}
          onConfirm={handleConfirmClearAll}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
}
