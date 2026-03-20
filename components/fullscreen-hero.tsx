import type { Route } from "next";
import Link from "next/link";
import styles from "./fullscreen-hero.module.css";

const fallbackHeroImageUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2322333b'/%3E%3Cstop offset='55%25' stop-color='%234f2c17'/%3E%3Cstop offset='100%25' stop-color='%238b5e3c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='url(%23bg)'/%3E%3Ccircle cx='1220' cy='180' r='190' fill='rgba(214,176,125,0.18)'/%3E%3Ccircle cx='260' cy='760' r='260' fill='rgba(255,250,244,0.08)'/%3E%3C/svg%3E";

type HeroHref =
  | Route
  | {
      pathname: Route;
      query?: Record<string, string>;
      hash?: string;
    };

type HeroNavigationItem = {
  href: Route;
  label: string;
};

type HeroLocaleItem = {
  href: HeroHref;
  label: string;
  isActive: boolean;
};

type HeroAction = {
  href: HeroHref;
  label: string;
};

type FullscreenHeroProps = {
  locale: string;
  direction: "ltr" | "rtl";
  brandName: string;
  sinceLabel: string;
  logoText: string;
  title: string;
  kicker: string;
  description: string;
  navigation: HeroNavigationItem[];
  primaryAction: HeroAction;
  secondaryAction?: HeroAction;
  localeItems?: HeroLocaleItem[];
  heroImageUrl?: string;
};

export function FullscreenHero({
  locale,
  direction,
  brandName,
  sinceLabel,
  logoText,
  title,
  kicker,
  description,
  navigation,
  primaryAction,
  secondaryAction,
  localeItems,
  heroImageUrl = fallbackHeroImageUrl
}: FullscreenHeroProps) {
  return (
    <section
      lang={locale}
      dir={direction}
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        color: "#fffaf4",
        background:
          `linear-gradient(120deg, rgba(4, 9, 14, 0.74), rgba(8, 12, 19, 0.46) 46%, rgba(20, 11, 6, 0.7)), radial-gradient(circle at 78% 20%, rgba(232, 183, 122, 0.22), transparent 34%), url('${heroImageUrl}') center/cover no-repeat`
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.16) 0%, rgba(0, 0, 0, 0.5) 68%, rgba(0, 0, 0, 0.72) 100%)"
        }}
      />

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
                  <path
                    d="M3 12H21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
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

      <div
        style={{
          position: "absolute",
          left: "clamp(16px, 4vw, 44px)",
          right: "clamp(16px, 4vw, 44px)",
          bottom: "clamp(16px, 4vh, 44px)",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 20,
          flexWrap: "wrap"
        }}
      >
        <div style={{ maxWidth: 880 }}>
          <div
            style={{
              marginBottom: 16,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255, 250, 244, 0.72)"
            }}
          >
            {sinceLabel} {logoText}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.6rem, 8.4vw, 6.1rem)",
              lineHeight: 0.92,
              color: "#fffaf4",
              textWrap: "balance"
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "14px 0 0",
              maxWidth: 620,
              color: "rgba(255, 250, 244, 0.86)",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              lineHeight: 1.6
            }}
          >
            {kicker}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 18,
            justifyItems: "end",
            maxWidth: 340
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(255, 250, 244, 0.9)",
              fontSize: 20,
              lineHeight: 1.45,
              textAlign: "right"
            }}
          >
            {description}
          </p>
          <Link
            href={primaryAction.href}
            style={{
              width: 148,
              height: 148,
              borderRadius: "50%",
              border: "1px solid rgba(255, 250, 244, 0.78)",
              background: "rgba(15, 10, 7, 0.25)",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              color: "#fffaf4",
              fontSize: 21,
              lineHeight: 1.2,
              padding: 18
            }}
          >
            {primaryAction.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
