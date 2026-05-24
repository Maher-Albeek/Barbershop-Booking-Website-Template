import { notFound } from "next/navigation";
import { listFilteredBookings } from "@/lib/admin-data";
import { getActiveEmployees } from "@/lib/employee-fetch";
import { isLocale } from "@/lib/i18n";
import { getServicesContent } from "@/lib/site-config";
import { updateBookingStatusAction } from "../../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle,
  surfaceCardStyle
} from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminBookingPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    bookingDate?: string;
    bookingEmployee?: string;
    bookingService?: string;
    bookingStatus?: "confirmed" | "cancelled" | "completed" | "no_show";
  }>;
};

export default async function AdminBookingHeroPage({ params, searchParams }: AdminBookingPageProps) {
  const [{ locale }, filters] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  const dbEmployees = await getActiveEmployees();
  const employees = dbEmployees.map((emp) => ({
    slug: `employee-${emp.id}`,
    name: emp.name,
    isActive: emp.isActive
  }));

  const servicesContent = getServicesContent(locale);
  const services = servicesContent.services;

  const bookings = listFilteredBookings({
    date: filters.bookingDate,
    employeeSlug: filters.bookingEmployee,
    serviceSlug: filters.bookingService,
    status: filters.bookingStatus
  });

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-017" title="Manage booking page" />
        <PageHeroEditor
          locale={locale}
          page="booking"
          label="Booking page hero image"
          description="Upload the hero image used on the public booking page."
        />
      </section>

      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-007" title="Manage bookings data" />
        <form method="get" style={gridTwo}>
          <input type="date" name="bookingDate" defaultValue={filters.bookingDate} style={inputStyle} />
          <select name="bookingEmployee" defaultValue={filters.bookingEmployee ?? ""} style={inputStyle}>
            <option value="">All employees</option>
            {employees.map((member) => (
              <option key={member.slug} value={member.slug}>
                {member.name}
              </option>
            ))}
          </select>
          <select name="bookingService" defaultValue={filters.bookingService ?? ""} style={inputStyle}>
            <option value="">All services</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
          <select name="bookingStatus" defaultValue={filters.bookingStatus ?? ""} style={inputStyle}>
            <option value="">All statuses</option>
            <option value="confirmed">confirmed</option>
            <option value="cancelled">cancelled</option>
            <option value="completed">completed</option>
            <option value="no_show">no_show</option>
          </select>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Apply filters
          </button>
        </form>
        <div style={{ display: "grid", gap: 12 }}>
          {bookings.map((booking) => (
            <article key={booking.id} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <strong>
                  {booking.date} {booking.start}-{booking.end}
                </strong>
                <span>{booking.status}</span>
              </div>
              <div>
                {booking.customerName} · {booking.serviceName} · {booking.employeeName}
              </div>
              <div style={{ color: "var(--muted)" }}>Snapshot: {booking.priceSnapshot} · Ref: {booking.id}</div>
              <div style={{ color: "var(--muted)" }}>Email: {booking.email || "n/a"} · Notes: {booking.notes || "n/a"}</div>
              <form action={updateBookingStatusAction} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="bookingId" value={booking.id} />
                <select name="status" style={inputStyle}>
                  <option value={booking.status}>{booking.status}</option>
                  <option value="confirmed">confirmed</option>
                  <option value="cancelled">cancelled</option>
                  <option value="completed">completed</option>
                  <option value="no_show">no_show</option>
                </select>
                <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                  Update
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}