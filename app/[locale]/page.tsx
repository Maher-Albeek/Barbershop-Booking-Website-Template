import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { siteConfig, getHeroImage, getHomepageContent } from "@/lib/site-config";
import { HeroHeader } from "@/components/hero-header";

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
  const heroImageSrc = getHeroImage("home");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          overflow: "hidden",
          color: "#fffaf4"
        }}
      >
        <Image
          src={heroImageSrc}
          alt=""
          fill
          priority
          aria-hidden="true"
          style={{ objectFit: "cover", objectPosition: "center", zIndex: 0 }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(120deg, rgba(4, 9, 14, 0.74), rgba(8, 12, 19, 0.46) 46%, rgba(20, 11, 6, 0.7))"
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(circle at 78% 20%, rgba(232, 183, 122, 0.22), transparent 34%)"
          }}
        />
        <HeroHeader
          brandName={siteConfig.brand.shopName}
          navItems={dictionary.navigation.map((item) => ({
            href: navHref(locale, item.href),
            label: item.label
          }))}
          localeItems={locales.map((l) => ({
            href: `/${l}` as Route,
            label: l.toUpperCase(),
            isActive: l === locale
          }))}
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
