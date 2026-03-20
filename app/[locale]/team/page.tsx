import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHeroImageUrl } from "@/lib/hero-image";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getTeamContent } from "@/lib/site-config";
import { FullscreenHero } from "@/components/fullscreen-hero";

type TeamPageProps = {
  params: Promise<{ locale: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const teamContent = getTeamContent(locale);
  const activeMembers = teamContent.members.filter((member) => member.isActive);
  const contactNav = dictionary.navigation.find((item) => item.href === "/contact");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <FullscreenHero
        locale={locale}
        direction={dictionary.direction}
        brandName={siteConfig.brand.shopName}
        sinceLabel={dictionary.labels.since}
        logoText={siteConfig.brand.logoText}
        title={dictionary.team.title}
        kicker={dictionary.team.eyebrow}
        description={dictionary.team.subtitle}
        navigation={dictionary.navigation.map((item) => ({
          label: item.label,
          href: navHref(locale, item.href)
        }))}
        primaryAction={{
          href: navHref(locale, "/booking"),
          label: dictionary.team.bookingCta
        }}
        secondaryAction={
          contactNav
            ? { label: contactNav.label, href: navHref(locale, contactNav.href) }
            : undefined
        }
        heroImageUrl={getHeroImageUrl("team")}
        localeItems={siteConfig.locales.map((item) => ({
          label: item,
          href: `/${item}/team` as Route,
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
          {activeMembers.map((member) => (
            <article
              key={member.slug}
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
                src={member.imageSrc}
                alt={member.name}
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  objectFit: "cover",
                  display: "block"
                }}
              />

              <div
                style={{
                  padding: 24,
                  display: "grid",
                  gap: 18
                }}
              >
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={{ display: "grid", gap: 8 }}>
                    <h2 style={{ margin: 0, fontSize: 28 }}>{member.name}</h2>
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

                  <p
                    style={{
                      margin: 0,
                      color: "var(--muted)",
                      lineHeight: 1.7
                    }}
                  >
                    {member.bio ?? dictionary.team.bioFallback}
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
                    {dictionary.team.bookingCta}
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
