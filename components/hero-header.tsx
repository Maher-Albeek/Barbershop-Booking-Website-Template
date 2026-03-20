"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";

type NavItem = {
  href: Route | string;
  label: string;
};

type LocaleItem = {
  href: Route | string;
  label: string;
  isActive: boolean;
};

type HeroHeaderProps = {
  brandName: string;
  navItems: NavItem[];
  localeItems: LocaleItem[];
};

export function HeroHeader({ brandName, navItems, localeItems }: HeroHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close menu on route change (click a link)
  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <style>{`
        .hero-header {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px clamp(14px, 4vw, 44px);
          gap: 18px;
        }
        .hero-header__nav {
          display: none;
          align-items: center;
          gap: 18px;
          font-size: 15px;
          color: rgba(255, 250, 244, 0.86);
          flex-wrap: wrap;
        }
        .hero-header__nav a {
          color: rgba(255, 250, 244, 0.86);
          text-decoration: none;
          transition: color 0.15s;
        }
        .hero-header__nav a:hover {
          color: #fffaf4;
        }
        .hero-header__brand {
          font-size: clamp(1.7rem, 2.6vw, 2.25rem);
          letter-spacing: 0.02em;
          color: #f8f2ea;
          flex-shrink: 0;
        }
        .hero-header__right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hero-header__hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          background: rgba(255, 250, 244, 0.12);
          border: 1px solid rgba(255, 250, 244, 0.32);
          border-radius: 8px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          padding: 0;
        }
        .hero-header__hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #fffaf4;
          border-radius: 2px;
          transition: transform 0.22s ease, opacity 0.22s ease;
          transform-origin: center;
        }
        .hero-header__hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hero-header__hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .hero-header__hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        /* Mobile drawer */
        .hero-header__drawer {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9;
          padding-top: 80px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          background: rgba(8, 6, 4, 0.96);
          backdrop-filter: blur(16px);
          animation: fadeSlideDown 0.22s ease;
        }
        .hero-header__drawer.open {
          display: flex;
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-header__drawer a {
          display: block;
          width: 100%;
          text-align: center;
          padding: 18px 32px;
          font-size: 22px;
          font-weight: 500;
          color: rgba(255, 250, 244, 0.88);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 250, 244, 0.07);
          transition: color 0.15s, background 0.15s;
        }
        .hero-header__drawer a:hover {
          color: #fffaf4;
          background: rgba(255, 250, 244, 0.05);
        }
        .hero-header__drawer-locale {
          margin-top: 28px;
        }
      `}</style>

      <header className="hero-header">
        {/* Left: nav (desktop only) */}
        <nav aria-label="Primary navigation" className="hero-header__nav">
          {navItems.map((item) => (
            <Link key={item.href as string} href={item.href as Route}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Center: brand */}
        <div className="hero-header__brand">{brandName}</div>

        {/* Right: language switcher + hamburger */}
        <div className="hero-header__right" ref={menuRef}>
          {localeItems.length > 0 && (
            <LanguageSwitcher items={localeItems as { href: Route; label: string; isActive: boolean }[]} />
          )}
          <button
            className={`hero-header__hamburger${menuOpen ? " open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`hero-header__drawer${menuOpen ? " open" : ""}`}
      >
        {navItems.map((item) => (
          <Link
            key={item.href as string}
            href={item.href as Route}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
        {localeItems.length > 0 && (
          <div className="hero-header__drawer-locale">
            <LanguageSwitcher items={localeItems as { href: Route; label: string; isActive: boolean }[]} />
          </div>
        )}
      </div>
    </>
  );
}
