import { notFound } from "next/navigation";
import {
  buildWeekdaySummary,
  getBlockedTimeSummary
} from "@/lib/admin-data";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { getAllEmployees } from "@/lib/employee-fetch";
import {
  addBlockedTimeAction,
  upsertAssignmentAction,
  upsertWorkingHoursAction
} from "../../actions";
import { FormModal } from "../../_form-modal";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle,
  weekdayLabels
} from "../../_components";

type AdminSchedulePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminSchedulePage({ params }: AdminSchedulePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dbEmployees = await getAllEmployees();
  const employees = dbEmployees.map((emp) => ({
    slug: `employee-${emp.id}`,
    name: emp.name
  }));

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle
          story="ADMIN-004 / ADMIN-005 / ADMIN-006"
          title="Assignments, working hours, blocked times"
        />
        <div style={gridTwo}>
          {employees.map((member) => (
            <article key={member.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <strong>{member.name}</strong>
              <div>
                Assignments:{" "}
                {siteConfig.booking.employeeServices
                  .filter((entry) => entry.employeeSlug === member.slug)
                  .map(
                    (entry) =>
                      `${entry.serviceSlug} (${entry.durationMinutes} min, ${entry.priceLabel}, ${
                        entry.isActive ? "active" : "inactive"
                      })`
                  )
                  .join("; ") || "none"}
              </div>
              <div>Hours: {buildWeekdaySummary(member.slug) || "none"}</div>
              <div>
                Blocks:{" "}
                {getBlockedTimeSummary(member.slug)
                  .slice(0, 3)
                  .map((entry) => `${entry.date} ${entry.start}-${entry.end}`)
                  .join("; ") || "none"}
              </div>
            </article>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <FormModal
            buttonLabel="Add assignment"
            title="Employee-service assignment"
            description="Link a service to an employee with pricing and duration."
          >
            <form action={upsertAssignmentAction} style={{ display: "grid", gap: 14 }}>
              <input type="hidden" name="locale" value={locale} />
              <select name="employeeSlug" style={inputStyle}>
                {employees.map((member) => (
                  <option key={member.slug} value={member.slug}>
                    {member.name}
                  </option>
                ))}
              </select>
              <select name="serviceSlug" style={inputStyle}>
                {siteConfig.services[locale].services.map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.name}
                  </option>
                ))}
              </select>
              <input
                name="durationMinutes"
                type="number"
                min="5"
                step="5"
                placeholder="Duration minutes"
                style={inputStyle}
              />
              <input name="priceLabel" placeholder="Price label" style={inputStyle} />
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" name="isActive" defaultChecked />
                Active assignment
              </label>
              <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                Save assignment
              </button>
            </form>
          </FormModal>

          <FormModal
            buttonLabel="Add working hours"
            title="Working hours"
            description="Define weekly working hours for an employee."
          >
            <form action={upsertWorkingHoursAction} style={{ display: "grid", gap: 14 }}>
              <input type="hidden" name="locale" value={locale} />
              <select name="employeeSlug" style={inputStyle}>
                {employees.map((member) => (
                  <option key={member.slug} value={member.slug}>
                    {member.name}
                  </option>
                ))}
              </select>
              <select name="weekday" style={inputStyle}>
                {weekdayLabels.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input name="start" type="time" placeholder="Start time" style={inputStyle} />
              <input name="end" type="time" placeholder="End time" style={inputStyle} />
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" name="isOff" />
                Mark as day off
              </label>
              <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                Save hours
              </button>
            </form>
          </FormModal>

          <FormModal
            buttonLabel="Add blocked time"
            title="Blocked time"
            description="Reserve a time slot so it cannot be booked."
          >
            <form action={addBlockedTimeAction} style={{ display: "grid", gap: 14 }}>
              <input type="hidden" name="locale" value={locale} />
              <select name="employeeSlug" style={inputStyle}>
                {employees.map((member) => (
                  <option key={member.slug} value={member.slug}>
                    {member.name}
                  </option>
                ))}
              </select>
              <input name="date" type="date" placeholder="Date" style={inputStyle} />
              <input name="start" type="time" placeholder="Start time" style={inputStyle} />
              <input name="end" type="time" placeholder="End time" style={inputStyle} />
              <textarea name="reason" placeholder="Reason (optional)" style={inputStyle} />
              <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                Block time
              </button>
            </form>
          </FormModal>
        </div>
      </section>
    </AdminShell>
  );
}
