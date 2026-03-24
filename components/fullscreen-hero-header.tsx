"use client";

import type { Route } from "next";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faGlobe } from "@fortawesome/free-solid-svg-icons";
import styles from "./fullscreen-hero.module.css";

type HeaderHref =
  | Route
  | {
      pathname: Route;
      query?: Record<string, string>;
      hash?: string;
    };

type HeaderNavigationItem = {
  href: HeaderHref;
  label: string;
};

type HeaderLocaleItem = {
  href: HeaderHref;
  label: string;
  isActive: boolean;
};

type FullscreenHeroHeaderProps = {
  brandName: string;
  navigation: HeaderNavigationItem[];
  localeItems?: HeaderLocaleItem[];
};

const circleButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(255, 250, 244, 0.32)",
  background: "rgba(0, 0, 0, 0.22)",
  color: "#fffaf4",
  borderRadius: "50%",
  width: 42,
  height: 42,
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  padding: 0
};

export function FullscreenHeroHeader({
  brandName,
  navigation,
  localeItems
}: FullscreenHeroHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setClosing(false);
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 320); // matches slideOutLeft duration
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuOpen && !closing) closeMenu();
    else openMenu();
  }, [menuOpen, closing, openMenu, closeMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <>
      <header
        className={`${styles.heroHeader}${isScrolled ? ` ${styles.heroHeaderScrolled}` : ""}`}
        style={{
          zIndex: menuOpen ? 201 : 3
        }}
      >
        {/* Hamburger / close toggle */}
        <button
          onClick={toggleMenu}
          aria-expanded={menuOpen && !closing}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={circleButtonStyle}
        >
          {menuOpen ? (
            <FontAwesomeIcon icon={faXmark} width={18} height={18} aria-hidden="true" />
          ) : (
            <FontAwesomeIcon icon={faBars} width={18} height={18} aria-hidden="true" />
          )}
        </button>

        {/* Brand */}
        <div
          style={{
            fontSize: "clamp(1.7rem, 2.6vw, 2.25rem)",
            letterSpacing: "0.02em",
            color: "#f8f2ea",
            textAlign: "center"
          }}
        >
          {brandName}
        </div>

        {/* Locale switcher */}
        <div style={{ display: "grid", justifyItems: "end", gap: 10 }}>
          {localeItems && localeItems.length > 0 ? (
            <details style={{ position: "relative" }}>
              <summary
                style={{
                  ...circleButtonStyle,
                  listStyle: "none",
                  userSelect: "none"
                }}
              >
                <FontAwesomeIcon icon={faGlobe} width={18} height={18} aria-hidden="true" />
              </summary>
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  minWidth: 140,
                  display: "grid",
                  gap: 6,
                  padding: 8,
                  borderRadius: 18,
                  border: "1px solid rgba(255, 250, 244, 0.16)",
                  background: "rgba(14, 11, 9, 0.94)",
                  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)"
                }}
              >
                {localeItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      border: item.isActive
                        ? "1px solid rgba(255, 250, 244, 0.72)"
                        : "1px solid transparent",
                      background: item.isActive ? "rgba(255, 250, 244, 0.16)" : "transparent",
                      color: "#fffaf4",
                      borderRadius: 999,
                      padding: "8px 12px",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      textAlign: "center"
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          ) : null}
        </div>
      </header>

      {/* Fullscreen nav overlay */}
      {menuOpen && (
        <div className={`${styles.menuOverlay}${closing ? ` ${styles.menuOverlayClosing}` : ""}`}>
          {navigation.map((item, i) => (
            <Link
              key={`${item.label}-${i}`}
              href={item.href}
              onClick={closeMenu}
              className={`${styles.menuLink}${closing ? ` ${styles.menuLinkClosing}` : ""}`}
              style={closing ? undefined : { animationDelay: `${0.12 + i * 0.07}s` }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
