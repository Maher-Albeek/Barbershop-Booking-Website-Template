import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { deleteOfferAction, upsertOfferAction } from "../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle
} from "../_components";

type AdminOffersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminOffersPage({ params }: AdminOffersPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-009" title="Manage offers" />
        <div style={gridTwo}>
          {siteConfig.offers[locale].offers.map((offer) => (
            <article key={offer.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <strong>{offer.title}</strong>
              <div style={{ color: "var(--muted)" }}>
                {offer.validFrom} to {offer.validUntil}
              </div>
              <div>{offer.isActive ? "Active" : "Inactive"}</div>
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
        <form action={upsertOfferAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input name="offerSlug" placeholder="Existing slug" style={inputStyle} />
            <input name="slug" placeholder="New slug override" style={inputStyle} />
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
            <textarea
              name={`description_${locale}`}
              rows={4}
              placeholder="Description"
              style={inputStyle}
            />
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save offer
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
