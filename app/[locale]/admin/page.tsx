import { notFound } from "next/navigation";
import {
  getDashboardData
} from "@/lib/admin-data";
import { getSession } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";
import {
  AdminShell,
  SectionTitle,
  sectionStyle
} from "./_components";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();
  const dashboard = getDashboardData(locale);

  return (
    <AdminShell locale={locale} displayName={session?.displayName}>
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}
      >
        {[
          ["Total bookings", String(dashboard.metrics.totalBookings)],
          ["Employees", String(dashboard.metrics.employees)],
          ["Services", String(dashboard.metrics.services)],
          ["Active offers", String(dashboard.metrics.activeOffers)]
        ].map(([label, value]) => (
          <article key={label} style={sectionStyle}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)"
              }}
            >
              {label}
            </div>
            <strong style={{ fontSize: "clamp(1.9rem, 4vw, 2.125rem)" }}>{value}</strong>
          </article>
        ))}
      </section>

      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-001" title="Recent booking overview" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                <th style={{ paddingBottom: 10 }}>Date</th>
                <th style={{ paddingBottom: 10 }}>Customer</th>
                <th style={{ paddingBottom: 10 }}>Service</th>
                <th style={{ paddingBottom: 10 }}>Barber</th>
                <th style={{ paddingBottom: 10 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentBookings.map((booking) => (
                <tr key={booking.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 0" }}>{booking.date}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.serviceName}</td>
                  <td>{booking.employeeName}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
