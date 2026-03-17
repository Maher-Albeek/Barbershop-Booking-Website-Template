import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

type BookingPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const [{ locale }, { service }] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const servicesContent = siteConfig.services[locale];
  const activeServices = servicesContent.services.filter((item) => item.isActive);
  const selectedService = activeServices.find((item) => item.slug === service);

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
                href={`/${item}/booking` as Route}
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
              "linear-gradient(140deg, rgba(34, 51, 59, 0.95), rgba(61, 38, 21, 0.88) 56%, rgba(139, 94, 60, 0.82))",
            padding: "42px 28px 34px"
          }}
        >
          <div style={{ maxWidth: 760 }}>
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
              {dictionary.booking.eyebrow}
            </div>

            <h1
              style={{
                margin: "18px 0 14px",
                color: "#fffaf4",
                fontSize: "clamp(2.5rem, 6vw, 4.8rem)",
                lineHeight: 1
              }}
            >
              {dictionary.booking.title}
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(255, 250, 244, 0.82)",
                fontSize: 18,
                lineHeight: 1.7
              }}
            >
              {dictionary.booking.subtitle}
            </p>
          </div>
        </section>

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.7fr) minmax(280px, 0.9fr)",
            gap: 18
          }}
        >
          <form
            method="get"
            style={{
              borderRadius: 28,
              border: "1px solid var(--border)",
              background: "var(--surface-strong)",
              boxShadow: "var(--shadow)",
              padding: 24,
              display: "grid",
              gap: 24
            }}
          >
            <section style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--muted)"
                  }}
                >
                  {dictionary.booking.serviceStepLabel}
                </div>
                <h2 style={{ margin: 0, fontSize: 30 }}>{dictionary.booking.serviceStepTitle}</h2>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                  {dictionary.booking.serviceStepDescription}
                </p>
              </div>

              <fieldset
                style={{
                  margin: 0,
                  padding: 0,
                  border: "none",
                  display: "grid",
                  gap: 14
                }}
              >
                <legend
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 4
                  }}
                >
                  {dictionary.booking.selectServiceLabel}
                </legend>

                {activeServices.map((item) => {
                  const isSelected = item.slug === selectedService?.slug;
                  const priceLabel =
                    item.pricing === "variable"
                      ? dictionary.services.variablePriceLabel
                      : `${dictionary.services.fixedPriceLabel}: ${item.priceLabel}`;

                  return (
                    <label
                      key={item.slug}
                      htmlFor={item.slug}
                      style={{
                        display: "grid",
                        gap: 10,
                        padding: 18,
                        borderRadius: 22,
                        border: isSelected
                          ? "1px solid var(--brand-accent)"
                          : "1px solid var(--border)",
                        background: isSelected ? "rgba(214, 176, 125, 0.14)" : "var(--surface)"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <input
                            id={item.slug}
                            type="radio"
                            name="service"
                            value={item.slug}
                            defaultChecked={isSelected}
                          />
                          <strong style={{ fontSize: 22 }}>{item.name}</strong>
                        </div>

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
                          {item.durationLabel}
                        </span>
                      </div>

                      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                        {item.description}
                      </p>

                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700
                        }}
                      >
                        {priceLabel}
                      </div>
                    </label>
                  );
                })}
              </fieldset>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  alignItems: "center"
                }}
              >
                <p style={{ margin: 0, color: "var(--muted)" }}>{dictionary.booking.serviceHint}</p>
                <button
                  type="submit"
                  style={{
                    padding: "13px 18px",
                    borderRadius: 999,
                    border: "none",
                    background:
                      "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                    color: "#fffaf4",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {dictionary.booking.selectServiceLabel}
                </button>
              </div>
            </section>

            <section
              aria-disabled={!selectedService}
              style={{
                display: "grid",
                gap: 14,
                paddingTop: 24,
                borderTop: "1px solid var(--border)",
                opacity: selectedService ? 1 : 0.52
              }}
            >
              <h3 style={{ margin: 0, fontSize: 24 }}>{dictionary.booking.detailsTitle}</h3>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                {dictionary.booking.detailsDescription}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12
                }}
              >
                {[
                  dictionary.booking.employeeStep,
                  dictionary.booking.timeStep,
                  dictionary.booking.customerStep
                ].map((step) => (
                  <div
                    key={step}
                    style={{
                      borderRadius: 18,
                      border: "1px dashed var(--border)",
                      padding: 16,
                      background: "var(--surface)"
                    }}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </section>
          </form>

          <aside
            style={{
              borderRadius: 28,
              border: "1px solid var(--border)",
              background: "var(--surface-strong)",
              boxShadow: "var(--shadow)",
              padding: 24,
              display: "grid",
              gap: 18,
              alignContent: "start"
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--muted)"
                }}
              >
                {selectedService ? dictionary.booking.serviceStepLabel : dictionary.booking.eyebrow}
              </div>
              <h2 style={{ margin: "10px 0 8px", fontSize: 28 }}>
                {selectedService
                  ? selectedService.name
                  : dictionary.booking.noSelectionTitle}
              </h2>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                {selectedService
                  ? selectedService.description
                  : dictionary.booking.noSelectionDescription}
              </p>
            </div>

            {selectedService ? (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  padding: 18,
                  borderRadius: 20,
                  background: "var(--surface)"
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--muted)"
                    }}
                  >
                    {dictionary.services.durationLabel}
                  </div>
                  <strong>{selectedService.durationLabel}</strong>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--muted)"
                    }}
                  >
                    {dictionary.booking.selectServiceLabel}
                  </div>
                  <strong>
                    {selectedService.pricing === "variable"
                      ? dictionary.services.variablePriceLabel
                      : `${dictionary.services.fixedPriceLabel}: ${selectedService.priceLabel}`}
                  </strong>
                </div>
              </div>
            ) : null}

            <div
              style={{
                borderRadius: 20,
                background: "rgba(214, 176, 125, 0.18)",
                padding: 18,
                color: "var(--brand-accent)",
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              {dictionary.booking.privacyNote}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
