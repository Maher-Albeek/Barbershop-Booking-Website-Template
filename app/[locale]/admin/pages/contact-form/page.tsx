import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { updateContactContentAction } from "../../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle
} from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminContactFormPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminContactFormPage({ params }: AdminContactFormPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-012" title="Manage contact page content" />
        <PageHeroEditor
          locale={locale}
          page="contact"
          label="Contact page hero image"
          description="Upload the hero image used on the public contact page."
        />
        <form action={updateContactContentAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input
              name="phone"
              defaultValue={siteConfig.contact[locale].items.phone.value}
              placeholder="Phone"
              style={inputStyle}
            />
            <input
              name="email"
              defaultValue={siteConfig.contact[locale].items.email.value}
              placeholder="Email"
              style={inputStyle}
            />
            <input
              name="address"
              defaultValue={siteConfig.contact[locale].items.address.value}
              placeholder="Address"
              style={inputStyle}
            />
            <input
              name="whatsapp"
              defaultValue={siteConfig.contact[locale].items.whatsapp?.href ?? ""}
              placeholder="WhatsApp link"
              style={inputStyle}
            />
            <input
              name="mapEmbedUrl"
              defaultValue={siteConfig.contact[locale].map.embedUrl}
              placeholder="Map embed URL"
              style={inputStyle}
            />
            <input
              name="mapDirectionsHref"
              defaultValue={siteConfig.contact[locale].map.directionsHref}
              placeholder="Directions URL"
              style={inputStyle}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                name="mapVisible"
                defaultChecked={siteConfig.contact[locale].map.isVisible}
              />
              Show embedded map
            </label>
          </div>
          <div style={gridTwo}>
            <input
              name={`title_${locale}`}
              defaultValue={siteConfig.contact[locale].title}
              placeholder="Page title"
              style={inputStyle}
            />
            <input
              name={`subtitle_${locale}`}
              defaultValue={siteConfig.contact[locale].subtitle}
              placeholder="Subtitle"
              style={inputStyle}
            />
            <input
              name={`addressLabel_${locale}`}
              defaultValue={siteConfig.contact[locale].items.address.label}
              placeholder="Address label"
              style={inputStyle}
            />
            <textarea
              name={`hours_${locale}`}
              rows={5}
              defaultValue={siteConfig.contact[locale].workingHours
                .map((entry) => `${entry.days}: ${entry.hours}`)
                .join("\n")}
              placeholder="Working hours (one line per entry)"
              style={inputStyle}
            />
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save contact page
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
