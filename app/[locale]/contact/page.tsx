import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const contactContent = siteConfig.contact[locale];
  const contactItems = [
    contactContent.items.phone,
    contactContent.items.email,
    contactContent.items.address,
    contactContent.items.whatsapp
  ].filter((item) => item !== undefined);

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
                href={`/${item}/contact` as Route}
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
          <div
            style={{
              maxWidth: 780
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
              {contactContent.eyebrow}
            </div>

            <h1
              style={{
                margin: "18px 0 14px",
                color: "#fffaf4",
                fontSize: "clamp(2.5rem, 6vw, 4.8rem)",
                lineHeight: 1
              }}
            >
              {contactContent.title}
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(255, 250, 244, 0.82)",
                fontSize: 18,
                lineHeight: 1.7
              }}
            >
              {contactContent.subtitle}
            </p>
          </div>
        </section>

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
            gap: 18
          }}
        >
          <article
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
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--muted)"
                }}
              >
                {dictionary.contact.directLabel}
              </div>
              <h2 style={{ margin: 0, fontSize: 30 }}>{dictionary.contact.title}</h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16
              }}
            >
              {contactItems.map((item) => (
                <article
                  key={item.label}
                  style={{
                    borderRadius: 22,
                    border: "1px solid var(--border)",
                    background: "rgba(214, 176, 125, 0.12)",
                    padding: 18,
                    display: "grid",
                    gap: 10
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--muted)"
                    }}
                  >
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        fontSize: 20,
                        fontWeight: 700
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{item.value}</div>
                  )}
                </article>
              ))}
            </div>
          </article>

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
            <div style={{ display: "grid", gap: 10 }}>
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--muted)"
                }}
              >
                {dictionary.contact.visitLabel}
              </div>
              <h2 style={{ margin: 0, fontSize: 30 }}>{dictionary.contact.visitTitle}</h2>
            </div>

            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
              {contactContent.visitNote}
            </p>

            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
              {contactContent.responseNote}
            </p>

            <Link
              href={navHref(locale, "/booking")}
              style={{
                display: "inline-flex",
                justifyContent: "center",
                padding: "13px 18px",
                borderRadius: 999,
                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                color: "#fffaf4",
                fontWeight: 700
              }}
            >
              {dictionary.contact.bookingCta}
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}
