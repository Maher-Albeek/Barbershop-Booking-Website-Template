import type { Route } from "next";
import Link from "next/link";

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
  localeItems
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
          "linear-gradient(120deg, rgba(4, 9, 14, 0.74), rgba(8, 12, 19, 0.46) 46%, rgba(20, 11, 6, 0.7)), radial-gradient(circle at 78% 20%, rgba(232, 183, 122, 0.22), transparent 34%), url('/images/hero-barbershop.jpg') center/cover no-repeat"
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
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 18,
          padding: "22px clamp(14px, 4vw, 44px)"
        }}
      >
        <nav
          style={{
            display: "flex",
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                style={{
                  color: "rgba(255, 250, 244, 0.9)",
                  fontSize: 15
                }}
              >
                {secondaryAction.label}
              </Link>
            ) : null}
            <Link
              href={primaryAction.href}
              style={{
                background: "#fffaf4",
                color: "#17120f",
                borderRadius: 999,
                padding: "9px 16px",
                fontSize: 14,
                fontWeight: 700
              }}
            >
              {primaryAction.label}
            </Link>
          </div>

          {localeItems && localeItems.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {localeItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    border: item.isActive
                      ? "1px solid rgba(255, 250, 244, 0.72)"
                      : "1px solid rgba(255, 250, 244, 0.28)",
                    background: item.isActive ? "rgba(255, 250, 244, 0.2)" : "rgba(0, 0, 0, 0.2)",
                    color: "#fffaf4",
                    borderRadius: 999,
                    padding: "6px 11px",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em"
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
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
