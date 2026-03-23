import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentSectionContainerStyle } from "@/lib/content-background-image";
import { getHeroImageUrl } from "@/lib/hero-image";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import {
  siteConfig,
  getHomepageContent,
  getServicesContent,
  getTeamContent,
  getGalleryContent,
  getOffersContent,
  getContactContent
} from "@/lib/site-config";
import { ContactForm } from "./contact/contact-form";
import { ContactMap } from "./contact/contact-map";
import { FullscreenHero } from "@/components/fullscreen-hero";
import { HorizontalScrollControls } from "@/components/horizontal-scroll-controls";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

type HeroHref =
  | Route
  | {
      pathname: Route;
      query?: Record<string, string>;
      hash?: string;
    };

const sectionByPath: Record<string, string | undefined> = {
  "/services": "services",
  "/team": "team",
  "/gallery": "gallery",
  "/offers": "offers",
  "/contact": "contact",
  "/booking": "booking"
};

function onePageHref(locale: Locale, path: string): HeroHref {
  const pathname = `/${locale}` as Route;
  const hash = sectionByPath[path];

  if (!hash) {
    return pathname;
  }

  return {
    pathname,
    hash
  };
}

function isOfferCurrentlyVisible(validFrom: string, validUntil: string) {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startsAt = new Date(`${validFrom}T00:00:00.000Z`);
  const endsAt = new Date(`${validUntil}T23:59:59.999Z`);

  return today >= startsAt && today <= endsAt;
}

function SectionTitle({
  eyebrow,
  title,
  subtitle
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header
      style={{
        display: "grid",
        gap: 10,
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        alignContent: "start",
        borderRadius: 0,
        border: "1px solid var(--border)",
        background: "rgba(255, 250, 244, 0.78)",
        boxShadow: "var(--shadow)",
        padding: "20px clamp(20px, calc((100vw - 1200px) / 2 + 20px), 240px)"
      }}
    >
      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--muted)"
        }}
      >
        {eyebrow}
      </div>
      <h2 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.05 }}>{title}</h2>
      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{subtitle}</p>
    </header>
  );
}

