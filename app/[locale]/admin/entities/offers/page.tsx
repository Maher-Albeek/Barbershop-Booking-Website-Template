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
};

export default async function AdminOffersPage({ params }: AdminOffersPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const offers = siteConfig.offers[locale].offers;

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
              <FormModal
                buttonLabel="Edit offer"
                title={`Edit offer: ${offer.title}`}
                description="Update this offer entry."
              >
                <form action={upsertOfferAction} style={{ display: "grid", gap: 14 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="offerSlug" value={offer.slug} />
                  <div style={gridTwo}>
                    <div style={{ ...inputStyle, background: "rgba(214, 176, 125, 0.12)" }}>
                      Editing slug: {offer.slug}
                    </div>
                    <input
                      name="slug"
                      placeholder="New slug override"
                      defaultValue={offer.slug}
                      style={inputStyle}
                    />
                    <input
                      name="validFrom"
                      type="date"
                      defaultValue={offer.validFrom}
                      style={inputStyle}
                    />
                    <input
                      name="validUntil"
                      type="date"
                      defaultValue={offer.validUntil}
                      style={inputStyle}
                    />
                    <input
                      name="imageSrc"
                      placeholder="Image URL"
                      defaultValue={offer.imageSrc}
                      style={inputStyle}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input type="checkbox" name="isActive" defaultChecked={offer.isActive} />
                      Offer active
                    </label>
                  </div>
                  <div style={gridTwo}>
                    <input
                      name={`title_${locale}`}
                      placeholder="Offer title"
                      defaultValue={offer.title}
                      style={inputStyle}
                    />
                    <textarea
                      name={`description_${locale}`}
                      rows={4}
                      placeholder="Description"
                      defaultValue={offer.description}
                      style={inputStyle}
                    />
                  </div>
                  <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    Update offer
                  </button>
                </form>
              </FormModal>
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
          Create a new offer or click Edit offer on an existing card.
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

      </section>
    </AdminShell>
  );
}
