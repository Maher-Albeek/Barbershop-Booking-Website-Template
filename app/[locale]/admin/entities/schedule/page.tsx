import { notFound } from "next/navigation";
import {
  buildWeekdaySummary,
  getBlockedTimeSummary
} from "@/lib/admin-data";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import {
  addBlockedTimeAction,
  upsertAssignmentAction,
  upsertWorkingHoursAction
} from "../../actions";
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

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle
          story="ADMIN-004 / ADMIN-005 / ADMIN-006"
          title="Assignments, working hours, blocked times"
        />
        <div style={gridTwo}>
          {siteConfig.team[locale].members.map((member) => (
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
        <div style={gridTwo}>
          <form action={upsertAssignmentAction} style={sectionStyle}>
            <input type="hidden" name="locale" value={locale} />
            <strong>Employee-service assignment</strong>
            <select name="employeeSlug" style={inputStyle}>
              {siteConfig.team[locale].members.map((member) => (
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

          <form action={upsertWorkingHoursAction} style={sectionStyle}>
            <input type="hidden" name="locale" value={locale} />
            <strong>Working hours</strong>
            <select name="employeeSlug" style={inputStyle}>
              {siteConfig.team[locale].members.map((member) => (
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
        </div>

        <form action={addBlockedTimeAction} style={{ ...sectionStyle, marginTop: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <strong>Add blocked time</strong>
          <div style={gridTwo}>
            <select name="employeeSlug" style={inputStyle}>
              {siteConfig.team[locale].members.map((member) => (
                <option key={member.slug} value={member.slug}>
                  {member.name}
                </option>
              ))}
            </select>
            <input name="date" type="date" placeholder="Date" style={inputStyle} />
            <input name="start" type="time" placeholder="Start time" style={inputStyle} />
            <input name="end" type="time" placeholder="End time" style={inputStyle} />
            <textarea name="reason" placeholder="Reason (optional)" style={inputStyle} />
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Block time
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
