import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { upsertServiceAction } from "../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle
} from "../_components";
import { HeroImageManager } from "../_hero-image-manager";

type AdminServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminServicesPage({ params }: AdminServicesPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-002" title="Manage services" />
        <div style={gridTwo}>
          {siteConfig.services[locale].services.map((service) => (
            <article key={service.slug} style={surfaceCardStyle}>
              <strong>{service.name}</strong>
              <div style={{ color: "var(--muted)", marginTop: 8 }}>{service.slug}</div>
              <div style={{ marginTop: 8 }}>
                {service.isActive ? "Active" : "Inactive"} · {service.durationLabel}
              </div>
            </article>
          ))}
        </div>
        <form action={upsertServiceAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input name="serviceSlug" placeholder="Existing slug" style={inputStyle} />
            <input name="slug" placeholder="New slug override" style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isActive" defaultChecked />
              Active service
            </label>
          </div>

          <div style={gridTwo}>
            <input name={`name_${locale}`} placeholder="Service name" style={inputStyle} />
            <input name={`description_${locale}`} placeholder="Description" style={inputStyle} />
            <input name={`duration_${locale}`} placeholder="Duration label (e.g. 30 Min.)" style={inputStyle} />
            <input name={`price_${locale}`} placeholder="Price label" style={inputStyle} />
          </div>

          <div style={{ ...surfaceCardStyle, display: "grid", gap: 12 }}>
            <strong>Service Hero Image</strong>
            <HeroImageManager locale={locale} />
          </div>

          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save service
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
