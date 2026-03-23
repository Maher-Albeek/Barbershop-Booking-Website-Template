import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { FormModal } from "../../_form-modal";
import { deleteOfferAction, upsertOfferAction } from "../../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle
} from "../../_components";

type AdminOffersPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ offer?: string }>;
};

export default async function AdminOffersPage({ params, searchParams }: AdminOffersPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  if (!isLocale(locale)) {
    notFound();
  }

  const offers = siteConfig.offers[locale].offers;
  const editingSlug = resolvedSearchParams?.offer?.trim() || "";
  const editingOffer = editingSlug ? offers.find((offer) => offer.slug === editingSlug) : undefined;

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-009" title="Manage offers" />
        <div style={gridTwo}>
          {offers.map((offer) => (
            <article key={offer.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <strong>{offer.title}</strong>
              <div style={{ color: "var(--muted)" }}>{offer.slug}</div>
              <div style={{ color: "var(--muted)" }}>
                {offer.validFrom} to {offer.validUntil}
              </div>
              <div>{offer.isActive ? "Active" : "Inactive"}</div>
              <Link
                href={`/${locale}/admin/entities/offers?offer=${encodeURIComponent(offer.slug)}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--foreground)",
                  fontWeight: 700,
                  textDecoration: "none",
                  width: "fit-content"
                }}
              >
                Edit offer
              </Link>
              <form action={deleteOfferAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="slug" value={offer.slug} />
                <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                  Delete offer
                </button>
              </form>
            </article>
          ))}
        </div>
        <div style={{ color: "var(--muted)", marginTop: 16 }}>
          {editingOffer
            ? `Editing: ${editingOffer.title} (${editingOffer.slug})`
            : "Create a new offer or click Edit offer on an existing card."}
        </div>
        <FormModal
          buttonLabel="Add new offer"
          title="Create offer"
          description="Create a new offer card for this locale."
        >
          <form action={upsertOfferAction} style={{ display: "grid", gap: 14 }}>
            <input type="hidden" name="locale" value={locale} />
            <div style={gridTwo}>
              <input name="slug" placeholder="Offer slug" style={inputStyle} />
              <input name="validFrom" type="date" style={inputStyle} />
              <input name="validUntil" type="date" style={inputStyle} />
              <input name="imageSrc" placeholder="Image URL" style={inputStyle} />
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" name="isActive" defaultChecked />
                Offer active
              </label>
            </div>
            <div style={gridTwo}>
              <input name={`title_${locale}`} placeholder="Offer title" style={inputStyle} />
              <textarea name={`description_${locale}`} rows={4} placeholder="Description" style={inputStyle} />
            </div>
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Save offer
            </button>
          </form>
        </FormModal>

        {editingOffer ? (
          <form action={upsertOfferAction} style={{ display: "grid", gap: 14 }}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="offerSlug" value={editingOffer.slug} />
            <div style={gridTwo}>
              <div style={{ ...inputStyle, background: "rgba(214, 176, 125, 0.12)" }}>
                Editing slug: {editingOffer.slug}
              </div>
              <input
                name="slug"
                placeholder="New slug override"
                defaultValue={editingOffer.slug}
                style={inputStyle}
              />
              <input
                name="validFrom"
                type="date"
                defaultValue={editingOffer.validFrom}
                style={inputStyle}
              />
              <input
                name="validUntil"
                type="date"
                defaultValue={editingOffer.validUntil}
                style={inputStyle}
              />
              <input
                name="imageSrc"
                placeholder="Image URL"
                defaultValue={editingOffer.imageSrc}
                style={inputStyle}
              />
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" name="isActive" defaultChecked={editingOffer.isActive} />
                Offer active
              </label>
            </div>
            <div style={gridTwo}>
              <input
                name={`title_${locale}`}
                placeholder="Offer title"
                defaultValue={editingOffer.title}
                style={inputStyle}
              />
              <textarea
                name={`description_${locale}`}
                rows={4}
                placeholder="Description"
                defaultValue={editingOffer.description}
                style={inputStyle}
              />
            </div>
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Update offer
            </button>
            <Link
              href={`/${locale}/admin/entities/offers`}
              style={{ color: "var(--muted)", textDecoration: "underline", width: "fit-content" }}
            >
              Clear edit mode
            </Link>
          </form>
        ) : null}
      </section>
    </AdminShell>
  );
}
