import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getEmployeeDashboardSummary } from "@/lib/employee-data";
import { isLocale } from "@/lib/i18n";
import { EmployeeShell, cardStyle } from "../_components";

type EmployeeDashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function EmployeeDashboardPage({ params }: EmployeeDashboardPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();

  if (!session) {
    notFound();
  }

  const summary = getEmployeeDashboardSummary(session, locale);

  if (!summary.profile) {
    notFound();
  }

  return (
    <EmployeeShell
      locale={locale}
      title="Work schedule overview"
      description="Your dashboard only shows the services, appointments, and schedule data attached to your employee account."
      active="dashboard"
      displayName={session.displayName}
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        {[
          ["Assigned bookings", String(summary.bookings.length)],
          ["Pending visits", String(summary.pendingBookings)],
          ["Completed visits", String(summary.completedBookings)],
          ["Blocked periods", String(summary.blockedTimeCount)]
        ].map(([label, value]) => (
          <article key={label} style={cardStyle}>
            <p style={{ margin: 0, color: "var(--muted)" }}>{label}</p>
            <strong style={{ display: "block", marginTop: 8, fontSize: 32 }}>{value}</strong>
          </article>
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 1fr)",
          gap: 16
        }}
      >
        <article style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Upcoming bookings</h2>
          {summary.upcomingBookings.length > 0 ? (
            <div style={{ display: "grid", gap: 12 }}>
              {summary.upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: 12,
                    display: "grid",
                    gap: 6
                  }}
                >
                  <strong>
                    {booking.date} {booking.start}-{booking.end}
                  </strong>
                  <div>{booking.customerName}</div>
                  <div style={{ color: "var(--muted)" }}>
                    {booking.serviceName} · {booking.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)" }}>No upcoming bookings are assigned yet.</p>
          )}
        </article>

        <article style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Assigned services</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {summary.services.map((service) => (
              <div key={service.serviceSlug} style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                <strong>{service.serviceName}</strong>
                <div style={{ color: "var(--muted)" }}>
                  {service.durationMinutes} min · {service.priceLabel}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </EmployeeShell>
  );
}
