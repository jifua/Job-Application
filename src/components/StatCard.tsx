interface StatCardProps {
  label: string;
  value: string | number;
  tone?: "neutral" | "match" | "signal" | "warn";
}

const TONE_TEXT: Record<NonNullable<StatCardProps["tone"]>, string> = {
  neutral: "text-ink",
  match: "text-match",
  signal: "text-signal",
  warn: "text-warn",
};

export function StatCard({ label, value, tone = "neutral" }: StatCardProps) {
  return (
    <div className="rounded-lg border border-surface-border bg-white p-4">
      <p className={`font-mono text-2xl font-bold ${TONE_TEXT[tone]}`}>{value}</p>
      <p className="mt-1 text-xs font-medium text-ink-soft">{label}</p>
    </div>
  );
}
