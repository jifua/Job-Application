interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "match" | "warn" | "blueprint";
}

const TONE_CLASSES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-surface-muted text-ink-soft border-surface-border",
  match: "bg-match-soft text-match border-transparent",
  warn: "bg-warn-soft text-warn border-transparent",
  blueprint: "bg-blueprint-50 text-blueprint-600 border-transparent",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
