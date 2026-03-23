import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { setEmployeeActiveAction, upsertEmployeeAction } from "../../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle
} from "../../_components";

type AdminEmployeesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ employee?: string }>;
};

export default async function AdminEmployeesPage({
  params,
  searchParams
}: AdminEmployeesPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  if (!isLocale(locale)) {
    notFound();
  }

  const members = siteConfig.team[locale].members;
  const editingSlug = resolvedSearchParams?.employee?.trim() || "";
  const editingMember = editingSlug
    ? members.find((member) => member.slug === editingSlug)
    : undefined;

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-003" title="Manage employees" />
        <div style={gridTwo}>
          {members.map((member) => (
            <article key={member.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10, alignContent: "start" }}>
              <strong>{member.name}</strong>
              <div style={{ color: "var(--muted)" }}>{member.slug}</div>
              <div>{member.isActive ? "Active" : "Inactive"}</div>
              <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>
                {member.specialties.join(", ")}
              </div>
              <Link
                href={`/${locale}/admin/entities/employees?employee=${encodeURIComponent(member.slug)}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--foreground)",
                  fontWeight: 700,
                  textDecoration: "none",
                  width: "fit-content"
                }}
              >
                Edit employee
              </Link>
              <form action={setEmployeeActiveAction} style={{ display: "grid", gap: 10 }}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="employeeSlug" value={member.slug} />
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" name="isActive" defaultChecked={member.isActive} />
                  Active employee
                </label>
                <button
                  type="submit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "rgba(214, 176, 125, 0.22)",
                    color: "var(--foreground)",
                    cursor: "pointer",
                    fontWeight: 700,
                    width: "fit-content"
                  }}
                >
                  Save status
                </button>
              </form>
            </article>
          ))}
        </div>
        <div style={{ color: "var(--muted)", marginTop: 16 }}>
          {editingMember
            ? `Editing: ${editingMember.name} (${editingMember.slug})`
            : "Create a new employee or click Edit employee on an existing card."}
        </div>
        <form action={upsertEmployeeAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          {editingMember ? (
            <input type="hidden" name="employeeSlug" value={editingMember.slug} />
          ) : null}
          <div style={gridTwo}>
            {editingMember ? (
              <div style={{ ...inputStyle, background: "rgba(214, 176, 125, 0.12)" }}>
                Editing slug: {editingMember.slug}
              </div>
            ) : (
              <input name="employeeSlug" placeholder="Existing slug" style={inputStyle} />
            )}
            <input
              name="slug"
              placeholder="Slug"
              defaultValue={editingMember?.slug ?? ""}
              style={inputStyle}
            />
            <input name="loginEmail" placeholder="Employee login email" style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isActive" defaultChecked={editingMember?.isActive ?? true} />
              Active employee
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="linkLogin" />
              Create/link login
            </label>
          </div>
          <section
            style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 14, display: "grid", gap: 12 }}
          >
            <strong style={{ textTransform: "uppercase", fontSize: 12, letterSpacing: "0.08em" }}>
              Locale: {locale}
            </strong>
            <div style={gridTwo}>
              <input
                name={`name_${locale}`}
                placeholder={`Display name (${locale})`}
                defaultValue={editingMember?.name ?? ""}
                style={inputStyle}
              />
              <input
                name={`image_${locale}`}
                placeholder={`Avatar URL (${locale})`}
                defaultValue={editingMember?.imageSrc ?? ""}
                style={inputStyle}
              />
              <input
                name={`specialties_${locale}`}
                placeholder={`Comma-separated specialties (${locale})`}
                defaultValue={editingMember?.specialties.join(", ") ?? ""}
                style={inputStyle}
              />
              <textarea
                name={`bio_${locale}`}
                rows={4}
                placeholder={`Bio (${locale})`}
                defaultValue={editingMember?.bio ?? ""}
                style={inputStyle}
              />
            </div>
          </section>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            {editingMember ? "Update employee" : "Save employee"}
          </button>
          {editingMember ? (
            <Link
              href={`/${locale}/admin/entities/employees`}
              style={{ color: "var(--muted)", textDecoration: "underline", width: "fit-content" }}
            >
              Clear edit mode
            </Link>
          ) : null}
        </form>
      </section>
    </AdminShell>
  );
}
