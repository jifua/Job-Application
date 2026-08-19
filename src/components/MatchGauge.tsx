interface MatchGaugeProps {
  score: number; // 0-100
  size?: number;
}

function getTone(score: number): { ring: string; text: string } {
  if (score >= 70) return { ring: "#1D7A5F", text: "text-match" };
  if (score >= 40) return { ring: "#F2A93B", text: "text-signal" };
  return { ring: "#C24A3B", text: "text-warn" };
}

/** A circular percentage gauge used for the CV match score. */
export function MatchGauge({ score, size = 96 }: MatchGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const tone = getTone(clamped);

  return (
    <div
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${tone.ring} ${clamped * 3.6}deg, #E7EBEF 0deg)`,
      }}
      role="img"
      aria-label={`Match score: ${clamped} percent`}
    >
      <div className="absolute inset-[6px] flex items-center justify-center rounded-full bg-white">
        <span className={`font-mono text-lg font-bold ${tone.text}`}>{clamped}%</span>
      </div>
    </div>
  );
}
