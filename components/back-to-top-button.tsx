"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export function BackToTopButton({ label = "Back to top" }: { label?: string }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(12px, 3.5vw, 28px))",
        right: "clamp(12px, 3.5vw, 28px)",
        zIndex: 50,
        width: "clamp(44px, 11vw, 48px)",
        height: "clamp(44px, 11vw, 48px)",
        borderRadius: "50%",
        border: "1px solid var(--surface-strong)",
        background: hovered
          ? "var(--surface-strong)"
          : "transparent",
        color: hovered ? "var(--foreground)" : "#fffaf4",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--shadow)",
        fontSize: "clamp(18px, 4.5vw, 20px)",
        lineHeight: 1,
        touchAction: "manipulation",
        transition: "background 0.2s, color 0.2s"
      }}
    >
      <FontAwesomeIcon icon={faArrowUp} aria-hidden="true" />
    </button>
  );
}
