import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { loadEmployeeProfiles } from "@/lib/employee-profile-storage";
import { AvatarDropField } from "../../entities/employees/_avatar-drop-field";
import { FormModal } from "../../_form-modal";
import { setEmployeeActiveAction, upsertEmployeeAction } from "../../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle
} from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminTeamPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminTeamHeroPage({ params }: AdminTeamPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const members = await prisma.employee.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: {
      user: {
        select: {
          email: true
        }
      }
    }
  });
  const employeeProfiles = loadEmployeeProfiles();

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-015" title="Manage team page" />
        <PageHeroEditor
          locale={locale}
          page="team"
          label="Team page hero image"
          description="Upload the hero image used on the public team page."
        />
      </section>

      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-003" title="Manage team members" />
        <div style={gridTwo}>
          {members.map((member) => {
            const profile = employeeProfiles[member.id];

            return (
              <article key={member.id} style={{ ...surfaceCardStyle, display: "grid", gap: 10, alignContent: "start" }}>
                <strong>{member.name}</strong>
                <div style={{ color: "var(--muted)" }}>ID: {member.id}</div>
                <div style={{ color: "var(--muted)" }}>{member.user?.email ?? "No linked login"}</div>
                {profile?.position ? <div style={{ color: "var(--muted)" }}>Position: {profile.position}</div> : null}
                {profile?.instagramUrl ? (
                  <Link href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-accent)" }}>
                    Instagram profile
                  </Link>
                ) : null}
                <div>{member.isActive ? "Active" : "Inactive"}</div>
                <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>{member.bio || "No bio"}</div>
                <FormModal
                  buttonLabel="Edit team member"
                  title={`Edit employee: ${member.name}`}
                  description="Update team member profile details."
                >
                  <form action={upsertEmployeeAction} style={{ display: "grid", gap: 14 }}>
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="employeeId" value={member.id} />
                    <div style={gridTwo}>
                      <input name="name" placeholder="Employee name" defaultValue={member.name} style={inputStyle} />
                      <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input type="checkbox" name="isActive" defaultChecked={member.isActive} />
                        Active employee
                      </label>
                    </div>
                    <section
                      style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 14, display: "grid", gap: 12 }}
                    >
                      <strong style={{ textTransform: "uppercase", fontSize: 12, letterSpacing: "0.08em" }}>
                        Employee profile
                      </strong>
                      <div style={gridTwo}>
                        <AvatarDropField name="avatar" label="Avatar" defaultValue={member.avatar ?? ""} />
                        <textarea
                          name="bio"
                          rows={4}
                          placeholder="Bio"
                          defaultValue={member.bio ?? ""}
                          style={inputStyle}
                        />
                      </div>
                      <div style={gridTwo}>
                        <input
                          name="position"
                          placeholder="Position (Owner, Men hairstylist, Women hairstylist, Makeup artist)"
                          defaultValue={profile?.position ?? ""}
                          style={inputStyle}
                        />
                        <input
                          name="instagramUrl"
                          placeholder="Instagram (username, @username, or full URL)"
                          defaultValue={profile?.instagramUrl ?? ""}
                          style={inputStyle}
                        />
                      </div>
                    </section>
                    <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                      Update team member
                    </button>
                  </form>
                </FormModal>
                <form action={setEmployeeActiveAction} style={{ display: "grid", gap: 10 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="employeeId" value={member.id} />
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
            );
          })}
        </div>
        <div style={{ color: "var(--muted)", marginTop: 16 }}>
          Create a new team member or click Edit team member on an existing card.
        </div>
        <FormModal
          buttonLabel="Add new team member"
          title="Create team member"
          description="Add a new team member to the database."
        >
          <form action={upsertEmployeeAction} style={{ display: "grid", gap: 14 }}>
            <input type="hidden" name="locale" value={locale} />
            <div style={gridTwo}>
              <input name="name" placeholder="Employee name" style={inputStyle} />
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" name="isActive" defaultChecked />
                Active employee
              </label>
            </div>
            <section
              style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 14, display: "grid", gap: 12 }}
            >
              <strong style={{ textTransform: "uppercase", fontSize: 12, letterSpacing: "0.08em" }}>
                Employee profile
              </strong>
              <div style={gridTwo}>
                <AvatarDropField name="avatar" label="Avatar" />
                <textarea name="bio" rows={4} placeholder="Bio" style={inputStyle} />
              </div>
              <div style={gridTwo}>
                <input
                  name="position"
                  placeholder="Position (Owner, Men hairstylist, Women hairstylist, Makeup artist)"
                  style={inputStyle}
                />
                <input
                  name="instagramUrl"
                  placeholder="Instagram (username, @username, or full URL)"
                  style={inputStyle}
                />
              </div>
            </section>
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Save team member
            </button>
          </form>
        </FormModal>
      </section>
    </AdminShell>
  );
}