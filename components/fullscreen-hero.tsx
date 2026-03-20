import type { Route } from "next";
import Link from "next/link";
import { FullscreenHeroHeader } from "@/components/fullscreen-hero-header";

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

      <FullscreenHeroHeader
        brandName={brandName}
        navigation={navigation}
        localeItems={localeItems}
      />

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
