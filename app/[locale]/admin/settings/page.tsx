import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { updateShopSettingsAction } from "../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  localeLabels,
  sectionStyle,
  surfaceCardStyle
} from "../_components";

type AdminSettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminSettingsPage({ params }: AdminSettingsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-010" title="Manage shop settings" />
        <form action={updateShopSettingsAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input
              name="shopName"
              defaultValue={siteConfig.brand.shopName}
              placeholder="Shop name"
              style={inputStyle}
            />
            <input
              name="logoText"
              defaultValue={siteConfig.brand.logoText}
              placeholder="Logo text"
              style={inputStyle}
            />
            <input
              name="primaryColor"
              defaultValue={siteConfig.brand.primaryColor}
              placeholder="Primary color"
              style={inputStyle}
            />
            <input
              name="secondaryColor"
              defaultValue={siteConfig.brand.secondaryColor}
              placeholder="Secondary color"
              style={inputStyle}
            />
            <input
              name="accentColor"
              defaultValue={siteConfig.brand.accentColor}
              placeholder="Accent color"
              style={inputStyle}
            />
          </div>

          <div style={{ ...surfaceCardStyle, display: "grid", gap: 12 }}>
            <strong>Hero Content</strong>
            <input
              name={`hero_kicker_${locale}`}
              defaultValue={siteConfig.content[locale].hero.kicker}
              placeholder="Hero kicker"
              style={inputStyle}
            />
            <input
              name={`hero_title_${locale}`}
              defaultValue={siteConfig.content[locale].hero.title}
              placeholder="Hero title"
              style={inputStyle}
            />
            <textarea
              name={`hero_subtitle_${locale}`}
              defaultValue={siteConfig.content[locale].hero.subtitle}
              rows={4}
              placeholder="Hero subtitle"
              style={inputStyle}
            />
          </div>
          <div style={gridTwo}>
            {locales.map((item) => (
              <div key={item} style={{ ...surfaceCardStyle, display: "grid", gap: 12 }}>
                <strong>{localeLabels[item]}</strong>
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    name={`locale_${item}`}
                    defaultChecked={siteConfig.locales.includes(item)}
                  />
                  Enabled locale
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="radio"
                    name="defaultLocale"
                    value={item}
                    defaultChecked={siteConfig.defaultLocale === item}
                  />
                  Default locale
                </label>
              </div>
            ))}
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save shop settings
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
