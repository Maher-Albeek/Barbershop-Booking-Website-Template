import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/booking";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getContactContent } from "@/lib/site-config";

type BookingSuccessPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

export default async function BookingSuccessPage({
  params,
  searchParams
}: BookingSuccessPageProps) {
  const [{ locale }, { id }] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const booking = id ? getBookingById(id) : undefined;
  const contact = getContactContent(locale).items;

  return (
    <main
      lang={locale}
      dir={dictionary.direction}
      style={{ minHeight: "100vh", padding: "32px 20px 56px" }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gap: 24 }}>
        <section
          style={{
            borderRadius: 32,
            padding: "34px 28px",
            background:
              "linear-gradient(140deg, rgba(34, 51, 59, 0.95), rgba(61, 38, 21, 0.88) 56%, rgba(139, 94, 60, 0.82))",
            color: "#fffaf4",
            boxShadow: "var(--shadow)"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(255, 250, 244, 0.14)",
              border: "1px solid rgba(255, 250, 244, 0.18)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase"
            }}
          >
            {booking ? dictionary.booking.successEyebrow : dictionary.booking.successMissingTitle}
          </div>

          <h1 style={{ margin: "18px 0 12px", fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
            {booking ? dictionary.booking.successTitle : dictionary.booking.successMissingTitle}
          </h1>
          <p style={{ margin: 0, color: "rgba(255, 250, 244, 0.82)", lineHeight: 1.7 }}>
            {booking
              ? dictionary.booking.successDescription
              : dictionary.booking.successMissingDescription}
          </p>
        </section>

        {booking ? (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
              gap: 18
            }}
          >
            <div
              style={{
                borderRadius: 28,
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                boxShadow: "var(--shadow)",
                padding: 24,
                display: "grid",
                gap: 16
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 14
                }}
              >
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {dictionary.booking.referenceLabel}
                  </div>
                  <strong>{booking.id}</strong>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {dictionary.booking.selectedStatusLabel}
                  </div>
                  <strong>{dictionary.booking.confirmedStatus}</strong>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {dictionary.booking.selectServiceLabel}
                  </div>
                  <strong>{booking.serviceName}</strong>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {dictionary.booking.selectedEmployeeLabel}
                  </div>
                  <strong>{booking.employeeName}</strong>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {dictionary.booking.selectedDateLabel}
                  </div>
                  <strong>{booking.date}</strong>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {dictionary.booking.selectedTimeLabel}
                  </div>
                  <strong>
                    {booking.start} - {booking.end}
                  </strong>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {dictionary.booking.selectedPriceLabel}
                  </div>
                  <strong>{booking.priceSnapshot}</strong>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {dictionary.services.durationLabel}
                  </div>
                  <strong>{booking.durationSnapshot} min</strong>
                </div>
              </div>
            </div>

            <aside
              style={{
                borderRadius: 28,
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                boxShadow: "var(--shadow)",
                padding: 24,
                display: "grid",
                gap: 16,
                alignContent: "start"
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 24 }}>{dictionary.booking.contactTitle}</h2>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {contact.phone.label}
                  </div>
                  <strong>{contact.phone.value}</strong>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {contact.email.label}
                  </div>
                  <strong>{contact.email.value}</strong>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {contact.address.label}
                  </div>
                  <strong>{contact.address.value}</strong>
                </div>
              </div>
            </aside>
          </section>
        ) : null}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href={navHref(locale, "/booking")}
            style={{
              padding: "13px 18px",
              borderRadius: 999,
              background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
              color: "#fffaf4"
            }}
          >
            {dictionary.booking.backToBookingLabel}
          </Link>
          <Link
            href={navHref(locale, "/")}
            style={{
              padding: "13px 18px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: "var(--surface-strong)"
            }}
          >
            {dictionary.booking.backToHomeLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
