import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { upsertEmployeeAction } from "../../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle
} from "../../_components";
import { HeroImageManager } from "../../_hero-image-manager";

type AdminEmployeesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminEmployeesPage({ params }: AdminEmployeesPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-003" title="Manage employees" />
        <div style={gridTwo}>
          {siteConfig.team[locale].members.map((member) => (
            <article key={member.slug} style={surfaceCardStyle}>
              <strong>{member.name}</strong>
              <div style={{ color: "var(--muted)", marginTop: 8 }}>{member.slug}</div>
              <div style={{ marginTop: 8 }}>{member.isActive ? "Active" : "Inactive"}</div>
              <div style={{ marginTop: 8, color: "var(--muted)" }}>
                {member.specialties.join(", ")}
              </div>
            </article>
          ))}
        </div>
        <form action={upsertEmployeeAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input name="employeeSlug" placeholder="Existing slug" style={inputStyle} />
            <input name="slug" placeholder="New slug override" style={inputStyle} />
            <input name="loginEmail" placeholder="Employee login email" style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isActive" defaultChecked />
              Active employee
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="linkLogin" />
              Create/link login
            </label>
          </div>
          <div style={gridTwo}>
            <input name={`name_${locale}`} placeholder="Display name" style={inputStyle} />
            <input name={`image_${locale}`} placeholder="Avatar URL" style={inputStyle} />
            <input
              name={`specialties_${locale}`}
              placeholder="Comma-separated specialties"
              style={inputStyle}
            />
            <textarea name={`bio_${locale}`} rows={4} placeholder="Bio" style={inputStyle} />
          </div>
          <div style={{ ...surfaceCardStyle }}>
            <strong>Employee Avatar</strong>
            <HeroImageManager locale={locale} />
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save employee
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
