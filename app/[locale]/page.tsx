import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHeroImageUrl } from "@/lib/hero-image";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getHomepageContent } from "@/lib/site-config";
import { LanguageSwitcher } from "@/components/language-switcher";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const content = getHomepageContent(locale);
  const firstHighlight = content.highlights[0];
  const heroImageUrl = getHeroImageUrl("home");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <section
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
            aria-label={dictionary.labels.primaryNavigation}
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 18,
              fontSize: 15,
              color: "rgba(255, 250, 244, 0.86)"
            }}
          >
            {dictionary.navigation.map((item) => (
              <Link key={item.href} href={navHref(locale, item.href)}>
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
            {siteConfig.brand.shopName}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LanguageSwitcher
              items={siteConfig.locales.map((item) => ({
                label: item,
                href: `/${item}` as Route,
                isActive: item === locale
              }))}
            />
            <Link
              href={navHref(locale, "/contact")}
              style={{
                color: "rgba(255, 250, 244, 0.9)",
                fontSize: 15
              }}
            >
              {dictionary.navigation.find((item) => item.href === "/contact")?.label ??
                content.hero.kicker}
            </Link>
            <Link
              href={navHref(locale, "/booking")}
              style={{
                background: "#fffaf4",
                color: "#17120f",
                borderRadius: 999,
                padding: "9px 16px",
                fontSize: 14,
                fontWeight: 700
              }}
            >
              {dictionary.actions.bookNow}
            </Link>
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
          <div style={{ maxWidth: 840 }}>
            <div
              style={{
                marginBottom: 16,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255, 250, 244, 0.72)"
              }}
            >
              {dictionary.labels.since} {siteConfig.brand.logoText}
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.8rem, 8.8vw, 6.4rem)",
                lineHeight: 0.92,
                color: "#fffaf4",
                textWrap: "balance"
              }}
            >
              {content.hero.title}
            </h1>
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
              {firstHighlight?.description ?? content.hero.subtitle}
            </p>
            <Link
              href={navHref(locale, "/booking")}
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
              {dictionary.actions.bookNow}
            </Link>
          </div>
        </div>

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
      </section>
    </main>
  );
}
