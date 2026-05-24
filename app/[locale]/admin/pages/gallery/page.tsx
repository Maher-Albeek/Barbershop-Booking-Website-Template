import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getGalleryImagesFromDatabase, getPrimaryShopId } from "@/lib/admin-data";
import { deleteGalleryAction, upsertGalleryAction } from "../../actions";
import { FormModal } from "../../_form-modal";
import { ImageDropField } from "../../_image-drop-field";
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

  // Fetch gallery images from database
  const shopId = await getPrimaryShopId();
  const images = shopId ? await getGalleryImagesFromDatabase(shopId) : [];

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
          {images.map((image) => (
            <article key={image.id} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <img
                src={image.imageUrl}
                alt={`Gallery image ${image.id}`}
                style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 14 }}
              />
              {image.description ? <p style={{ margin: 0 }}>{image.description}</p> : null}
              <div style={{ color: "var(--muted)" }}>
                ID: {image.id} · {image.isVisible ? "🟢 Visible" : "⚪ Hidden"}
              </div>
              <FormModal
                buttonLabel="Edit image"
                title={`Edit gallery image ${image.id}`}
                description="Replace the image, edit its description, or update its visibility."
              >
                <form action={upsertGalleryAction} style={{ display: "grid", gap: 14 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="imageId" value={image.id} />
                  <ImageDropField
                    name="imageSrc"
                    label="Gallery image"
                    defaultValue={image.imageUrl}
                  />
                   
                  <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input type="checkbox" name="isVisible" defaultChecked={image.isVisible} />
                    Visible on public gallery
                  </label>
                  <button
                    type="submit"
                    style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}
                  >
                    Update image
                  </button>
                </form>
              </FormModal>
              <form action={deleteGalleryAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="imageId" value={image.id} />
                <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700, background: "rgba(239, 68, 68, 0.12)", color: "var(--danger)" }}>
                  Delete image
                </button>
              </form>
            </article>
          ))}
        </div>
        <form action={upsertGalleryAction} style={{ display: "grid", gap: 14, marginTop: 24 }}>
          <strong>Add a new gallery image</strong>
          <input type="hidden" name="locale" value={locale} />
          <ImageDropField name="imageSrc" label="Gallery image" />
          
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
