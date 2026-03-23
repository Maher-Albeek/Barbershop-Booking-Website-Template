"use client";

import { useId } from "react";

type HorizontalScrollControlsProps = {
  targetId: string;
  prevLabel?: string;
  nextLabel?: string;
};

function scrollTarget(targetId: string, direction: "left" | "right") {
  const element = document.getElementById(targetId);

  if (!element) {
    return;
  }

  const distance = Math.max(280, Math.floor(element.clientWidth * 0.86));

  element.scrollBy({
    left: direction === "right" ? distance : -distance,
    behavior: "smooth"
  });
}

export function HorizontalScrollControls({
  targetId,
  prevLabel = "Previous",
  nextLabel = "Next"
}: HorizontalScrollControlsProps) {
  const controlsId = useId();

  return (
    <div
      aria-label="Slider controls"
      aria-controls={targetId}
      id={controlsId}
      style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
    >
      <button
        type="button"
        onClick={() => scrollTarget(targetId, "left")}
        aria-label={prevLabel}
        style={{
          border: "1px solid var(--border)",
          borderRadius: 999,
          padding: "10px 14px",
          background: "var(--surface-strong)",
          color: "var(--foreground)",
          cursor: "pointer",
          fontWeight: 700,
          lineHeight: 1
        }}
      >
        {"<"}
      </button>
      <button
        type="button"
        onClick={() => scrollTarget(targetId, "right")}
        aria-label={nextLabel}
        style={{
          border: "1px solid var(--border)",
          borderRadius: 999,
          padding: "10px 14px",
          background: "var(--surface-strong)",
          color: "var(--foreground)",
          cursor: "pointer",
          fontWeight: 700,
          lineHeight: 1
        }}
      >
        {">"}
      </button>
    </div>
  );
}
