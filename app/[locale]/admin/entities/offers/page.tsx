import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getOffersFromDatabase, getPrimaryShopId } from "@/lib/admin-data";
import { FormModal } from "../../_form-modal";
import { deleteOfferAction, upsertOfferAction } from "../../actions";
import { AvatarDropField } from "../employees/_avatar-drop-field";
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

  // Fetch offers from database
  const shopId = await getPrimaryShopId();
  const offers = shopId ? await getOffersFromDatabase(shopId) : [];

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-009" title="Manage offers" />
        <div style={gridTwo}>
          {offers.map((offer) => (
            <article key={offer.id} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              {offer.avatar ? (
                <img
                  src={offer.avatar}
                  alt={offer.title}
                  style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 16 }}
                />
              ) : null}
              <strong>{offer.title}</strong>
              <div style={{ color: "var(--muted)" }}>ID: {offer.id}</div>
              <div>{offer.isActive ? "🟢 Active" : "⚪ Inactive"}</div>
              <div style={{ color: "var(--muted)" }}>
                {offer.price !== null && offer.price !== undefined
                  ? `${offer.price.toFixed(2)}`
                  : "No price set"}
              </div>
              {offer.description && (
                <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  {offer.description.substring(0, 100)}...
                </div>
              )}
              <FormModal
                buttonLabel="Edit offer"
                title={`Edit offer: ${offer.title}`}
                description="Update this offer entry."
              >
                <form action={upsertOfferAction} style={{ display: "grid", gap: 14 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="offerId" value={offer.id} />
                  <div style={gridTwo}>
                    <input
                      name="title_en"
                      placeholder="Offer title"
                      defaultValue={offer.title}
                      style={inputStyle}
                      required
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input type="checkbox" name="isActive" defaultChecked={offer.isActive} />
                      Offer active
                    </label>
                  </div>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    defaultValue={offer.price ?? ""}
                    style={inputStyle}
                  />
                  <textarea
                    name="description_en"
                    rows={4}
                    placeholder="Description"
                    defaultValue={offer.description || ""}
                    style={inputStyle}
                  />
                  <AvatarDropField
                    name="avatar"
                    label="Offer avatar"
                    defaultValue={offer.avatar ?? ""}
                  />
                  <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    Update offer
                  </button>
                </form>
              </FormModal>
              <form action={deleteOfferAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="offerId" value={offer.id} />
                <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700, background: "rgba(239, 68, 68, 0.12)", color: "var(--danger)" }}>
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
          description="Create a new offer."
        >
          <form action={upsertOfferAction} style={{ display: "grid", gap: 14 }}>
            <input type="hidden" name="locale" value={locale} />
            <input
              name="title_en"
              placeholder="Offer title"
              style={inputStyle}
              required
            />
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              style={inputStyle}
            />
            <textarea
              name="description_en"
              rows={4}
              placeholder="Description"
              style={inputStyle}
            />
            <AvatarDropField name="avatar" label="Offer avatar" />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isActive" defaultChecked />
              Offer active
            </label>
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Save offer
            </button>
          </form>
        </FormModal>

      </section>
    </AdminShell>
  );
}
