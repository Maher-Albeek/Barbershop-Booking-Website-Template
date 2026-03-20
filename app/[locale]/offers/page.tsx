import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHeroImageUrl } from "@/lib/hero-image";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getOffersContent } from "@/lib/site-config";
import { FullscreenHero } from "@/components/fullscreen-hero";

type OffersPageProps = {
  params: Promise<{ locale: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

function isOfferCurrentlyVisible(validFrom: string, validUntil: string) {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startsAt = new Date(`${validFrom}T00:00:00.000Z`);
  const endsAt = new Date(`${validUntil}T23:59:59.999Z`);

  return today >= startsAt && today <= endsAt;
}

export default async function OffersPage({ params }: OffersPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const offersContent = getOffersContent(locale);
  const visibleOffers = offersContent.offers.filter(
    (offer) => offer.isActive && isOfferCurrentlyVisible(offer.validFrom, offer.validUntil)
  );
  const contactNav = dictionary.navigation.find((item) => item.href === "/contact");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <FullscreenHero
        locale={locale}
        direction={dictionary.direction}
        brandName={siteConfig.brand.shopName}
        sinceLabel={dictionary.labels.since}
        logoText={siteConfig.brand.logoText}
        title={offersContent.title}
        kicker={offersContent.eyebrow}
        description={offersContent.subtitle}
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
        heroImageUrl={getHeroImageUrl("offers")}
        localeItems={siteConfig.locales.map((item) => ({
          label: item,
          href: `/${item}/offers` as Route,
          isActive: item === locale
        }))}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 56px" }}>

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

              <div
                style={{
                  padding: 24,
                  display: "grid",
                  gap: 18
                }}
              >
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
                    <h2 style={{ margin: 0, fontSize: 28 }}>{offer.title}</h2>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "var(--muted)",
                      lineHeight: 1.7
                    }}
                  >
                    {offer.description}
                  </p>
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: 16
                  }}
                >
                  <Link
                    href={navHref(locale, "/booking")}
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
      </div>
    </main>
  );
}
