import { getHeroImageUrl, type HeroImageKey } from "@/lib/hero-image";
import { getContentBackgroundImageUrl } from "@/lib/content-background-image";
import { HeroImageManager } from "../_hero-image-manager";
import { surfaceCardStyle } from "../_components";

type PageHeroEditorProps = {
  locale: string;
  page: HeroImageKey;
  label: string;
  description: string;
};

export function PageHeroEditor({ locale, page, label, description }: PageHeroEditorProps) {
  const hasHeroSection = page === "home";

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {hasHeroSection ? (
        <article style={{ ...surfaceCardStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <strong>{label}</strong>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{description}</p>
          </div>
          <HeroImageManager locale={locale} page={page} initialImageUrl={getHeroImageUrl(page)} kind="hero" />
        </article>
      ) : null}

      {!hasHeroSection ? (
        <article style={{ ...surfaceCardStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <strong>Page background image</strong>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
              Upload the background image used for this page content area.
            </p>
          </div>
          <HeroImageManager
            locale={locale}
            page={page}
            initialImageUrl={getContentBackgroundImageUrl(page) ?? ""}
            kind="content"
          />
        </article>
      ) : null}
    </div>
  );
}