import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelBooking } from "../actions";
import { getBookingById } from "@/lib/booking";
import { getHeroImageUrl } from "@/lib/hero-image";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getContactContent, siteConfig } from "@/lib/site-config";
import { FullscreenHero } from "@/components/fullscreen-hero";

type BookingSuccessPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; cancelled?: string }>;
};

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

export default async function BookingSuccessPage({
  params,
  searchParams
}: BookingSuccessPageProps) {
  const [{ locale }, { id, cancelled }] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const booking = id ? getBookingById(id) : undefined;
  const wasCancelled = cancelled === "1";
  const contact = getContactContent(locale).items;
  const contactNav = dictionary.navigation.find((item) => item.href === "/contact");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <FullscreenHero
        locale={locale}
        direction={dictionary.direction}
        brandName={siteConfig.brand.shopName}
        sinceLabel={dictionary.labels.since}
        logoText={siteConfig.brand.logoText}
        title={booking ? dictionary.booking.successTitle : dictionary.booking.successMissingTitle}
        kicker={booking ? dictionary.booking.successEyebrow : dictionary.booking.successMissingTitle}
        description={
          booking ? dictionary.booking.successDescription : dictionary.booking.successMissingDescription
        }
        navigation={dictionary.navigation.map((item) => ({
          label: item.label,
          href: navHref(locale, item.href)
        }))}
        primaryAction={{
          href: navHref(locale, "/booking"),
          label: dictionary.booking.backToBookingLabel
        }}
        heroImageUrl={getHeroImageUrl("home")}
        secondaryAction={
          contactNav
            ? { label: contactNav.label, href: navHref(locale, contactNav.href) }
            : { label: dictionary.booking.backToHomeLabel, href: navHref(locale, "/") }
        }
      />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px 56px", display: "grid", gap: 24 }}>

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
                  <strong>
                    {booking.status === "cancelled"
                      ? dictionary.booking.cancelledStatus
                      : dictionary.booking.confirmedStatus}
                  </strong>
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

        {booking && booking.status === "cancelled" && wasCancelled ? (
          <p
            style={{
              margin: 0,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(89, 35, 22, 0.28)",
              background: "rgba(166, 90, 70, 0.1)",
              color: "#592316"
            }}
          >
            {dictionary.booking.cancellationSuccessMessage}
          </p>
        ) : null}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {booking && booking.status !== "cancelled" ? (
            <form action={cancelBooking}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={booking.id} />
              <button
                type="submit"
                style={{
                  padding: "13px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(89, 35, 22, 0.35)",
                  background: "#fff1ec",
                  color: "#592316",
                  cursor: "pointer",
                  font: "inherit"
                }}
              >
                {dictionary.booking.cancelBookingLabel}
              </button>
            </form>
          ) : null}
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
