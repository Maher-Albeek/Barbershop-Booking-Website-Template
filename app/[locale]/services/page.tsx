import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getServicesContent } from "@/lib/site-config";

type ServicesPageProps = {
  params: Promise<{ locale: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

function bookingHref(locale: Locale, service: string): Route {
  return `/${locale}/booking?service=${encodeURIComponent(service)}` as Route;
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const servicesContent = getServicesContent(locale);
  const activeServices = servicesContent.services.filter((service) => service.isActive);

  return (
    <main
      className="page-main"
      lang={locale}
      dir={dictionary.direction}
      style={{ minHeight: "100vh" }}
    >
      <div className="page-container">
        <header
          className="page-header"
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface)",
            backdropFilter: "blur(18px)",
            boxShadow: "var(--shadow)",
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}
        >
          <div className="page-brand" style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
            className="page-nav"
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

          <div className="page-locale-switcher" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {siteConfig.locales.map((item) => (
              <Link
                key={item}
                href={`/${item}/services` as Route}
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
          className="hero-panel"
          style={{
            marginTop: 24,
            overflow: "hidden",
            boxShadow: "var(--shadow)",
            background:
              "linear-gradient(140deg, rgba(34, 51, 59, 0.95), rgba(61, 38, 21, 0.88) 56%, rgba(139, 94, 60, 0.82))"
          }}
        >
          <div
            style={{
              maxWidth: 760
            }}
          >
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
              {servicesContent.eyebrow}
            </div>

            <h1
              className="hero-title"
              style={{
                margin: "18px 0 14px",
                color: "#fffaf4"
              }}
            >
              {servicesContent.title}
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(255, 250, 244, 0.82)",
                fontSize: 18,
                lineHeight: 1.7
              }}
            >
              {servicesContent.subtitle}
            </p>
          </div>
        </section>

        <section
          className="auto-grid-260 mobile-stack"
          style={{
            marginTop: 24,
            display: "grid",
            gap: 18
          }}
        >
          {activeServices.map((service) => {
            const priceLabel =
              service.pricing === "variable"
                ? dictionary.services.variablePriceLabel
                : `${dictionary.services.fixedPriceLabel}: ${service.priceLabel}`;

            return (
              <article
                key={service.slug}
                className="surface-panel surface-panel-grid"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  display: "grid",
                  gap: 18
                }}
              >
                <div style={{ display: "grid", gap: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap"
                    }}
                  >
                    <h2 style={{ margin: 0, fontSize: 28 }}>{service.name}</h2>
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "8px 12px",
                        background: "rgba(214, 176, 125, 0.22)",
                        color: "var(--brand-accent)",
                        fontSize: 13,
                        fontWeight: 700
                      }}
                    >
                      {service.durationLabel}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "var(--muted)",
                      lineHeight: 1.7
                    }}
                  >
                    {service.description}
                  </p>
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ display: "grid", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: "var(--muted)"
                      }}
                    >
                      {dictionary.services.durationLabel}
                    </span>
                    <strong>{priceLabel}</strong>
                  </div>

                  <Link
                    href={bookingHref(locale, service.slug)}
                    style={{
                      padding: "13px 18px",
                      borderRadius: 999,
                      background:
                        "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                      color: "#fffaf4",
                      fontWeight: 700
                    }}
                  >
                    {dictionary.services.bookingCta}
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
