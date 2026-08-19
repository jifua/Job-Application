import { useMemo, useState } from "react";
import { TRACKS, getQuestionsForTrack } from "../data/interviewQuestions";
import type { InterviewQuestion, PracticeTrack, QuestionCategory } from "../types/interview";
import { CountdownTimer } from "../components/CountdownTimer";
import { Badge } from "../components/Badge";

const PREP_SECONDS = 30;
const ANSWER_SECONDS = 120;

type PracticePhase = "idle" | "prep" | "answer" | "done";

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  general: "General",
  behavioral: "Behavioral (use STAR)",
  situational: "Situational",
  "role-specific": "Role-specific",
};

const CATEGORY_ORDER: QuestionCategory[] = ["general", "behavioral", "situational", "role-specific"];

function groupByCategory(questions: InterviewQuestion[]): [QuestionCategory, InterviewQuestion[]][] {
  return CATEGORY_ORDER.map((cat) => [cat, questions.filter((q) => q.category === cat)]).filter(
    ([, qs]) => qs.length > 0
  ) as [QuestionCategory, InterviewQuestion[]][];
}

export function InterviewPractice() {
  const [track, setTrack] = useState<PracticeTrack>("general");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<PracticePhase>("idle");
  const [isPaused, setIsPaused] = useState(false);
  const [notes, setNotes] = useState("");
  const [practicedIds, setPracticedIds] = useState<Set<string>>(new Set());

  const questions = useMemo(() => getQuestionsForTrack(track), [track]);
  const grouped = useMemo(() => groupByCategory(questions), [questions]);
  const selectedQuestion = useMemo(
    () => questions.find((q) => q.id === selectedId) ?? null,
    [questions, selectedId]
  );

  function selectQuestion(question: InterviewQuestion) {
    setSelectedId(question.id);
    setPhase("idle");
    setIsPaused(false);
    setNotes("");
  }

  function handleTrackChange(nextTrack: PracticeTrack) {
    setTrack(nextTrack);
    setSelectedId(null);
    setPhase("idle");
    setIsPaused(false);
    setNotes("");
  }

  function togglePracticed(id: string) {
    setPracticedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleRandomQuestion() {
    if (questions.length === 0) return;
    const pool = questions.filter((q) => q.id !== selectedId);
    const pick = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : questions[0];
    selectQuestion(pick);
  }

  function handleNextQuestion() {
    if (!selectedQuestion) return;
    const idx = questions.findIndex((q) => q.id === selectedQuestion.id);
    const next = questions[(idx + 1) % questions.length];
    selectQuestion(next);
  }

  const isRunning = (phase === "prep" || phase === "answer") && !isPaused;
  const resetKey = `${selectedQuestion?.id ?? "none"}-${phase}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="eyebrow mb-3">Interview Practice</p>
      <h1 className="text-3xl font-bold sm:text-4xl">Rehearse before the real thing</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Pick a track, choose a question, and practice out loud or in writing. This is a visual
        timer only — no audio is recorded and no microphone permission is ever requested.
      </p>

      {/* Track picker */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTrackChange(t.id)}
            title={t.description}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              track === t.id
                ? "border-blueprint-500 bg-blueprint-50 text-blueprint-600"
                : "border-surface-border text-ink-soft hover:border-blueprint-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Question list */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-soft">
              {practicedIds.size} of {questions.length} marked practiced (this session only)
            </p>
            <button type="button" onClick={handleRandomQuestion} className="btn-secondary">
              Random question
            </button>
          </div>

          {grouped.map(([category, qs]) => (
            <div key={category} className="card">
              <p className="eyebrow mb-3">{CATEGORY_LABELS[category]}</p>
              <ul className="flex flex-col divide-y divide-surface-border">
                {qs.map((q) => (
                  <li key={q.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <input
                      type="checkbox"
                      checked={practicedIds.has(q.id)}
                      onChange={() => togglePracticed(q.id)}
                      aria-label={`Mark "${q.question}" as practiced`}
                      className="mt-1 h-4 w-4 shrink-0 accent-blueprint-500"
                    />
                    <button
                      type="button"
                      onClick={() => selectQuestion(q)}
                      className={`flex-1 text-left text-sm ${
                        selectedId === q.id ? "font-semibold text-blueprint-600" : "text-ink hover:text-blueprint-600"
                      }`}
                    >
                      {q.question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Practice panel */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {!selectedQuestion && (
            <div className="card flex h-full flex-col items-center justify-center gap-2 py-16 text-center text-ink-soft">
              <p className="font-medium text-ink">No question selected</p>
              <p className="max-w-xs text-sm">
                Pick a question from the list, or click "Random question" to get started.
              </p>
            </div>
          )}

          {selectedQuestion && (
            <div className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge tone="blueprint">{CATEGORY_LABELS[selectedQuestion.category]}</Badge>
                  <h2 className="mt-3 text-xl font-semibold text-ink">{selectedQuestion.question}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{selectedQuestion.tip}</p>

              <label htmlFor="notes" className="mt-5 block text-sm font-semibold text-ink">
                Notes / answer outline{" "}
                <span className="font-normal text-ink-soft">(not saved after you leave this page)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down key points before you start the timer..."
                rows={4}
                className="mt-1.5 w-full resize-y rounded-md border border-surface-border p-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-blueprint-400 focus:outline-none"
              />

              <div className="mt-6 flex flex-col items-center gap-4 rounded-lg border border-surface-border bg-surface-muted p-6">
                {phase === "idle" && (
                  <>
                    <p className="text-sm text-ink-soft">Ready when you are.</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button type="button" className="btn-primary" onClick={() => setPhase("prep")}>
                        Start prep ({PREP_SECONDS}s)
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => setPhase("answer")}>
                        Skip straight to answering
                      </button>
                    </div>
                  </>
                )}

                {phase === "prep" && (
                  <>
                    <p className="eyebrow">Prep time — think through your answer</p>
                    <CountdownTimer
                      durationSeconds={PREP_SECONDS}
                      isRunning={isRunning}
                      resetKey={resetKey}
                      onComplete={() => setPhase("answer")}
                    />
                    <div className="flex flex-wrap justify-center gap-3">
                      <button type="button" className="btn-secondary" onClick={() => setIsPaused((p) => !p)}>
                        {isPaused ? "Resume" : "Pause"}
                      </button>
                      <button type="button" className="btn-primary" onClick={() => setPhase("answer")}>
                        Start answering now
                      </button>
                    </div>
                  </>
                )}

                {phase === "answer" && (
                  <>
                    <p className="eyebrow">Answering — speak or write your answer</p>
                    <CountdownTimer
                      durationSeconds={ANSWER_SECONDS}
                      isRunning={isRunning}
                      resetKey={resetKey}
                      onComplete={() => setPhase("done")}
                    />
                    <div className="flex flex-wrap justify-center gap-3">
                      <button type="button" className="btn-secondary" onClick={() => setIsPaused((p) => !p)}>
                        {isPaused ? "Resume" : "Pause"}
                      </button>
                      <button type="button" className="btn-primary" onClick={() => setPhase("done")}>
                        Finish early
                      </button>
                    </div>
                  </>
                )}

                {phase === "done" && (
                  <>
                    <p className="font-medium text-ink">Time's up.</p>
                    <p className="text-center text-sm text-ink-soft">
                      Take a moment to reflect — was your answer specific? Did it stay on topic?
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          setPhase("idle");
                          setIsPaused(false);
                        }}
                      >
                        Practice again
                      </button>
                      <button type="button" className="btn-primary" onClick={handleNextQuestion}>
                        Next question
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
