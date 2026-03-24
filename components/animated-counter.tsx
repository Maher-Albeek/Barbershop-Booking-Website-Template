"use client";

import { useEffect, useMemo, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  durationMs?: number;
  locale?: string;
};

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function AnimatedCounter({
  value,
  suffix = "",
  durationMs = 2200,
  locale = "en"
}: AnimatedCounterProps) {
  const target = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();

    const tick = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);
      const nextValue = Math.round(target * eased);

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    setDisplayValue(0);
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [target, durationMs]);

  const formatted = useMemo(
    () => new Intl.NumberFormat(locale).format(displayValue),
    [displayValue, locale]
  );

  return (
    <>
      {formatted}
      {suffix}
    </>
  );
}
