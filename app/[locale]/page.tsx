import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getHomepageContent } from "@/lib/site-config";

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

  return (
    <main
      lang={locale}
      dir={dictionary.direction}
      style={{
        minHeight: "100vh",
        padding: "32px 20px 56px"
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto"
        }}
      >
        <header
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface)",
            backdropFilter: "blur(18px)",
            borderRadius: 28,
            boxShadow: "var(--shadow)",
            padding: "18px 22px",
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              aria-hidden="true"
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                background:
                  "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                display: "grid",
                placeItems: "center",
                color: "#fffaf4",
                fontWeight: 700,
                letterSpacing: "0.08em"
              }}
            >
              {siteConfig.brand.logoText}
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "var(--muted)"
                }}
              >
                {dictionary.labels.since}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{siteConfig.brand.shopName}</div>
            </div>
          </div>

          <nav
            aria-label={dictionary.labels.primaryNavigation}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {dictionary.navigation.map((item) => (
              <Link key={item.href} href={navHref(locale, item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {siteConfig.locales.map((item) => (
              <Link
                key={item}
                href={`/${item}` as Route}
                style={{
                  border: locale === item ? "1px solid transparent" : "1px solid var(--border)",
                  background:
                    locale === item
                      ? "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))"
                      : "var(--surface-strong)",
                  color: locale === item ? "#fffaf4" : "inherit",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em"
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </header>

        <section
          style={{
            marginTop: 24,
            borderRadius: 36,
            overflow: "hidden",
            boxShadow: "var(--shadow)",
            background:
              "linear-gradient(140deg, rgba(34, 51, 59, 0.95), rgba(61, 38, 21, 0.88) 56%, rgba(139, 94, 60, 0.82))"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 28,
              padding: "48px 28px"
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "rgba(255, 250, 244, 0.14)",
                  border: "1px solid rgba(255, 250, 244, 0.18)",
                  color: "#f7f1e8",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase"
                }}
              >
                {content.hero.kicker}
              </div>

              <h1
                style={{
                  margin: "18px 0 14px",
                  color: "#fffaf4",
                  fontSize: "clamp(2.8rem, 7vw, 5.6rem)",
                  lineHeight: 0.96
                }}
              >
                {content.hero.title}
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: 560,
                  color: "rgba(255, 250, 244, 0.82)",
                  fontSize: 18,
                  lineHeight: 1.7
                }}
              >
                {content.hero.subtitle}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  marginTop: 26
                }}
              >
                <Link
                  href={navHref(locale, "/booking")}
                  style={{
                    padding: "14px 22px",
                    borderRadius: 999,
                    background: "#fffaf4",
                    color: "var(--brand-accent)",
                    fontWeight: 700
                  }}
                >
                  {dictionary.actions.bookNow}
                </Link>
                <Link
                  href={navHref(locale, "/services")}
                  style={{
                    padding: "14px 22px",
                    borderRadius: 999,
                    border: "1px solid rgba(255, 250, 244, 0.26)",
                    color: "#fffaf4"
                  }}
                >
                  {dictionary.actions.viewServices}
                </Link>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 16,
                alignContent: "center"
              }}
            >
              {content.highlights.map((highlight) => (
                <article
                  key={highlight.title}
                  style={{
                    borderRadius: 24,
                    background: "rgba(255, 250, 244, 0.09)",
                    border: "1px solid rgba(255, 250, 244, 0.14)",
                    padding: "20px 18px",
                    color: "#fffaf4"
                  }}
                >
                  <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>{highlight.title}</h2>
                  <p style={{ margin: 0, color: "rgba(255, 250, 244, 0.78)", lineHeight: 1.7 }}>
                    {highlight.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
