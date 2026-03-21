import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHeroImageUrl } from "@/lib/hero-image";
import { getContentSectionContainerStyle } from "@/lib/content-background-image";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getContactContent } from "@/lib/site-config";
import { ContactForm } from "./contact-form";
import { ContactMap } from "./contact-map";
import { FullscreenHero } from "@/components/fullscreen-hero";

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
  const contactContent = getContactContent(locale);
  const contactItems = [
    contactContent.items.phone,
    contactContent.items.email,
    contactContent.items.address,
    contactContent.items.whatsapp
  ].filter((item) => item !== undefined);
  const servicesNav = dictionary.navigation.find((item) => item.href === "/services");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <FullscreenHero
        locale={locale}
        direction={dictionary.direction}
        brandName={siteConfig.brand.shopName}
        sinceLabel={dictionary.labels.since}
        logoText={siteConfig.brand.logoText}
        title={contactContent.title}
        kicker={contactContent.eyebrow}
        description={contactContent.subtitle}
        navigation={dictionary.navigation.map((item) => ({
          label: item.label,
          href: navHref(locale, item.href)
        }))}
        primaryAction={{
          href: navHref(locale, "/booking"),
          label: dictionary.actions.bookNow
        }}
        secondaryAction={
          servicesNav
            ? { label: servicesNav.label, href: navHref(locale, servicesNav.href) }
            : undefined
        }
        heroImageUrl={getHeroImageUrl("contact")}
        localeItems={siteConfig.locales.map((item) => ({
          label: item,
          href: `/${item}/contact` as Route,
          isActive: item === locale
        }))}
      />

      <div style={getContentSectionContainerStyle("contact")}>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
                        fontWeight: 700,
                        lineHeight: 1.5
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.5 }}>
                      {item.value}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <article
              style={{
                borderRadius: 22,
                border: "1px solid var(--border)",
                background: "rgba(214, 176, 125, 0.08)",
                padding: 18,
                display: "grid",
                gap: 14
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--muted)"
                  }}
                >
                  {contactContent.workingHoursTitle}
                </div>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                  {contactContent.workingHoursNote}
                </p>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {contactContent.workingHours.map((entry) => (
                  <div
                    key={entry.days}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                      paddingTop: 10,
                      borderTop: "1px solid var(--border)"
                    }}
                  >
                    <strong>{entry.days}</strong>
                    <span>{entry.hours}</span>
                  </div>
                ))}
              </div>
            </article>
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

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 18,
            alignItems: "start"
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
                {contactContent.form.eyebrow}
              </div>
              <h2 style={{ margin: 0, fontSize: 30 }}>{contactContent.form.title}</h2>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                {contactContent.form.description}
              </p>
            </div>

            <ContactForm locale={locale} labels={contactContent.form} />
          </article>

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
                {contactContent.map.eyebrow}
              </div>
              <h2 style={{ margin: 0, fontSize: 30 }}>{contactContent.map.title}</h2>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                {contactContent.map.description}
              </p>
            </div>

            {contactContent.map.isVisible ? (
              <ContactMap
                shopName={siteConfig.brand.shopName}
                embedUrl={contactContent.map.embedUrl}
                directionsHref={contactContent.map.directionsHref}
                directionsLabel={contactContent.map.directionsLabel}
                consentTitle={contactContent.map.consentTitle}
                consentDescription={contactContent.map.consentDescription}
                consentButtonLabel={contactContent.map.consentButtonLabel}
                privacyNotice={contactContent.map.privacyNotice}
              />
            ) : (
              <div
                style={{
                  borderRadius: 24,
                  border: "1px solid var(--border)",
                  minHeight: 220,
                  padding: 24,
                  background: "rgba(214, 176, 125, 0.1)",
                  display: "grid",
                  gap: 12,
                  alignContent: "center"
                }}
              >
                <strong>Map disabled by the shop</strong>
                <a href={contactContent.map.directionsHref} target="_blank" rel="noreferrer">
                  {contactContent.map.directionsLabel}
                </a>
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
