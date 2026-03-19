import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getHeroImage, getServicesContent } from "@/lib/site-config";
import { FullscreenHero } from "@/components/fullscreen-hero";

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
  const contactNav = dictionary.navigation.find((item) => item.href === "/contact");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <FullscreenHero
        locale={locale}
        direction={dictionary.direction}
        brandName={siteConfig.brand.shopName}
        sinceLabel={dictionary.labels.since}
        logoText={siteConfig.brand.logoText}
        title={servicesContent.title}
        kicker={servicesContent.eyebrow}
        description={servicesContent.subtitle}
        backgroundImageSrc={getHeroImage("services")}
        navigation={dictionary.navigation.map((item) => ({
          label: item.label,
          href: navHref(locale, item.href)
        }))}
        primaryAction={{
          href: navHref(locale, "/booking"),
          label: dictionary.actions.bookNow
        }}
        secondaryAction={
          contactNav
            ? { label: contactNav.label, href: navHref(locale, contactNav.href) }
            : undefined
        }
        localeItems={siteConfig.locales.map((item) => ({
          label: item,
          href: `/${item}/services` as Route,
          isActive: item === locale
        }))}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 56px" }}>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
                style={{
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  padding: 24,
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
