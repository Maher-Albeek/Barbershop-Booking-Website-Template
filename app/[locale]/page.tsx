import type { Route } from "next";
import { notFound } from "next/navigation";
import { getHeroImageUrl } from "@/lib/hero-image";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getHomepageContent } from "@/lib/site-config";
import { FullscreenHero } from "@/components/fullscreen-hero";

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
  const firstHighlight = content.highlights[0];
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
        heroImageUrl={heroImageUrl}
        localeItems={siteConfig.locales.map((item) => ({
          label: item,
          href: `/${item}` as Route,
          isActive: item === locale
        }))}
      />
    </main>
  );
}
