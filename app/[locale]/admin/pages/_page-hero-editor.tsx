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
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <article style={{ ...surfaceCardStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <strong>{label}</strong>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{description}</p>
        </div>
        <HeroImageManager locale={locale} page={page} initialImageUrl={getHeroImageUrl(page)} kind="hero" />
      </article>

      <article style={{ ...surfaceCardStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <strong>Content section background image</strong>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
            Upload a per-page background image used behind the content section below the hero.
          </p>
        </div>
        <HeroImageManager
          locale={locale}
          page={page}
          initialImageUrl={getContentBackgroundImageUrl(page) ?? ""}
          kind="content"
        />
      </article>
    </div>
  );
}