"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookieBite } from "@fortawesome/free-solid-svg-icons";
import { COOKIE_PREFERENCES_OPEN_EVENT } from "@/lib/cookie-consent";

type FloatingCookieSettingsButtonProps = {
  label: string;
};

export function FloatingCookieSettingsButton({ label }: FloatingCookieSettingsButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_PREFERENCES_OPEN_EVENT))}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      title={label}
      style={{
        position: "fixed",
        bottom: 28,
        left: 28,
        zIndex: 50,
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "1px solid var(--surface-strong)",
        background: hovered ? "var(--surface-strong)" : "transparent",
        color: hovered ? "var(--foreground)" : "#fffaf4",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--shadow)",
        fontSize: 20,
        lineHeight: 1,
        transition: "background 0.2s, color 0.2s"
      }}
    >
      <FontAwesomeIcon icon={faCookieBite} aria-hidden="true" />
    </button>
  );
}
