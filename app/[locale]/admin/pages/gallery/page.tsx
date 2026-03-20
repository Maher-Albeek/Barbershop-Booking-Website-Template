import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { deleteGalleryAction, upsertGalleryAction } from "../../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle
} from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminGalleryPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminGalleryPage({ params }: AdminGalleryPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-008" title="Manage gallery page" />
        <PageHeroEditor
          locale={locale}
          page="gallery"
          label="Gallery page hero image"
          description="Upload the hero image used on the public gallery page."
        />
        <div style={gridTwo}>
          {siteConfig.gallery[locale].images
            .sort((left, right) => left.sortOrder - right.sortOrder)
            .map((image) => (
              <article key={image.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
                <img
                  src={image.imageSrc}
                  alt={image.alt}
                  style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 14 }}
                />
                <strong>{image.caption}</strong>
                <div style={{ color: "var(--muted)" }}>
                  {image.slug} · order {image.sortOrder} · {image.isVisible ? "visible" : "hidden"}
                </div>
                <form action={deleteGalleryAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="slug" value={image.slug} />
                  <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    Delete image
                  </button>
                </form>
              </article>
            ))}
        </div>
        <form action={upsertGalleryAction} style={gridTwo}>
          <input type="hidden" name="locale" value={locale} />
          <input name="slug" placeholder="Existing slug to update" style={inputStyle} />
          <input name="imageSrc" placeholder="Image URL" style={inputStyle} />
          <input name="alt" placeholder="Alt text" style={inputStyle} />
          <input name="caption" placeholder="Caption" style={inputStyle} />
          <input name="sortOrder" type="number" placeholder="Sort order" style={inputStyle} />
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" name="isVisible" defaultChecked />
            Visible on public gallery
          </label>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save gallery image
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
