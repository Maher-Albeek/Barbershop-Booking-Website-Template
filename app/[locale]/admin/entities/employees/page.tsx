import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { AvatarDropField } from "./_avatar-drop-field";
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

type AdminEmployeesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminEmployeesPage({ params }: AdminEmployeesPageProps) {
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

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-003" title="Manage employees" />
        <div style={gridTwo}>
          {members.map((member) => (
            <article key={member.id} style={{ ...surfaceCardStyle, display: "grid", gap: 10, alignContent: "start" }}>
              <strong>{member.name}</strong>
              <div style={{ color: "var(--muted)" }}>ID: {member.id}</div>
              <div style={{ color: "var(--muted)" }}>{member.user?.email ?? "No linked login"}</div>
              <div>{member.isActive ? "Active" : "Inactive"}</div>
              <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>
                {member.bio || "No bio"}
              </div>
              <FormModal
                buttonLabel="Edit employee"
                title={`Edit employee: ${member.name}`}
                description="Update employee profile details."
              >
                <form action={upsertEmployeeAction} style={{ display: "grid", gap: 14 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="employeeId" value={member.id} />
                  <div style={gridTwo}>
                    <input
                      name="name"
                      placeholder="Employee name"
                      defaultValue={member.name}
                      style={inputStyle}
                    />
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
                      <AvatarDropField
                        name="avatar"
                        label="Avatar"
                        defaultValue={member.avatar ?? ""}
                      />
                      <textarea
                        name="bio"
                        rows={4}
                        placeholder="Bio"
                        defaultValue={member.bio ?? ""}
                        style={inputStyle}
                      />
                    </div>
                  </section>
                  <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    Update employee
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
          ))}
        </div>
        <div style={{ color: "var(--muted)", marginTop: 16 }}>
          Create a new employee or click Edit employee on an existing card.
        </div>
        <FormModal
          buttonLabel="Add new employee"
          title="Create employee"
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
                <AvatarDropField
                  name="avatar"
                  label="Avatar"
                />
                <textarea
                  name="bio"
                  rows={4}
                  placeholder="Bio"
                  style={inputStyle}
                />
              </div>
            </section>
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Save employee
            </button>
          </form>
        </FormModal>

      </section>
    </AdminShell>
  );
}
