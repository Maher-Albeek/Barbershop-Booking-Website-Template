"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

type FloatingWhatsAppButtonProps = {
  href: string;
  label: string;
};

export function FloatingWhatsAppButton({ href, label }: FloatingWhatsAppButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      title={label}
      style={{
        position: "fixed",
        right: "clamp(12px, 3.5vw, 28px)",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(72px, 16vw, 88px))",
        zIndex: 50,
        width: "clamp(44px, 11vw, 48px)",
        height: "clamp(44px, 11vw, 48px)",
        borderRadius: "50%",
        border: "1px solid rgb(8, 224, 55)",
        background: hovered ? "var(--surface-strong)" : "transparent",
        color: hovered ? "var(--foreground)" : "rgb(8, 224, 55)",
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
      <FontAwesomeIcon icon={faWhatsapp} aria-hidden="true" />
    </a>
  );
}
