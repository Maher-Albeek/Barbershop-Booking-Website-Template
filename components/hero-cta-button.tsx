"use client";

import type { Route } from "next";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type HeroHref =
  | Route
  | { pathname: Route; query?: Record<string, string>; hash?: string };

type HeroCtaButtonProps = {
  href: HeroHref;
  label: string;
};

/** Button diameter in px — must match CSS .hero-cta-link width/height */
const SIZE = 132;
/** Orbit duration in ms — must match CSS heroCtaOrbit animation duration */
const ORBIT_DURATION = 2600;

export function HeroCtaButton({ href, label }: HeroCtaButtonProps) {
  const [active, setActive] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Continuously track the current orbit angle so we can read it on demand
  useEffect(() => {
    const tick = (time: number) => {
      if (startRef.current === null) startRef.current = time;
      const elapsed = (time - startRef.current) % ORBIT_DURATION;
      // Convert to radians; 0 = 3 o'clock (matches CSS right:-2px / translateY(-50%))
      angleRef.current = (elapsed / ORBIT_DURATION) * 2 * Math.PI;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const show = useCallback(() => {
    const a = angleRef.current;
    const r = SIZE / 2; // radius — dot sits on the button border
    // x, y in button-local coordinates (origin = top-left of button)
    const x = r + r * Math.cos(a);
    const y = r + r * Math.sin(a);
    if (wrapRef.current) {
      wrapRef.current.style.setProperty("--fill-x", `${x}px`);
      wrapRef.current.style.setProperty("--fill-y", `${y}px`);
    }
    setActive(true);
  }, []);

  const hide = useCallback(() => setActive(false), []);

  return (
    <div
      ref={wrapRef}
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
        {/* Fill circle that expands from dot position */}
        <span className="hero-cta-fill" aria-hidden="true" />
        {/* Text stays above fill */}
        <span className="hero-cta-text">{label}</span>
      </Link>
    </div>
  );
}
