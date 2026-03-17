import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listEmployeeBookings } from "@/lib/employee-data";
import { isLocale } from "@/lib/i18n";
import { EmployeeShell, cardStyle, inputStyle } from "../_components";
import { updateOwnBookingStatusAction } from "../actions";

type EmployeeBookingsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string; status?: string }>;
};

export default async function EmployeeBookingsPage({
  params,
  searchParams
}: EmployeeBookingsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();

  if (!session) {
    notFound();
  }

  const filters = await searchParams;
  const date = typeof filters.date === "string" ? filters.date : undefined;
  const status =
    filters.status === "confirmed" ||
    filters.status === "completed" ||
    filters.status === "no_show" ||
    filters.status === "cancelled"
      ? filters.status
      : undefined;
  const bookings = listEmployeeBookings(session, { date, status });

  return (
    <EmployeeShell
      locale={locale}
      title="Assigned bookings"
      description="Filter your own appointment list by day or status, then close out visits as completed or no-show."
      active="bookings"
      displayName={session.displayName}
    >
      <section style={cardStyle}>
        <form
          method="get"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12
          }}
        >
          <input type="date" name="date" defaultValue={date} style={inputStyle} />
          <select name="status" defaultValue={status ?? ""} style={inputStyle}>
            <option value="">All statuses</option>
            <option value="confirmed">confirmed</option>
            <option value="completed">completed</option>
            <option value="no_show">no_show</option>
            <option value="cancelled">cancelled</option>
          </select>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Apply filters
          </button>
        </form>
      </section>

      <section style={{ display: "grid", gap: 14 }}>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <article key={booking.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <strong>
                  {booking.date} {booking.start}-{booking.end}
                </strong>
                <span>{booking.status}</span>
              </div>
              <p style={{ margin: "10px 0 0" }}>
                {booking.customerName} · {booking.serviceName}
              </p>
              <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
                Email: {booking.email || "n/a"} · Price snapshot: {booking.priceSnapshot}
              </p>
              <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
                Notes: {booking.notes || "n/a"}
              </p>
              <form
                action={updateOwnBookingStatusAction}
                style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="bookingId" value={booking.id} />
                <select
                  name="status"
                  defaultValue={booking.status === "completed" || booking.status === "no_show" ? booking.status : "completed"}
                  style={{ ...inputStyle, maxWidth: 220 }}
                >
                  <option value="completed">completed</option>
                  <option value="no_show">no_show</option>
                </select>
                <button type="submit" style={{ ...inputStyle, maxWidth: 220, cursor: "pointer", fontWeight: 700 }}>
                  Save booking status
                </button>
              </form>
            </article>
          ))
        ) : (
          <article style={cardStyle}>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              No assigned bookings match the current filters.
            </p>
          </article>
        )}
      </section>
    </EmployeeShell>
  );
}
