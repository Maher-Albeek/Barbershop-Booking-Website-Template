import Link from "next/link";
import { notFound } from "next/navigation";
import { getDashboardData } from "@/lib/admin-data";
import { isLocale } from "@/lib/i18n";
import { AdminShell, SectionTitle, sectionStyle, surfaceCardStyle } from "../_components";
import { adminNavGroups, getAdminPageHref } from "../_navigation";

type AdminDashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: AdminDashboardPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dashboard = getDashboardData(locale);

  return (
    <AdminShell locale={locale}>
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

      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-002 to ADMIN-017" title="Admin pages" />
        <div style={{ display: "grid", gap: 16 }}>
          {adminNavGroups.map((group) => (
            <div key={group.label} style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)"
                }}
              >
                {group.label}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {group.items.map((item) => (
                  <Link
                    key={item.key}
                    href={getAdminPageHref(locale, item.key)}
                    style={{ ...surfaceCardStyle, display: "grid", gap: 8, textDecoration: "none", color: "inherit" }}
                  >
                    <span style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {item.story}
                    </span>
                    <strong>{item.label}</strong>
                    <span style={{ color: "var(--muted)", lineHeight: 1.6 }}>{item.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
