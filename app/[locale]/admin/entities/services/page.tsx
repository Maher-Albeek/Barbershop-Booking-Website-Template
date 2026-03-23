import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
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

  const services = siteConfig.services[locale].services;

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-002" title="Manage services" />
        <div style={gridTwo}>
          {services.map((service) => (
            <article key={service.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <strong>{service.name}</strong>
              <div style={{ color: "var(--muted)" }}>{service.slug}</div>
              <div>
                {service.isActive ? "Active" : "Inactive"} · {service.durationLabel}
              </div>
              <div>
                {service.pricing === "variable"
                  ? "Price: Variable"
                  : `Price: ${service.priceLabel || "Not set"}`}
              </div>
              <FormModal
                buttonLabel="Edit service"
                title={`Edit service: ${service.name}`}
                description="Update this service entry."
              >
                <form action={upsertServiceAction} style={{ display: "grid", gap: 14 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="serviceSlug" value={service.slug} />
                  <div style={gridTwo}>
                    <div style={{ ...inputStyle, background: "rgba(214, 176, 125, 0.12)" }}>
                      Editing slug: {service.slug}
                    </div>
                    <input
                      name="slug"
                      placeholder="New slug override"
                      defaultValue={service.slug}
                      style={inputStyle}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input type="checkbox" name="isActive" defaultChecked={service.isActive} />
                      Active service
                    </label>
                  </div>
                  <div style={gridTwo}>
                    <input
                      name={`name_${locale}`}
                      placeholder="Service name"
                      defaultValue={service.name}
                      style={inputStyle}
                    />
                    <input
                      name={`description_${locale}`}
                      placeholder="Description"
                      defaultValue={service.description}
                      style={inputStyle}
                    />
                    <input
                      name={`duration_${locale}`}
                      placeholder="Duration label (e.g. 30 Min.)"
                      defaultValue={service.durationLabel}
                      style={inputStyle}
                    />
                    <input
                      name={`price_${locale}`}
                      placeholder="Price label"
                      defaultValue={service.priceLabel}
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
        <FormModal
          buttonLabel="Add new service"
          title="Create service"
          description="Add a new service entry to the selected locale."
        >
          <form action={upsertServiceAction} style={{ display: "grid", gap: 14 }}>
            <input type="hidden" name="locale" value={locale} />
            <div style={gridTwo}>
              <input name="slug" placeholder="Service slug" style={inputStyle} />
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" name="isActive" defaultChecked />
                Active service
              </label>
            </div>

            <div style={gridTwo}>
              <input name={`name_${locale}`} placeholder="Service name" style={inputStyle} />
              <input name={`description_${locale}`} placeholder="Description" style={inputStyle} />
              <input
                name={`duration_${locale}`}
                placeholder="Duration label (e.g. 30 Min.)"
                style={inputStyle}
              />
              <input name={`price_${locale}`} placeholder="Price label" style={inputStyle} />
            </div>
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Save service
            </button>
          </form>
        </FormModal>

      </section>
    </AdminShell>
  );
}
