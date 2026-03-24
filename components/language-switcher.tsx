"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faChevronDown } from "@fortawesome/free-solid-svg-icons";

type LocaleOption = {
  href: Route | string;
  label: string;
  isActive: boolean;
};

type LanguageSwitcherProps = {
  items: LocaleOption[];
};

export function LanguageSwitcher({ items }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeItem = items.find((i) => i.isActive);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        aria-label="Switch language"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255, 250, 244, 0.12)",
          border: "1px solid rgba(255, 250, 244, 0.32)",
          borderRadius: 999,
          padding: "7px 12px",
          color: "#fffaf4",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.06em",
          cursor: "pointer",
          textTransform: "uppercase"
        }}
      >
        {/* Globe icon */}
        <FontAwesomeIcon icon={faGlobe} width={15} height={15} aria-hidden="true" />
        {activeItem?.label ?? ""}
        {/* Chevron */}
        <FontAwesomeIcon
          icon={faChevronDown}
          width={11}
          height={11}
          aria-hidden="true"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.18s ease"
          }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            margin: 0,
            padding: "6px 0",
            listStyle: "none",
            background: "rgba(18, 14, 10, 0.92)",
            border: "1px solid rgba(255, 250, 244, 0.18)",
            borderRadius: 10,
            backdropFilter: "blur(12px)",
            minWidth: 110,
            zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)"
          }}
        >
          {items.map((item) => (
            <li key={item.label} role="option" aria-selected={item.isActive}>
              <Link
                href={item.href as Route}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "9px 18px",
                  fontSize: 13,
                  fontWeight: item.isActive ? 700 : 400,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: item.isActive ? "#f8d89a" : "rgba(255, 250, 244, 0.82)",
                  background: item.isActive ? "rgba(255, 250, 244, 0.07)" : "transparent"
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
