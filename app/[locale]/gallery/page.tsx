import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getGalleryContent } from "@/lib/site-config";
import { FullscreenHero } from "@/components/fullscreen-hero";

type GalleryPageProps = {
  params: Promise<{ locale: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const galleryContent = getGalleryContent(locale);
  const visibleImages = galleryContent.images
    .filter((image) => image.isVisible)
    .sort((left, right) => left.sortOrder - right.sortOrder);
  const contactNav = dictionary.navigation.find((item) => item.href === "/contact");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <FullscreenHero
        locale={locale}
        direction={dictionary.direction}
        brandName={siteConfig.brand.shopName}
        sinceLabel={dictionary.labels.since}
        logoText={siteConfig.brand.logoText}
        title={galleryContent.title}
        kicker={galleryContent.eyebrow}
        description={galleryContent.subtitle}
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
          href: `/${item}/gallery` as Route,
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

              <div
                style={{
                  padding: 22,
                  display: "grid",
                  gap: 12
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
                  {dictionary.gallery.imageLabel} {String(image.sortOrder).padStart(2, "0")}
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "var(--foreground)",
                    lineHeight: 1.7
                  }}
                >
                  {image.caption}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
