import type { Route } from "next";
import Link from "next/link";
import styles from "./fullscreen-hero.module.css";

type HeaderHref =
  | Route
  | {
      pathname: Route;
      query?: Record<string, string>;
      hash?: string;
    };

type HeaderNavigationItem = {
  href: Route;
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

export function FullscreenHeroHeader({
  brandName,
  navigation,
  localeItems
}: FullscreenHeroHeaderProps) {
  return (
    <header
      className={styles.heroHeader}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3
      }}
    >
      <details className={styles.mobileMenuShell}>
        <summary
          className={styles.mobileMenuSummary}
          aria-label="Open navigation menu"
          style={{
            listStyle: "none",
            border: "1px solid rgba(255, 250, 244, 0.32)",
            background: "rgba(0, 0, 0, 0.22)",
            color: "#fffaf4",
            borderRadius: "50%",
            width: 42,
            height: 42,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </summary>
        <div className={styles.mobileMenuPanel}>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: "#fffaf4",
                borderRadius: 14,
                padding: "10px 12px",
                background: "rgba(255, 250, 244, 0.04)"
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </details>

      <nav
        className={styles.desktopNav}
        style={{
          alignItems: "center",
          flexWrap: "wrap",
          gap: 18,
          fontSize: 15,
          color: "rgba(255, 250, 244, 0.86)"
        }}
        aria-label="Primary navigation"
      >
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div
        style={{
          fontSize: "clamp(1.7rem, 2.6vw, 2.25rem)",
          letterSpacing: "0.02em",
          color: "#f8f2ea"
        }}
      >
        {brandName}
      </div>

      <div style={{ display: "grid", justifyItems: "end", gap: 10 }}>
        {localeItems && localeItems.length > 0 ? (
          <details style={{ position: "relative" }}>
            <summary
              style={{
                listStyle: "none",
                border: "1px solid rgba(255, 250, 244, 0.32)",
                background: "rgba(0, 0, 0, 0.22)",
                color: "#fffaf4",
                borderRadius: "50%",
                width: 42,
                height: 42,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                userSelect: "none"
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M12 3C14.5 5.74 15.92 8.8 16 12C15.92 15.2 14.5 18.26 12 21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 3C9.5 5.74 8.08 8.8 8 12C8.08 15.2 9.5 18.26 12 21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
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
  );
}