const fullScreenSectionStyle = {
  display: "grid",
  gap: 18,
  scrollMarginTop: 120,
  minHeight: "100svh",
  alignContent: "start"
} as const;

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const content = getHomepageContent(locale);
  const servicesContent = getServicesContent(locale);
  const teamContent = getTeamContent(locale);
  const galleryContent = getGalleryContent(locale);
  const offersContent = getOffersContent(locale);
  const contactContent = getContactContent(locale);
  const firstHighlight = content.highlights[0];
  const activeServices = servicesContent.services.filter((service) => service.isActive);
  const activeMembers = teamContent.members.filter((member) => member.isActive);
  const teamUsesSlider = activeMembers.length > 3;
  const visibleImages = galleryContent.images
    .filter((image) => image.isVisible)
    .sort((left, right) => left.sortOrder - right.sortOrder);
  const visibleOffers = offersContent.offers.filter(
    (offer) => offer.isActive && isOfferCurrentlyVisible(offer.validFrom, offer.validUntil)
  );
  const contactItems = [
    contactContent.items.phone,
    contactContent.items.email,
    contactContent.items.address,
    contactContent.items.whatsapp
  ].filter((item) => item !== undefined);
  const heroImageUrl = getHeroImageUrl("home");
  const contactNav = dictionary.navigation.find((item) => item.href === "/contact");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <FullscreenHero
        locale={locale}
        direction={dictionary.direction}
        brandName={siteConfig.brand.shopName}
        sinceLabel={dictionary.labels.since}
        logoText={siteConfig.brand.logoText}
        title={content.hero.title}
        kicker={content.hero.kicker}
        description={firstHighlight?.description ?? content.hero.subtitle}
        navigation={dictionary.navigation.map((item) => ({
          label: item.label,
          href: onePageHref(locale, item.href)
        }))}
        primaryAction={{
          href: onePageHref(locale, "/booking"),
          label: dictionary.actions.bookNow
        }}
        secondaryAction={
          contactNav
            ? { label: contactNav.label, href: onePageHref(locale, contactNav.href) }
            : undefined
        }
        heroImageUrl={heroImageUrl}
        localeItems={siteConfig.locales.map((item) => ({
          label: item,
          href: `/${item}` as Route,
          isActive: item === locale
        }))}
      />

      <div style={getContentSectionContainerStyle("services")}>
        <section id="services" style={fullScreenSectionStyle}>
          <SectionTitle
            eyebrow={servicesContent.eyebrow}
            title={servicesContent.title}
            subtitle={servicesContent.subtitle}
          />

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
              paddingBottom: 30
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
                      <h3 style={{ margin: 0, fontSize: 28 }}>{service.name}</h3>
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

                    <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
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
                      href={onePageHref(locale, "/booking")}
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
        </section>
      </div>

      <div style={getContentSectionContainerStyle("team")}>
        <section id="team" style={fullScreenSectionStyle}>
          <SectionTitle
            eyebrow={dictionary.team.eyebrow}
            title={dictionary.team.title}
            subtitle={dictionary.team.subtitle}
          />

          {teamUsesSlider ? (
            <HorizontalScrollControls
              targetId="team-slider-track"
              prevLabel="Show previous team members"
              nextLabel="Show next team members"
            />
          ) : null}

          <section
            id="team-slider-track"
            className={teamUsesSlider ? "hide-horizontal-scrollbar" : undefined}
            style={{
              display: teamUsesSlider ? "flex" : "grid",
              gridTemplateColumns: teamUsesSlider ? undefined : "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
              overflowX: teamUsesSlider ? "auto" : undefined,
              scrollSnapType: teamUsesSlider ? "x mandatory" : undefined,
              paddingBottom: teamUsesSlider ? 8 : undefined,
              width: "100%",
              maxWidth: "100%"
            }}
          >
            {activeMembers.map((member) => (
              <article
                key={member.slug}
                style={{
                  scrollSnapAlign: teamUsesSlider ? "start" : undefined,
                  flex: teamUsesSlider ? "0 0 calc((100% - 36px) / 3)" : undefined,
                  minWidth: teamUsesSlider ? 280 : undefined,
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  overflow: "hidden",
                  display: "grid"
                }}
              >
                <img
                  src={member.imageSrc}
                  alt={member.name}
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    objectFit: "cover",
                    display: "block"
                  }}
                />

                <div style={{ padding: 24, display: "grid", gap: 18 }}>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "grid", gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 28 }}>{member.name}</h3>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {member.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            style={{
                              borderRadius: 999,
                              padding: "8px 12px",
                              background: "rgba(214, 176, 125, 0.22)",
                              color: "var(--brand-accent)",
                              fontSize: 13,
                              fontWeight: 700
                            }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                      {member.bio ?? dictionary.team.bioFallback}
                    </p>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                    <Link
                      href={onePageHref(locale, "/booking")}
                      style={{
                        display: "inline-flex",
                        padding: "13px 18px",
                        borderRadius: 999,
                        background:
                          "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                        color: "#fffaf4",
                        fontWeight: 700
                      }}
                    >
                      {dictionary.team.bookingCta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </section>
      </div>

      <div style={getContentSectionContainerStyle("gallery")}>
        <section id="gallery" style={fullScreenSectionStyle}>
          <SectionTitle
            eyebrow={galleryContent.eyebrow}
            title={galleryContent.title}
            subtitle={galleryContent.subtitle}
          />

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18
            }}
          >
            {visibleImages.map((image, index) => (
              <article
                key={image.slug}
                style={{
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  overflow: "hidden",
                  display: "grid"
                }}
              >
                {image.sourceHref ? (
                  <a href={image.sourceHref} target="_blank" rel="noreferrer">
                    <img
                      src={image.imageSrc}
                      alt={image.alt}
                      style={{
                        width: "100%",
                        aspectRatio: index === 0 ? "4 / 5" : index % 3 === 0 ? "1 / 1" : "4 / 3",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </a>
                ) : (
                  <img
                    src={image.imageSrc}
                    alt={image.alt}
                    style={{
                      width: "100%",
                      aspectRatio: index === 0 ? "4 / 5" : index % 3 === 0 ? "1 / 1" : "4 / 3",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                )}

                <div style={{ padding: 22, display: "grid", gap: 12 }}>
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--muted)"
                    }}
                  >
                    {dictionary.gallery.imageLabel} {String(image.sortOrder).padStart(2, "0")}
                  </div>

                  <p style={{ margin: 0, color: "var(--foreground)", lineHeight: 1.7 }}>
                    {image.caption}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </section>
      </div>

      <div style={getContentSectionContainerStyle("offers")}>
        <section id="offers" style={fullScreenSectionStyle}>
          <SectionTitle
            eyebrow={offersContent.eyebrow}
            title={offersContent.title}
            subtitle={offersContent.subtitle}
          />

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18
            }}
          >
            {visibleOffers.map((offer) => (
              <article
                key={offer.slug}
                style={{
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  overflow: "hidden",
                  display: "grid"
                }}
              >
                {offer.imageSrc ? (
                  <img
                    src={offer.imageSrc}
                    alt={offer.title}
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                ) : null}

                <div style={{ padding: 24, display: "grid", gap: 18 }}>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "grid", gap: 8 }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifySelf: "start",
                          borderRadius: 999,
                          padding: "8px 12px",
                          background: "rgba(214, 176, 125, 0.22)",
                          color: "var(--brand-accent)",
                          fontSize: 13,
                          fontWeight: 700
                        }}
                      >
                        {dictionary.offers.validUntilLabel} {offer.validUntil}
                      </div>
                      <h3 style={{ margin: 0, fontSize: 28 }}>{offer.title}</h3>
                    </div>

                    <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                      {offer.description}
                    </p>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                    <Link
                      href={onePageHref(locale, "/booking")}
                      style={{
                        display: "inline-flex",
                        padding: "13px 18px",
                        borderRadius: 999,
                        background:
                          "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                        color: "#fffaf4",
                        fontWeight: 700
                      }}
                    >
                      {dictionary.offers.bookingCta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </section>
      </div>

      <div style={getContentSectionContainerStyle("contact")}>
        <section
          id="contact"
          style={{ ...fullScreenSectionStyle, gap: 24 }}
        >
          <SectionTitle
            eyebrow={contactContent.eyebrow}
            title={contactContent.title}
            subtitle={contactContent.subtitle}
          />

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
                <h3 style={{ margin: 0, fontSize: 30 }}>{dictionary.contact.title}</h3>
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
                      <a href={item.href} style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.5 }}>
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

              <Link
                href={onePageHref(locale, "/booking")}
                style={{
                  display: "inline-flex",
                  justifyContent: "center",
                  padding: "13px 18px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                  color: "#fffaf4",
                  fontWeight: 700,
                  justifySelf: "start"
                }}
              >
                {dictionary.contact.bookingCta}
              </Link>
            </article>

            <article
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
                  {contactContent.form.eyebrow}
                </div>
                <h3 style={{ margin: 0, fontSize: 30 }}>{contactContent.form.title}</h3>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                  {contactContent.form.description}
                </p>
              </div>

              <ContactForm locale={locale} labels={contactContent.form} />

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
                <h3 style={{ margin: 0, fontSize: 30 }}>{contactContent.map.title}</h3>
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
        </section>
      </div>

      <div style={getContentSectionContainerStyle("booking")}>
        <section id="booking" style={fullScreenSectionStyle}>
          <SectionTitle
            eyebrow={dictionary.booking.eyebrow}
            title={dictionary.booking.title}
            subtitle={dictionary.booking.subtitle}
          />

          <article
            style={{
              borderRadius: 28,
              border: "1px solid var(--border)",
              background: "var(--surface-strong)",
              boxShadow: "var(--shadow)",
              padding: 24,
              display: "grid",
              gap: 16,
              maxWidth: 760
            }}
          >
            <h3 style={{ margin: 0, fontSize: 30 }}>{dictionary.booking.serviceStepTitle}</h3>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
              {dictionary.booking.detailsDescription}
            </p>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
              {dictionary.booking.privacyNote}
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
                fontWeight: 700,
                justifySelf: "start"
              }}
            >
              {dictionary.actions.bookNow}
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}
