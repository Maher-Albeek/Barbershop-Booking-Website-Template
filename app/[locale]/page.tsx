import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentSectionContainerStyle } from "@/lib/content-background-image";
import { getActiveEmployees } from "@/lib/employee-fetch";
import { listBookings } from "@/lib/booking";
import { getHeroImageUrl } from "@/lib/hero-image";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import {
  siteConfig,
  getHomepageContent,
  getServicesContent,
  getGalleryContent,
  getOffersContent,
  getContactContent
} from "@/lib/site-config";
import {
  getPrimaryShopId,
  getServicesFromDatabase,
  getVisibleGalleryImages,
  getOffersFromDatabase
} from "@/lib/admin-data";
import { ContactForm } from "./contact/contact-form";
import { ContactMap } from "./contact/contact-map";
import { BackToTopButton } from "@/components/back-to-top-button";
import { FloatingCookieSettingsButton } from "@/components/floating-cookie-settings-button";
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button";
import { AnimatedCounter } from "@/components/animated-counter";
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
  "/contact": "contact"
};

function onePageHref(locale: Locale, path: string): HeroHref {
  if (path === "/booking") {
    return navHref(locale, "/booking");
  }

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
        minHeight:"0svh",
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

type CounterIconKind = "staff" | "customers" | "appointments" | "total";

function CounterIcon({ kind }: { kind: CounterIconKind }) {
  const iconStyle = {
    fontSize: "3rem",
    color: "#c46d25"
  } as const;

  const iconClassMap: Record<CounterIconKind, string> = {
    staff: "fa-thin fa-users",
    customers: "fa-thin fa-people-group",
    appointments: "fa-thin fa-calendar",
    total: "fa-thin fa-chart-bar"
  };

  return <i className={`fa-solid ${iconClassMap[kind]}`} style={iconStyle} />;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const content = getHomepageContent(locale);
  const servicesContent = getServicesContent(locale);
  const galleryContent = getGalleryContent(locale);
  const offersContent = getOffersContent(locale);
  const contactContent = getContactContent(locale);
  const shopId = await getPrimaryShopId();
  const dbEmployees = await getActiveEmployees();
  const firstHighlight = content.highlights[0];
  
  // Fetch active services from database
  const activeServices = (shopId ? await getServicesFromDatabase(shopId) : []).filter(
    (service) => service.isActive
  );
  
  const activeMembers = dbEmployees.map((emp) => ({
    slug: `employee-${emp.id}`,
    isActive: emp.isActive,
    imageSrc: emp.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    bookingServiceSlugs: [],
    specialties: [],
    name: emp.name,
    bio: emp.bio,
    position: emp.position,
    instagramUrl: emp.instagramUrl
  }));
  const teamUsesSlider = activeMembers.length > 3;
  
  // Fetch visible gallery images from database
  const visibleImages = shopId ? await getVisibleGalleryImages(shopId) : [];
  
  // Fetch active offers from database
  const visibleOffers = (shopId ? await getOffersFromDatabase(shopId) : []).filter(
    (offer) => offer.isActive
  );
  
  const bookings = listBookings();
  const validBookings = bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "completed"
  );
  const dailyBookingsMap = new Map<string, number>();
  const dailyCustomersMap = new Map<string, Set<string>>();

  for (const booking of validBookings) {
    dailyBookingsMap.set(booking.date, (dailyBookingsMap.get(booking.date) ?? 0) + 1);

    if (!dailyCustomersMap.has(booking.date)) {
      dailyCustomersMap.set(booking.date, new Set<string>());
    }

    dailyCustomersMap.get(booking.date)?.add(booking.email || booking.customerName);
  }

  const maxDailyBookings = [...dailyBookingsMap.values()].reduce(
    (max, current) => Math.max(max, current),
    0
  );
  const maxDailyCustomers = [...dailyCustomersMap.values()].reduce(
    (max, customers) => Math.max(max, customers.size),
    0
  );
  const employeeCount =
    siteConfig.homepageCounterOverrides.employees ?? dbEmployees.length;
  const maxCustomersDailyCount =
    siteConfig.homepageCounterOverrides.maxCustomersDaily ?? maxDailyCustomers;
  const maxAppointmentsDailyCount =
    siteConfig.homepageCounterOverrides.maxAppointmentsDaily ?? maxDailyBookings;
  const allBookingsCount =
    siteConfig.homepageCounterOverrides.allBookings ?? bookings.length;
  const counterLabelsByLocale = {
    de: ["Mitarbeiter", " Kunden taeglich", " Termine taeglich", "Alle Buchungen"],
    en: ["employees", " customers daily", " appointments daily", "All bookings"],
    ar: ["الموظفين", " عدد عملاء يوميا", " عدد مواعيد يوميا", "جميع الحجوزات"]
  } as const;
  const counterItems = [
    { icon: "staff" as const, value: employeeCount, label: counterLabelsByLocale[locale][0] },
    { icon: "customers" as const, value: maxCustomersDailyCount, label: counterLabelsByLocale[locale][1] },
    { icon: "appointments" as const, value: maxAppointmentsDailyCount, label: counterLabelsByLocale[locale][2] },
    { icon: "total" as const, value: allBookingsCount, label: counterLabelsByLocale[locale][3] }
  ];
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
        <section id="services" style={{ ...fullScreenSectionStyle, display: "flex", flexDirection: "column" }}>
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
              marginTop: "auto",
              marginBottom: "auto",
              paddingTop: 30,
              paddingBottom: 30
            }}
          >
            {activeServices.map((service) => {
              return (
                <article
                  key={service.id}
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
                    <h3 style={{ margin: 0, fontSize: 28 }}>{service.name}</h3>
                    {service.description ? (
                      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                        {service.description}
                      </p>
                    ) : null}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {service.durationMinutes ? (
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
                          {service.durationMinutes} min
                        </span>
                      ) : null}
                      {service.price !== null && service.price !== undefined ? (
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
                          {service.price.toFixed(2)}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid var(--border)",
                      paddingTop: 16,
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap"
                    }}
                  >
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
                  aspectRatio: "4 / 5",
                  borderRadius: 28,
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  background: "#101010",
                  boxShadow: "var(--shadow)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end"
                }}
              >
                <img
                  src={member.imageSrc}
                  alt={member.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    margin: 16,
                    width: "calc(100% - 32px)",
                    padding: 18,
                    display: "grid",
                    gap: 14,
                    borderRadius: 20,
                    border: "1px solid rgba(255, 255, 255, 0.24)",
                    background: "linear-gradient(145deg, rgba(18, 18, 18, 0.5), rgba(18, 18, 18, 0.32))",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)"
                  }}
                >
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "grid", gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 28, color: "#fffaf4" }}>{member.name}</h3>
                      {member.position ? (
                        <p
                          style={{
                            margin: 0,
                            color: "rgba(255, 250, 244, 0.92)",
                            fontSize: 14,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em"
                          }}
                        >
                          {member.position}
                        </p>
                      ) : null}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {member.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            style={{
                              borderRadius: 999,
                              padding: "8px 12px",
                              background: "rgba(255, 255, 255, 0.18)",
                              color: "#fffaf4",
                              fontSize: 13,
                              fontWeight: 700
                            }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p style={{ margin: 0, color: "rgba(255, 250, 244, 0.9)", lineHeight: 1.7 }}>
                      {member.bio ?? dictionary.team.bioFallback}
                    </p>

                    {member.instagramUrl ? (
                      <a
                        href={member.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: "fit-content",
                          borderRadius: 999,
                          padding: "8px 12px",
                          border: "1px solid rgba(255, 255, 255, 0.34)",
                          background: "rgba(255, 255, 255, 0.12)",
                          color: "#fffaf4",
                          fontWeight: 700,
                          fontSize: 13,
                          textDecoration: "none"
                        }}
                      >
                        Instagram
                      </a>
                    ) : null}
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
            {visibleImages.map((image) => (
              <article
                key={image.id}
                style={{
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  overflow: "hidden",
                  display: "grid"
                }}
              >
                <img
                  src={image.imageUrl}
                  alt={image.description || `Gallery image ${image.id}`}
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    objectFit: "cover",
                    display: "block"
                  }}
                />

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
                key={offer.id}
                style={{
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  overflow: "hidden",
                  display: "grid"
                }}
              >
                {offer.avatar ? (
                  <img
                    src={offer.avatar}
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
                      <h3 style={{ margin: 0, fontSize: 28 }}>{offer.title}</h3>
                      {offer.price !== null && offer.price !== undefined ? (
                        <div style={{ color: "var(--brand-accent)", fontWeight: 700 }}>
                          {offer.price.toFixed(2)}
                        </div>
                      ) : null}
                    </div>

                    {offer.description && (
                      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                        {offer.description}
                      </p>
                    )}
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

      <section
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          marginTop: 60,
          marginBottom: 60,
          background: "#efefef",
          borderTop: "1px solid #e4e4e4",
          borderBottom: "1px solid #e4e4e4",
          padding: "54px clamp(20px, calc((100vw - 1200px) / 2 + 20px), 240px)"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 28,
            alignItems: "start"
          }}
        >
          {counterItems.map((item) => (
            <article
              key={item.label}
              style={{
                display: "grid",
                gap: 16,
                justifyItems: "center",
                textAlign: "center",
                alignContent: "start"
              }}
            >
              <CounterIcon kind={item.icon} />
              <strong style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 2.6rem)", lineHeight: 1 }}>
                <AnimatedCounter value={item.value} suffix="+" locale={locale} />
              </strong>
              <div style={{ color: "#1f2a37", fontSize: "clamp(1.15rem, 2.1vw, 1.6rem)" }}>{item.label}</div>
            </article>
          ))}
        </div>
      </section>

      <div style={getContentSectionContainerStyle("contact")}>
        <section
          id="contact"
          style={{ ...fullScreenSectionStyle, gap: 24, minHeight: "auto" }}
        >
          <SectionTitle
            eyebrow={contactContent.eyebrow}
            title={contactContent.title}
            subtitle={contactContent.subtitle}
          />

          <section
            style={{
              display: "grid",
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

      {contactContent.items.whatsapp?.href ? (
        <FloatingWhatsAppButton
          href={contactContent.items.whatsapp.href}
          label={contactContent.items.whatsapp.label}
        />
      ) : null}
      <BackToTopButton />
      <FloatingCookieSettingsButton label={dictionary.cookies.openSettings} />
    </main>
  );
}
