import { useEffect, useRef, useState } from "react";
import { formatSeconds } from "../utils/formatTime";

interface CountdownTimerProps {
  durationSeconds: number;
  isRunning: boolean;
  /** Changing this value resets the timer back to durationSeconds. */
  resetKey: string | number;
  onComplete: () => void;
}

export function CountdownTimer({ durationSeconds, isRunning, resetKey, onComplete }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const completedRef = useRef(false);

  // Reset whenever the caller changes resetKey (e.g. switching question or phase).
  useEffect(() => {
    setRemaining(durationSeconds);
    completedRef.current = false;
  }, [resetKey, durationSeconds]);

  // Tick every second while running.
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, resetKey]);

  // Fire onComplete exactly once when it reaches zero.
  useEffect(() => {
    if (remaining === 0 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [remaining, onComplete]);

  const isLow = remaining > 0 && remaining <= 10;

  return (
    <div
      role="timer"
      aria-live="polite"
      className={`font-mono text-4xl font-bold tabular-nums ${isLow ? "text-warn" : "text-ink"}`}
    >
      {formatSeconds(remaining)}
    </div>
  );
}
