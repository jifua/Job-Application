import { useEffect, useMemo, useRef, useState } from "react";
import type { ApplicationStatus, TrackerEntry, TrackerEntryDraft } from "../types/tracker";
import { STATUS_LABELS, STATUS_ORDER } from "../types/tracker";
import {
  applyEntryEdit,
  clearAllEntries,
  createEntry,
  exportEntriesToJson,
  loadEntries,
  parseImportedEntries,
  saveEntries,
} from "../services/trackerStorage";
import { calculateStats } from "../utils/trackerStats";
import { StatCard } from "../components/StatCard";
import { TrackerEntryForm } from "../components/TrackerEntryForm";
import { TrackerEntryCard } from "../components/TrackerEntryCard";
import { ConfirmDialog } from "../components/ConfirmDialog";

type SortOption = "deadline" | "applicationDate" | "company";

const SORT_LABELS: Record<SortOption, string> = {
  deadline: "Deadline (soonest first)",
  applicationDate: "Application date (newest first)",
  company: "Company (A–Z)",
};

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
  const importInputRef = useRef<HTMLInputElement>(null);

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
    setIsFormOpen(false);
  }

  function handleUpdateEntry(draft: TrackerEntryDraft) {
    if (!editingEntry) return;
    persist(entries.map((e) => (e.id === editingEntry.id ? applyEntryEdit(e, draft) : e)));
    setEditingEntry(null);
    setIsFormOpen(false);
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
      setImportSuccess(`Imported ${imported.length} application${imported.length === 1 ? "" : "s"}.`);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "We couldn't import that file.");
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
          <p className="eyebrow mb-3">Application Tracker</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Keep every application in one place</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Saved only in this browser, on this device — nothing is sent to a server. Use{" "}
            <strong>Export Data</strong> below to back it up.
          </p>
        </div>
        {hasLoaded && entries.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setEditingEntry(null);
              setIsFormOpen(true);
            }}
            className="btn-primary shrink-0"
          >
            Add application
          </button>
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

      {!hasLoaded ? (
        <div className="card mt-8 py-16 text-center text-ink-soft">Loading your saved applications…</div>
      ) : entries.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-medium text-ink">No applications tracked yet</p>
          <p className="max-w-sm text-sm text-ink-soft">
            Add your first application to start tracking status, deadlines, and your response
            rate over time.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingEntry(null);
              setIsFormOpen(true);
            }}
            className="btn-primary mt-2"
          >
            Add your first application
          </button>
        </div>
      ) : (
        <>
          {/* Dashboard */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Applications" value={stats.total} />
            <StatCard label="Interviews" value={stats.interviews} />
            <StatCard label="Tests" value={stats.tests} />
            <StatCard label="Offers" value={stats.offers} tone="match" />
            <StatCard label="Rejected" value={stats.rejected} tone="warn" />
            <StatCard label="Pending" value={stats.pending} tone="signal" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <StatCard label="Interview rate" value={`${stats.interviewRate}%`} />
            <StatCard label="Response rate" value={`${stats.responseRate}%`} />
            <StatCard label="Offer rate" value={`${stats.offerRate}%`} tone="match" />
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Rates are based on each application's current status, not a full history of status
            changes.
          </p>

          {/* Filters */}
          <div className="card mt-8 flex flex-wrap items-end gap-4">
            <div className="min-w-[200px] flex-1">
              <label htmlFor="tracker-search" className="text-sm font-medium text-ink">
                Search
              </label>
              <input
                id="tracker-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company or position..."
                className="mt-1.5 w-full rounded-md border border-surface-border p-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="tracker-status-filter" className="text-sm font-medium text-ink">
                Status
              </label>
              <select
                id="tracker-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "all")}
                className="mt-1.5 rounded-md border border-surface-border p-2.5 text-sm text-ink focus:border-blueprint-400 focus:outline-none"
              >
                <option value="all">All statuses</option>
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tracker-sort" className="text-sm font-medium text-ink">
                Sort by
              </label>
              <select
                id="tracker-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="mt-1.5 rounded-md border border-surface-border p-2.5 text-sm text-ink focus:border-blueprint-400 focus:outline-none"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <option key={option} value={option}>
                    {SORT_LABELS[option]}
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
                onSubmit={editingEntry ? handleUpdateEntry : handleAddEntry}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingEntry(null);
                }}
              />
            </div>
          )}

          {/* List */}
          <div className="mt-6 flex flex-col gap-3">
            {visibleEntries.length === 0 ? (
              <div className="card py-10 text-center text-sm text-ink-soft">
                No applications match your current search/filter.
              </div>
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
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Data management */}
      <div className="card mt-10">
        <p className="eyebrow mb-2">Your data</p>
        <p className="mb-4 text-sm text-ink-soft">
          Everything above is stored only in this browser's local storage, on this device. There
          is no account and no cloud sync — clearing your browser data, using a different
          browser, or switching devices will remove it. Export a backup regularly if this data
          matters to you.
        </p>

        {importError && (
          <p role="alert" className="mb-3 text-sm font-medium text-warn">
            {importError}
          </p>
        )}
        {importSuccess && <p className="mb-3 text-sm font-medium text-match">{importSuccess}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleExport} className="btn-secondary" disabled={entries.length === 0}>
            Export Data (.json)
          </button>
          <label className="btn-secondary cursor-pointer">
            Import Data (.json)
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
            Clear All Data
          </button>
        </div>
      </div>

      {entryPendingDelete && (
        <ConfirmDialog
          title="Delete this application?"
          description={`This will remove "${entryPendingDelete.position}" at "${entryPendingDelete.company}" from your tracker. This can't be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setEntryPendingDelete(null)}
        />
      )}

      {showClearConfirm && (
        <ConfirmDialog
          title="Clear all tracker data?"
          description="This will permanently delete every application saved in this browser. Consider exporting a backup first. This can't be undone."
          confirmLabel="Clear everything"
          onConfirm={handleConfirmClearAll}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
}
