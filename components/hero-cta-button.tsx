"use client";

import type { Route } from "next";
import Link from "next/link";
import { useCallback, useState } from "react";

type HeroHref =
  | Route
  | { pathname: Route; query?: Record<string, string>; hash?: string };

type HeroCtaButtonProps = {
  href: HeroHref;
  label: string;
};

export function HeroCtaButton({ href, label }: HeroCtaButtonProps) {
  const [active, setActive] = useState(false);
  const show = useCallback(() => setActive(true), []);

  const hide = useCallback(() => setActive(false), []);

  return (
    <div
      className={`hero-cta-wrap${active ? " hero-cta-wrap--active" : ""}`}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {/* Orbiting dot */}
      <span className="hero-cta-orbit" aria-hidden="true" />

      <Link
        href={href}
        className="hero-cta-link"
        onFocus={show}
        onBlur={hide}
      >
        {/* Button label */}
        <span className="hero-cta-text">{label}</span>
      </Link>
    </div>
  );
}
