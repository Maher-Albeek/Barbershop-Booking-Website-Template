import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getEmployeeProfile,
  listEmployeeBlockedTimes,
  listEmployeeWorkingHours
} from "@/lib/employee-data";
import { isLocale } from "@/lib/i18n";
import { EmployeeShell, cardStyle, inputStyle } from "../_components";
import { addOwnBlockedTimeAction } from "../actions";

type EmployeeSchedulePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function EmployeeSchedulePage({ params }: EmployeeSchedulePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();

  if (!session) {
    notFound();
  }

  const profile = getEmployeeProfile(session, locale);

  if (!profile) {
    notFound();
  }

  const workingHours = listEmployeeWorkingHours(session);
  const blockedTimes = listEmployeeBlockedTimes(session);

  return (
    <EmployeeShell
      locale={locale}
      title="Availability"
      description="Review your weekly working hours and add blocked periods that immediately reduce bookable slots for your assigned services."
      active="schedule"
      displayName={session.displayName}
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.9fr)",
          gap: 16
        }}
      >
        <article style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Weekly working hours</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {workingHours.map((entry) => (
              <div
                key={`${entry.weekday}-${entry.start}-${entry.end}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  borderTop: "1px solid var(--border)",
                  paddingTop: 10
                }}
              >
                <strong>{entry.weekdayLabel}</strong>
                <span style={{ color: "var(--muted)" }}>
                  {entry.isOff ? "Off" : `${entry.start}-${entry.end}`}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Block time</h2>
          {session.canManageAvailability ? (
            <form action={addOwnBlockedTimeAction} style={{ display: "grid", gap: 12 }}>
              <input type="hidden" name="locale" value={locale} />
              <input type="date" name="date" style={inputStyle} />
              <input type="time" name="start" style={inputStyle} />
              <input type="time" name="end" style={inputStyle} />
              <input name="reason" placeholder="Optional reason" style={inputStyle} />
              <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                Add blocked time
              </button>
            </form>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Availability changes are disabled for this employee account.
            </p>
          )}
        </article>
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Upcoming blocked periods</h2>
        {blockedTimes.length > 0 ? (
          <div style={{ display: "grid", gap: 10 }}>
            {blockedTimes.map((entry) => (
              <div
                key={`${entry.date}-${entry.start}-${entry.end}`}
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 10,
                  display: "grid",
                  gap: 4
                }}
              >
                <strong>
                  {entry.date} {entry.start}-{entry.end}
                </strong>
                <span style={{ color: "var(--muted)" }}>{entry.reason || "No reason provided"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: "var(--muted)" }}>
            No blocked periods are currently stored for {profile.name}.
          </p>
        )}
      </section>
    </EmployeeShell>
  );
}
