import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getServicesFromDatabase, getPrimaryShopId } from "@/lib/admin-data";
import { FormModal } from "../../_form-modal";
import { upsertServiceAction } from "../../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle
} from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminServicesHeroPage({ params }: AdminServicesPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const shopId = await getPrimaryShopId();
  const services = shopId ? await getServicesFromDatabase(shopId) : [];

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-014" title="Manage services page" />
        <PageHeroEditor
          locale={locale}
          page="services"
          label="Services page hero image"
          description="Upload the hero image used on the public services page."
        />
      </section>

      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-002" title="Manage services data" />
        <div style={gridTwo}>
          {services.map((service) => (
            <article key={service.id} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <strong>{service.name}</strong>
              <div style={{ color: "var(--muted)" }}>ID: {service.id}</div>
              {service.description ? (
                <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>{service.description}</div>
              ) : null}
              <div style={{ color: "var(--muted)" }}>
                {service.durationMinutes ? `${service.durationMinutes} min` : "No duration set"}
                {service.price !== null && service.price !== undefined
                  ? ` · ${service.price.toFixed(2)}`
                  : " · No price set"}
              </div>
              <div>{service.isActive ? "🟢 Active" : "⚪ Inactive"}</div>
              <FormModal
                buttonLabel="Edit service"
                title={`Edit service: ${service.name}`}
                description="Update this service entry."
              >
                <form action={upsertServiceAction} style={{ display: "grid", gap: 14 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="serviceId" value={service.id} />
                  <div style={gridTwo}>
                    <input
                      name="name_en"
                      placeholder="Service name"
                      defaultValue={service.name}
                      style={inputStyle}
                      required
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input type="checkbox" name="isActive" defaultChecked={service.isActive} />
                      Active service
                    </label>
                  </div>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Description"
                    defaultValue={service.description ?? ""}
                    style={inputStyle}
                  />
                  <div style={gridTwo}>
                    <input
                      name="durationMinutes"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Duration in minutes"
                      defaultValue={service.durationMinutes ?? ""}
                      style={inputStyle}
                    />
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      defaultValue={service.price ?? ""}
                      style={inputStyle}
                    />
                  </div>
                  <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    Update service
                  </button>
                </form>
              </FormModal>
            </article>
          ))}
        </div>
        <div style={{ color: "var(--muted)", marginTop: 16 }}>
          Create a new service or click Edit service on an existing card.
        </div>
        <FormModal buttonLabel="Add new service" title="Create service" description="Add a new service entry.">
          <form action={upsertServiceAction} style={{ display: "grid", gap: 14 }}>
            <input type="hidden" name="locale" value={locale} />
            <input name="name_en" placeholder="Service name" style={inputStyle} required />
            <textarea name="description" rows={4} placeholder="Description" style={inputStyle} />
            <div style={gridTwo}>
              <input
                name="durationMinutes"
                type="number"
                min="1"
                step="1"
                placeholder="Duration in minutes"
                style={inputStyle}
              />
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                style={inputStyle}
              />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isActive" defaultChecked />
              Active service
            </label>
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Save service
            </button>
          </form>
        </FormModal>
      </section>
    </AdminShell>
  );
}