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

type AdminServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminServicesPage({ params }: AdminServicesPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  // Fetch services from database
  const shopId = await getPrimaryShopId();
  const services = shopId ? await getServicesFromDatabase(shopId) : [];

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-002" title="Manage services" />
        <div style={gridTwo}>
          {services.map((service) => (
            <article key={service.id} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <strong>{service.name}</strong>
              <div style={{ color: "var(--muted)" }}>ID: {service.id}</div>
              <div>
                {service.isActive ? "🟢 Active" : "⚪ Inactive"}
              </div>
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
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input type="checkbox" name="isActive" defaultChecked={service.isActive} />
                      Active service
                    </label>
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
        <FormModal
          buttonLabel="Add new service"
          title="Create service"
          description="Add a new service entry."
        >
          <form action={upsertServiceAction} style={{ display: "grid", gap: 14 }}>
            <input type="hidden" name="locale" value={locale} />
            <input
              name="name_en"
              placeholder="Service name"
              style={inputStyle}
              required
            />
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
