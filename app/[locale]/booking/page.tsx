import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listAvailableSlots } from "@/lib/booking";
import { getContentSectionContainerStyle } from "@/lib/content-background-image";
import { getHeroImageUrl } from "@/lib/hero-image";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getOffersContent, getServicesContent, getTeamContent } from "@/lib/site-config";
import { submitBooking } from "./actions";
import { FullscreenHero } from "@/components/fullscreen-hero";

type BookingPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    service?: string;
    serviceConfirmed?: string;
    employee?: string;
    employeeConfirmed?: string;
    date?: string;
    start?: string;
    slotEmployee?: string;
    timeConfirmed?: string;
    customerConfirmed?: string;
    error?: string;
    name?: string;
    email?: string;
    notes?: string;
  }>;
};

type SlotResult = {
  dateKey: string;
  label: string;
  start: string;
  end: string;
  employeeSlug: string;
  employeeName: string;
  durationMinutes: number;
  priceLabel: string;
};

type BookingHref =
  | Route
  | {
      pathname: Route;
      query: Record<string, string>;
      hash: string;
    };

function formatDateLabel(locale: Locale, date: Date) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(date);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function navHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

function bookingHref(
  locale: Locale,
  params: {
    service?: string;
    serviceConfirmed?: string;
    employee?: string;
    employeeConfirmed?: string;
    date?: string;
    start?: string;
    slotEmployee?: string;
    timeConfirmed?: string;
    customerConfirmed?: string;
    name?: string;
    email?: string;
    notes?: string;
    error?: string;
  },
  hash?: string
) : BookingHref {
  const query: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query[key] = value;
    }
  }

  const pathname = `/${locale}/booking` as Route;

  if (hash) {
    return { pathname, query, hash };
  }

  const search = new URLSearchParams(query).toString();
  return `${pathname}${search ? `?${search}` : ""}` as Route;
}

function errorMessage(code: string | undefined, dictionary: ReturnType<typeof getDictionary>) {
  switch (code) {
    case "invalid_email":
      return dictionary.booking.errorInvalidEmail;
    case "invalid_selection":
      return dictionary.booking.errorInvalidSelection;
    case "slot_unavailable":
      return dictionary.booking.errorSlotUnavailable;
    case "missing_fields":
      return dictionary.booking.errorMissingFields;
    default:
      return "";
  }
}

function isOfferCurrentlyVisible(validFrom: string, validUntil: string) {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startsAt = new Date(`${validFrom}T00:00:00.000Z`);
  const endsAt = new Date(`${validUntil}T23:59:59.999Z`);

  return today >= startsAt && today <= endsAt;
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const [
    { locale },
    {
      service,
      serviceConfirmed,
      employee,
      employeeConfirmed,
      date,
      start,
      slotEmployee,
      timeConfirmed,
      customerConfirmed,
      error,
      name,
      email,
      notes
    }
  ] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const servicesContent = getServicesContent(locale);
  const offersContent = getOffersContent(locale);
  const teamContent = getTeamContent(locale);
  const bookingConfig = siteConfig.booking;
  const activeServices = servicesContent.services.filter((item) => item.isActive);
  const activeOffers = offersContent.offers
    .filter((offer) => offer.isActive && isOfferCurrentlyVisible(offer.validFrom, offer.validUntil))
    .map((offer) => ({
      ...offer,
      linkedService: offer.serviceSlug
        ? activeServices.find((serviceItem) => serviceItem.slug === offer.serviceSlug)
        : undefined
    }))
    .filter((offer) => Boolean(offer.linkedService));
  const selectedService = activeServices.find((item) => item.slug === service);
  const serviceAssignments = selectedService
    ? bookingConfig.employeeServices.filter(
        (assignment) => assignment.serviceSlug === selectedService.slug && assignment.isActive
      )
    : [];
  const eligibleEmployees = selectedService
    ? teamContent.members.filter(
        (member) =>
          member.isActive &&
          member.bookingServiceSlugs.includes(selectedService.slug) &&
          serviceAssignments.some((assignment) => assignment.employeeSlug === member.slug)
      )
    : [];
  const selectedEmployee =
    employee && employee !== "any"
      ? eligibleEmployees.find((member) => member.slug === employee)
      : undefined;
  const selectedEmployeeValue =
    !selectedService || !employee || employee === "any" || !selectedEmployee ? "any" : employee;

  const rawSlots = selectedService
    ? listAvailableSlots(
        locale,
        selectedService.slug,
        selectedEmployeeValue === "any" ? undefined : selectedEmployeeValue
      )
    : [];
  const calendarMinDate = toDateKey(new Date());
  const calendarMaxDate = toDateKey(addDays(new Date(), bookingConfig.searchWindowDays - 1));
  const scopedSlots = date ? rawSlots.filter((slot) => slot.dateKey === date) : rawSlots;
  const visibleSlots = scopedSlots
    .slice(0, selectedEmployeeValue === "any" ? 12 : 16)
    .map<SlotResult>((slot) => ({
      ...slot,
      label: formatDateLabel(locale, new Date(`${slot.dateKey}T00:00:00`))
    }));
  const slotsByDate = visibleSlots.reduce<Array<{ dateKey: string; label: string; slots: SlotResult[] }>>(
    (groups, slot) => {
      const existingGroup = groups.find((group) => group.dateKey === slot.dateKey);

      if (existingGroup) {
        existingGroup.slots.push(slot);
        return groups;
      }

      groups.push({
        dateKey: slot.dateKey,
        label: slot.label,
        slots: [slot]
      });
      return groups;
    },
    []
  );
  const selectedDateGroup = date ? slotsByDate.find((group) => group.dateKey === date) : undefined;
  const selectedDateLabel = date ? formatDateLabel(locale, new Date(`${date}T00:00:00`)) : undefined;
  const slotsForSelectedDate = selectedDateGroup?.slots ?? [];

  const selectedSlot =
    selectedService && date && start && slotEmployee
      ? listAvailableSlots(locale, selectedService.slug).find(
          (slot) =>
            slot.dateKey === date && slot.start === start && slot.employeeSlug === slotEmployee
        )
      : undefined;
  const selectedDuration =
    selectedEmployeeValue !== "any" && selectedEmployee
      ? serviceAssignments.find((item) => item.employeeSlug === selectedEmployee.slug)?.durationMinutes
      : undefined;
  const selectedSummaryEmployee =
    (selectedSlot &&
      eligibleEmployees.find((member) => member.slug === selectedSlot.employeeSlug)?.name) ||
    selectedEmployee?.name ||
    dictionary.booking.employeeAnyOption;
  const hasValidEmployeeSelection = employee === "any" || Boolean(selectedEmployee);
  const hasServiceStepConfirmed = Boolean(selectedService && serviceConfirmed === "1");
  const hasEmployeeStepConfirmed = Boolean(
    hasServiceStepConfirmed && hasValidEmployeeSelection && employeeConfirmed === "1"
  );
  const hasTimeStepConfirmed = Boolean(
    hasEmployeeStepConfirmed && selectedSlot && timeConfirmed === "1"
  );
  const hasCustomerStepConfirmed = Boolean(
    hasTimeStepConfirmed && name && customerConfirmed === "1"
  );
  const activeStep = !hasServiceStepConfirmed
    ? 1
    : !hasEmployeeStepConfirmed
      ? 2
      : !hasTimeStepConfirmed
        ? 3
        : !hasCustomerStepConfirmed
          ? 4
          : 5;
  const confirmedStepCount = hasCustomerStepConfirmed
    ? 4
    : hasTimeStepConfirmed
      ? 3
      : hasEmployeeStepConfirmed
        ? 2
        : hasServiceStepConfirmed
          ? 1
          : 0;
  const timelineProgressPercent = Math.round((confirmedStepCount / 4) * 100);
  const feedbackMessage = errorMessage(error, dictionary);
  const contactNav = dictionary.navigation.find((item) => item.href === "/contact");

  return (
    <main lang={locale} dir={dictionary.direction}>
      <FullscreenHero
        locale={locale}
        direction={dictionary.direction}
        brandName={siteConfig.brand.shopName}
        sinceLabel={dictionary.labels.since}
        logoText={siteConfig.brand.logoText}
        title={dictionary.booking.title}
        kicker={dictionary.booking.eyebrow}
        description={dictionary.booking.subtitle}
        navigation={dictionary.navigation.map((item) => ({
          label: item.label,
          href: navHref(locale, item.href)
        }))}
        heroImageUrl={getHeroImageUrl("booking")}
        secondaryAction={
          contactNav
            ? { label: contactNav.label, href: navHref(locale, contactNav.href) }
            : undefined
        }
        localeItems={siteConfig.locales.map((item) => ({
          label: item,
          href: bookingHref(item, {
            service: selectedService?.slug,
            serviceConfirmed,
            employee: selectedEmployeeValue,
            employeeConfirmed,
            date,
            start,
            slotEmployee,
            timeConfirmed,
            customerConfirmed,
            name,
            email,
            notes,
            error
          }),
          isActive: item === locale
        }))}
      />

      <div style={getContentSectionContainerStyle("booking")}>

        <section
          id="booking-flow"
          style={{
            display: "block"
          }}
        >
          <div style={{ display: "grid", gap: 18 }}>
            <section
              style={{
                borderRadius: 28,
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                boxShadow: "var(--shadow)",
                padding: 18,
                display: "grid",
                gap: 12
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--muted)"
                }}
              >
                Flow Timeline
              </div>
              <div className="booking-flow-loader" aria-hidden="true">
                <div
                  className="booking-flow-bar"
                  style={{ width: `${timelineProgressPercent}%` }}
                />
                <div className="booking-flow-nodes">
                  <div className="booking-flow-node booking-flow-node-start" />

                  {[2, 3, 4].map((index) => {
                    const isDone = activeStep >= index;

                    return (
                      <div
                        key={index}
                        className={`booking-flow-node booking-flow-check${
                          isDone ? " booking-flow-check-done" : ""
                        }`}
                      >
                        <svg
                          stroke="white"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="m4.5 12.75 6 6 9-13.5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 8,
                  fontSize: 12,
                  color: "var(--muted)"
                }}
              >
                {[
                  { index: 1, label: dictionary.booking.serviceStepTitle },
                  { index: 2, label: dictionary.booking.employeeStepTitle },
                  { index: 3, label: dictionary.booking.timeStepTitle },
                  { index: 4, label: dictionary.booking.customerStepTitle }
                ].map((step) => {
                  const isPrevious = step.index < activeStep;

                  if (!isPrevious) {
                    return <span key={step.index}>{step.label}</span>;
                  }

                  if (step.index === 1) {
                    return (
                      <Link
                        key={step.index}
                        href={bookingHref(locale, {
                          service: selectedService?.slug,
                          name,
                          email,
                          notes
                        }, "booking-flow")}
                        scroll={false}
                        style={{ color: "var(--brand-accent)", textDecoration: "underline" }}
                      >
                        {step.label}
                      </Link>
                    );
                  }

                  if (step.index === 2) {
                    return (
                      <Link
                        key={step.index}
                        href={bookingHref(locale, {
                          service: selectedService?.slug,
                          serviceConfirmed: "1",
                          employee: selectedEmployeeValue,
                          name,
                          email,
                          notes
                        }, "booking-flow")}
                        scroll={false}
                        style={{ color: "var(--brand-accent)", textDecoration: "underline" }}
                      >
                        {step.label}
                      </Link>
                    );
                  }

                  if (step.index === 3) {
                    return (
                      <Link
                        key={step.index}
                        href={bookingHref(locale, {
                          service: selectedService?.slug,
                          serviceConfirmed: "1",
                          employee: selectedEmployeeValue,
                          employeeConfirmed: "1",
                          date,
                          start,
                          slotEmployee,
                          name,
                          email,
                          notes
                        }, "booking-flow")}
                        scroll={false}
                        style={{ color: "var(--brand-accent)", textDecoration: "underline" }}
                      >
                        {step.label}
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={step.index}
                      href={bookingHref(locale, {
                        service: selectedService?.slug,
                        serviceConfirmed: "1",
                        employee: selectedEmployeeValue,
                        employeeConfirmed: "1",
                        date,
                        start,
                        slotEmployee,
                        timeConfirmed: "1",
                        name,
                        email,
                        notes
                      }, "booking-flow")}
                      scroll={false}
                      style={{ color: "var(--brand-accent)", textDecoration: "underline" }}
                    >
                      {step.label}
                    </Link>
                  );
                })}
              </div>
            </section>

            <style>{`
              .booking-flow-loader {
                position: relative;
                background: #535353;
                border-radius: 999px;
                height: 12px;
                width: 100%;
                max-width: 520px;
                margin: 6px 0 2px;
              }

              .booking-flow-bar {
                position: absolute;
                inset: 0 auto 0 0;
                background: rgb(0, 205, 0);
                border-radius: 999px;
                transition: width 360ms ease;
              }

              .booking-flow-nodes {
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                z-index: 2;
                display: flex;
                justify-content: space-between;
                align-items: center;
                pointer-events: none;
              }

              .booking-flow-node {
                height: 24px;
                width: 24px;
                border-radius: 999px;
                background: #535353;
                border: 2px solid #535353;
                display: grid;
                place-items: center;
                transform: scale(0.8);
              }

              .booking-flow-node-start {
                background: #535353;
                border-color: #535353;
                transform: scale(0.72);
              }

              .booking-flow-check {
                transition: transform 220ms ease, background-color 220ms ease, border-color 220ms ease;
              }

              .booking-flow-check svg {
                width: 15px;
                height: 15px;
                opacity: 0;
                transition: opacity 180ms ease;
              }

              .booking-flow-check-done {
                transform: scale(1);
                background: rgb(0, 205, 0);
                border-color: rgb(0, 205, 0);
                animation: bookingFlowCheckPop 240ms ease;
              }

              .booking-flow-check-done svg {
                opacity: 1;
              }

              @keyframes bookingFlowCheckPop {
                from {
                  transform: scale(0.82);
                }
                to {
                  transform: scale(1);
                }
              }

              @keyframes bookingStepSlideIn {
                from {
                  opacity: 0;
                  transform: translateX(22px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
            `}</style>

            {activeStep === 1 ? (
            <form
              action={`/${locale}/booking#booking-flow`}
              method="get"
              style={{
                borderRadius: 28,
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                boxShadow: "var(--shadow)",
                padding: 24,
                display: "grid",
                gap: 24,
                animation: "bookingStepSlideIn 320ms ease"
              }}
            >
              <input type="hidden" name="serviceConfirmed" value="1" />
              <input type="hidden" name="name" value={name ?? ""} />
              <input type="hidden" name="email" value={email ?? ""} />
              <input type="hidden" name="notes" value={notes ?? ""} />

              <section style={{ display: "grid", gap: 16 }}>
                <div style={{ display: "grid", gap: 8 }}>
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--muted)"
                    }}
                  >
                    {dictionary.booking.serviceStepLabel}
                  </div>
                  <h2 style={{ margin: 0, fontSize: 30 }}>{dictionary.booking.serviceStepTitle}</h2>
                  <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                    {dictionary.booking.serviceStepDescription}
                  </p>
                </div>

                {activeOffers.length > 0 ? (
                  <section
                    style={{
                      display: "grid",
                      gap: 10,
                      padding: 14,
                      borderRadius: 16,
                      border: "1px solid var(--border)",
                      background: "var(--surface)"
                    }}
                  >
                    <strong>
                      {dictionary.navigation.find((item) => item.href === "/offers")?.label ?? "Offers"}
                    </strong>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 10
                      }}
                    >
                      {activeOffers.map((offer) => (
                        <Link
                          key={offer.slug}
                          href={bookingHref(locale, {
                            service: offer.linkedService?.slug,
                            serviceConfirmed: "1",
                            name,
                            email,
                            notes
                          }, "booking-flow")}
                          scroll={false}
                          style={{
                            borderRadius: 14,
                            padding: 12,
                            border: "1px solid rgba(214, 176, 125, 0.28)",
                            background: "rgba(214, 176, 125, 0.12)",
                            display: "grid",
                            gap: 6,
                            textDecoration: "none",
                            color: "inherit"
                          }}
                        >
                          <strong>{offer.title}</strong>
                          <span style={{ color: "var(--muted)", fontSize: 14 }}>
                            {offer.linkedService?.name}
                          </span>
                          <span style={{ fontSize: 13, color: "var(--brand-accent)", fontWeight: 700 }}>
                            {dictionary.offers.validUntilLabel} {offer.validUntil}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                ) : null}

                <fieldset
                  style={{ margin: 0, padding: 0, border: "none", display: "grid", gap: 14 }}
                >
                  <legend style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                    {dictionary.booking.selectServiceLabel}
                  </legend>

                  {activeServices.map((item) => {
                    const isSelected = item.slug === selectedService?.slug;
                    const priceLabel =
                      item.pricing === "variable"
                        ? dictionary.services.variablePriceLabel
                        : `${dictionary.services.fixedPriceLabel}: ${item.priceLabel}`;

                    return (
                      <label
                        key={item.slug}
                        htmlFor={item.slug}
                        style={{
                          display: "grid",
                          gap: 10,
                          padding: 18,
                          borderRadius: 22,
                          border: isSelected
                            ? "1px solid var(--brand-accent)"
                            : "1px solid var(--border)",
                          background: isSelected ? "rgba(214, 176, 125, 0.14)" : "var(--surface)"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            flexWrap: "wrap"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <input
                              id={item.slug}
                              type="radio"
                              name="service"
                              value={item.slug}
                              required
                              defaultChecked={isSelected}
                            />
                            <strong style={{ fontSize: 22 }}>{item.name}</strong>
                          </div>

                          <span
                            style={{
                              borderRadius: 999,
                              padding: "8px 12px",
                              background: "rgba(214, 176, 125, 0.22)",
                              color: "var(--brand-accent)",
                              fontSize: 13,
                              fontWeight: 700
                            }}
                          >
                            {item.durationLabel}
                          </span>
                        </div>

                        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                          {item.description}
                        </p>

                        <div style={{ fontSize: 14, fontWeight: 700 }}>{priceLabel}</div>
                      </label>
                    );
                  })}
                </fieldset>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    alignItems: "center"
                  }}
                >
                  <p style={{ margin: 0, color: "var(--muted)" }}>{dictionary.booking.serviceHint}</p>
                  <button
                    type="submit"
                    style={{
                      padding: "13px 18px",
                      borderRadius: 999,
                      border: "none",
                      background:
                        "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                      color: "#fffaf4",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {dictionary.booking.selectServiceLabel}
                  </button>
                </div>
              </section>
            </form>
            ) : null}

            {activeStep === 2 && hasServiceStepConfirmed ? (
              <form
                action={`/${locale}/booking#booking-flow`}
                method="get"
                style={{
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  padding: 24,
                  display: "grid",
                  gap: 18,
                  animation: "bookingStepSlideIn 320ms ease"
                }}
              >
                <input type="hidden" name="service" value={selectedService?.slug ?? ""} />
                <input type="hidden" name="serviceConfirmed" value="1" />
                <input type="hidden" name="employeeConfirmed" value="1" />
                <input type="hidden" name="name" value={name ?? ""} />
                <input type="hidden" name="email" value={email ?? ""} />
                <input type="hidden" name="notes" value={notes ?? ""} />

                <div>
                  <Link
                    href={bookingHref(locale, {
                      service: selectedService?.slug,
                      name,
                      email,
                      notes
                    }, "booking-flow")}
                    scroll={false}
                    style={{ color: "var(--brand-accent)", textDecoration: "underline", fontSize: 14 }}
                  >
                    {dictionary.booking.backToServiceLabel}
                  </Link>
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--muted)"
                    }}
                  >
                    {dictionary.booking.employeeStepLabel}
                  </div>
                  <h3 style={{ margin: 0, fontSize: 24 }}>{dictionary.booking.employeeStepTitle}</h3>
                  <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                    {dictionary.booking.employeeStepDescription}
                  </p>
                </div>

                {eligibleEmployees.length > 0 ? (
                  <>
                    <label
                      htmlFor="employee-any"
                      style={{
                        display: "grid",
                        gap: 8,
                        padding: 18,
                        borderRadius: 20,
                        border:
                          selectedEmployeeValue === "any"
                            ? "1px solid var(--brand-accent)"
                            : "1px solid var(--border)",
                        background:
                          selectedEmployeeValue === "any"
                            ? "rgba(214, 176, 125, 0.14)"
                            : "var(--surface)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input
                          id="employee-any"
                          type="radio"
                          name="employee"
                          value="any"
                          required
                          defaultChecked={selectedEmployeeValue === "any"}
                        />
                        <strong>{dictionary.booking.employeeAnyOption}</strong>
                      </div>
                      <span style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                        {dictionary.booking.employeeAnyDescription}
                      </span>
                    </label>

                    <div style={{ display: "grid", gap: 12 }}>
                      <strong style={{ fontSize: 15 }}>{dictionary.booking.employeeSpecificLabel}</strong>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: 12
                        }}
                      >
                        {eligibleEmployees.map((member) => {
                          const isSelected = member.slug === selectedEmployeeValue;

                          return (
                            <label
                              key={member.slug}
                              htmlFor={member.slug}
                              style={{
                                display: "grid",
                                gap: 10,
                                padding: 18,
                                borderRadius: 20,
                                border: isSelected
                                  ? "1px solid var(--brand-accent)"
                                  : "1px solid var(--border)",
                                background: isSelected
                                  ? "rgba(214, 176, 125, 0.14)"
                                  : "var(--surface)"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <input
                                  id={member.slug}
                                  type="radio"
                                  name="employee"
                                  value={member.slug}
                                  defaultChecked={isSelected}
                                />
                                <strong>{member.name}</strong>
                              </div>

                              <span style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                                {member.bio ?? member.specialties.join(" - ")}
                              </span>

                              <span style={{ fontSize: 14 }}>
                                <strong>{dictionary.booking.employeeSpecialtiesLabel}:</strong>{" "}
                                {member.specialties.join(" - ")}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: "fit-content",
                        borderRadius: 999,
                        border: "none",
                        padding: "10px 16px",
                        fontWeight: 700,
                        background:
                          "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                        color: "#fffaf4",
                        cursor: "pointer"
                      }}
                    >
                      {dictionary.booking.employeeStepTitle}
                    </button>
                  </>
                ) : (
                  <div
                    style={{
                      borderRadius: 20,
                      padding: 18,
                      background: "rgba(214, 176, 125, 0.12)",
                      color: "var(--brand-accent)",
                      display: "grid",
                      gap: 8
                    }}
                  >
                    <strong>{dictionary.booking.employeeUnavailableTitle}</strong>
                    <span style={{ lineHeight: 1.6 }}>
                      {dictionary.booking.employeeUnavailableDescription}
                    </span>
                  </div>
                )}
              </form>
            ) : null}

            {activeStep === 3 && hasEmployeeStepConfirmed ? (
              <section
                style={{
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  padding: 24,
                  display: "grid",
                  gap: 18,
                  animation: "bookingStepSlideIn 320ms ease"
                }}
              >
              <div>
                <Link
                  href={bookingHref(locale, {
                    service: selectedService?.slug,
                    serviceConfirmed: "1",
                    employee: selectedEmployeeValue,
                    name,
                    email,
                    notes
                  }, "booking-flow")}
                  scroll={false}
                  style={{ color: "var(--brand-accent)", textDecoration: "underline", fontSize: 14 }}
                >
                  {dictionary.booking.backToEmployeeLabel}
                </Link>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--muted)"
                  }}
                >
                  {dictionary.booking.timeStepLabel}
                </div>
                <h3 style={{ margin: 0, fontSize: 26 }}>{dictionary.booking.timeStepTitle}</h3>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                  {selectedEmployeeValue === "any"
                    ? dictionary.booking.timeStepAnyDescription
                    : dictionary.booking.timeStepDescription}
                </p>
              </div>

              {selectedService && selectedEmployeeValue !== "any" && selectedDuration ? (
                <div
                  style={{
                    borderRadius: 16,
                    padding: 14,
                    background: "var(--surface)",
                    border: "1px solid var(--border)"
                  }}
                >
                  <strong>{dictionary.booking.durationForEmployeeLabel}:</strong> {selectedDuration} min
                </div>
              ) : null}

              {selectedService && visibleSlots.length > 0 ? (
                <div style={{ display: "grid", gap: 12 }}>
                  <section
                    style={{
                      display: "grid",
                      gap: 10,
                      padding: 14,
                      borderRadius: 16,
                      background: "var(--surface)",
                      border: "1px solid var(--border)"
                    }}
                  >
                    <strong>{dictionary.booking.selectedDateLabel}</strong>
                    <form
                      method="get"
                      action={`/${locale}/booking#booking-flow`}
                      style={{ display: "grid", gap: 10 }}
                    >
                      <input type="hidden" name="service" value={selectedService.slug} />
                      <input type="hidden" name="serviceConfirmed" value="1" />
                      <input type="hidden" name="employee" value={selectedEmployeeValue} />
                      <input type="hidden" name="employeeConfirmed" value="1" />
                      <input type="hidden" name="name" value={name ?? ""} />
                      <input type="hidden" name="email" value={email ?? ""} />
                      <input type="hidden" name="notes" value={notes ?? ""} />

                      <label style={{ display: "grid", gap: 8 }}>
                        <span style={{ color: "var(--muted)", fontSize: 14 }}>
                          {dictionary.booking.selectedDateLabel}
                        </span>
                        <input
                          type="date"
                          name="date"
                          defaultValue={date ?? ""}
                          min={calendarMinDate}
                          max={calendarMaxDate}
                          required
                          style={{
                            padding: "12px 14px",
                            borderRadius: 12,
                            border: "1px solid var(--border)",
                            background: "var(--surface-strong)"
                          }}
                        />
                      </label>

                      <button
                        type="submit"
                        style={{
                          width: "fit-content",
                          borderRadius: 999,
                          border: "none",
                          padding: "10px 16px",
                          fontWeight: 700,
                          background:
                            "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                          color: "#fffaf4",
                          cursor: "pointer"
                        }}
                      >
                        {dictionary.booking.timeStepTitle}
                      </button>
                    </form>
                  </section>

                  {date && slotsForSelectedDate.length > 0 ? (
                    <section
                      style={{
                        display: "grid",
                        gap: 10,
                        padding: 14,
                        borderRadius: 16,
                        background: "var(--surface)",
                        border: "1px solid var(--border)"
                      }}
                    >
                      <strong>{selectedDateLabel ?? date}</strong>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: 10
                        }}
                      >
                        {slotsForSelectedDate.map((slot) => {
                          const isActive =
                            selectedSlot?.dateKey === slot.dateKey &&
                            selectedSlot.start === slot.start &&
                            selectedSlot.employeeSlug === slot.employeeSlug;

                          return (
                            <Link
                              key={`${slot.employeeSlug}-${slot.dateKey}-${slot.start}`}
                              href={bookingHref(locale, {
                                service: selectedService.slug,
                                serviceConfirmed: "1",
                                employee: selectedEmployeeValue,
                                employeeConfirmed: "1",
                                date: slot.dateKey,
                                start: slot.start,
                                slotEmployee: slot.employeeSlug,
                                name,
                                email,
                                notes
                              },
                              "booking-flow"
                            )}
                              scroll={false}
                              style={{
                                borderRadius: 14,
                                padding: 12,
                                border: isActive
                                  ? "1px solid var(--brand-accent)"
                                  : "1px solid rgba(214, 176, 125, 0.28)",
                                background: isActive
                                  ? "rgba(214, 176, 125, 0.22)"
                                  : "rgba(214, 176, 125, 0.12)",
                                display: "grid",
                                gap: 6
                              }}
                            >
                              <strong>
                                {slot.start} - {slot.end}
                              </strong>
                              <span style={{ color: "var(--muted)", fontSize: 14 }}>
                                {slot.durationMinutes} min
                              </span>
                              <span style={{ fontSize: 14 }}>
                                <strong>{dictionary.booking.selectedPriceLabel}:</strong>{" "}
                                {slot.priceLabel}
                              </span>
                              {selectedEmployeeValue === "any" ? (
                                <span style={{ fontSize: 14 }}>
                                  <strong>{dictionary.booking.slotAssignedLabel}:</strong>{" "}
                                  {slot.employeeName}
                                </span>
                              ) : null}
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ) : date ? (
                    <div
                      style={{
                        borderRadius: 16,
                        padding: 16,
                        background: "rgba(214, 176, 125, 0.12)",
                        color: "var(--brand-accent)",
                        display: "grid",
                        gap: 8
                      }}
                    >
                      <strong>{dictionary.booking.slotEmptyTitle}</strong>
                      <span style={{ lineHeight: 1.6 }}>{dictionary.booking.slotEmptyDescription}</span>
                    </div>
                  ) : (
                    <div
                      style={{
                        borderRadius: 16,
                        border: "1px dashed var(--border)",
                        padding: 16,
                        background: "var(--surface)"
                      }}
                    >
                      {dictionary.booking.selectedDateLabel}
                    </div>
                  )}

                  {selectedSlot ? (
                    <form
                      method="get"
                      action={`/${locale}/booking#booking-flow`}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <input type="hidden" name="service" value={selectedService.slug} />
                      <input type="hidden" name="serviceConfirmed" value="1" />
                      <input type="hidden" name="employee" value={selectedEmployeeValue} />
                      <input type="hidden" name="employeeConfirmed" value="1" />
                      <input type="hidden" name="date" value={selectedSlot.dateKey} />
                      <input type="hidden" name="start" value={selectedSlot.start} />
                      <input type="hidden" name="slotEmployee" value={selectedSlot.employeeSlug} />
                      <input type="hidden" name="timeConfirmed" value="1" />
                      <input type="hidden" name="name" value={name ?? ""} />
                      <input type="hidden" name="email" value={email ?? ""} />
                      <input type="hidden" name="notes" value={notes ?? ""} />

                      <button
                        type="submit"
                        style={{
                          width: "fit-content",
                          borderRadius: 999,
                          border: "none",
                          padding: "10px 16px",
                          fontWeight: 700,
                          background:
                            "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                          color: "#fffaf4",
                          cursor: "pointer"
                        }}
                      >
                        {dictionary.booking.timeStepTitle}
                      </button>
                    </form>
                  ) : null}
                </div>
              ) : selectedService && (selectedEmployeeValue === "any" || selectedEmployee) ? (
                <div
                  style={{
                    borderRadius: 16,
                    padding: 16,
                    background: "rgba(214, 176, 125, 0.12)",
                    color: "var(--brand-accent)",
                    display: "grid",
                    gap: 8
                  }}
                >
                  <strong>{dictionary.booking.slotEmptyTitle}</strong>
                  <span style={{ lineHeight: 1.6 }}>{dictionary.booking.slotEmptyDescription}</span>
                </div>
              ) : (
                <div
                  style={{
                    borderRadius: 16,
                    border: "1px dashed var(--border)",
                    padding: 16,
                    background: "var(--surface)"
                  }}
                >
                  {dictionary.booking.timeStep}
                </div>
              )}
              </section>
            ) : null}

            {activeStep === 4 && hasTimeStepConfirmed ? (
              <form
                action={`/${locale}/booking#booking-flow`}
                method="get"
                style={{
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  padding: 24,
                  display: "grid",
                  gap: 18,
                  animation: "bookingStepSlideIn 320ms ease"
                }}
              >
              <div>
                <Link
                  href={bookingHref(locale, {
                    service: selectedService?.slug,
                    serviceConfirmed: "1",
                    employee: selectedEmployeeValue,
                    employeeConfirmed: "1",
                    date,
                    start,
                    slotEmployee,
                    name,
                    email,
                    notes
                  }, "booking-flow")}
                  scroll={false}
                  style={{ color: "var(--brand-accent)", textDecoration: "underline", fontSize: 14 }}
                >
                  {dictionary.booking.backToTimeLabel}
                </Link>
              </div>

              <input type="hidden" name="service" value={selectedService?.slug ?? ""} />
              <input type="hidden" name="serviceConfirmed" value="1" />
              <input type="hidden" name="employee" value={selectedEmployeeValue} />
              <input type="hidden" name="employeeConfirmed" value="1" />
              <input type="hidden" name="date" value={selectedSlot?.dateKey ?? ""} />
              <input type="hidden" name="start" value={selectedSlot?.start ?? ""} />
              <input type="hidden" name="slotEmployee" value={selectedSlot?.employeeSlug ?? ""} />
              <input type="hidden" name="timeConfirmed" value="1" />
              <input type="hidden" name="customerConfirmed" value="1" />

              <div style={{ display: "grid", gap: 6 }}>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--muted)"
                  }}
                >
                  {dictionary.booking.customerStepLabel}
                </div>
                <h3 style={{ margin: 0, fontSize: 26 }}>{dictionary.booking.customerStepTitle}</h3>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                  {dictionary.booking.customerStepDescription}
                </p>
              </div>

              {feedbackMessage ? (
                <div
                  style={{
                    borderRadius: 18,
                    padding: 16,
                    background: "rgba(190, 92, 75, 0.14)",
                    border: "1px solid rgba(190, 92, 75, 0.28)",
                    color: "#7f2619"
                  }}
                >
                  {feedbackMessage}
                </div>
              ) : null}

              {selectedSlot ? (
                <div
                  style={{
                    borderRadius: 20,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    padding: 18,
                    display: "grid",
                    gap: 12
                  }}
                >
                  <strong style={{ fontSize: 18 }}>{dictionary.booking.selectedSlotTitle}</strong>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.selectedDateLabel}
                      </div>
                      <strong>{selectedSlot.dateKey}</strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.selectedTimeLabel}
                      </div>
                      <strong>
                        {selectedSlot.start} - {selectedSlot.end}
                      </strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.selectedEmployeeLabel}
                      </div>
                      <strong>{selectedSlot.employeeName}</strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.selectedPriceLabel}
                      </div>
                      <strong>{selectedSlot.priceLabel}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    borderRadius: 20,
                    padding: 18,
                    background: "rgba(214, 176, 125, 0.12)",
                    color: "var(--brand-accent)",
                    display: "grid",
                    gap: 8
                  }}
                >
                  <strong>{dictionary.booking.noSlotTitle}</strong>
                  <span style={{ lineHeight: 1.6 }}>{dictionary.booking.noSlotDescription}</span>
                </div>
              )}

              <label style={{ display: "grid", gap: 8 }}>
                <span>{dictionary.booking.nameLabel}</span>
                <input
                  name="name"
                  defaultValue={name}
                  required
                  style={{
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "var(--surface)"
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span>{dictionary.booking.emailLabel}</span>
                <input
                  type="email"
                  name="email"
                  defaultValue={email}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "var(--surface)"
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span>{dictionary.booking.notesLabel}</span>
                <textarea
                  name="notes"
                  defaultValue={notes}
                  rows={4}
                  placeholder={dictionary.booking.notesHint}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    resize: "vertical"
                  }}
                />
              </label>

              <button
                type="submit"
                disabled={!selectedSlot || !selectedService}
                style={{
                  padding: "14px 18px",
                  borderRadius: 999,
                  border: "none",
                  background: !selectedSlot
                    ? "var(--border)"
                    : "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                  color: "#fffaf4",
                  fontWeight: 700,
                  cursor: !selectedSlot ? "not-allowed" : "pointer"
                }}
              >
                {dictionary.booking.continueToReviewLabel}
              </button>
              </form>
            ) : null}

            {activeStep === 5 && hasCustomerStepConfirmed ? (
              <form
                action={submitBooking}
                style={{
                  borderRadius: 28,
                  border: "1px solid var(--border)",
                  background: "var(--surface-strong)",
                  boxShadow: "var(--shadow)",
                  padding: 24,
                  display: "grid",
                  gap: 18,
                  animation: "bookingStepSlideIn 320ms ease"
                }}
              >
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="service" value={selectedService?.slug ?? ""} />
                <input type="hidden" name="employee" value={selectedSlot?.employeeSlug ?? ""} />
                <input type="hidden" name="date" value={selectedSlot?.dateKey ?? ""} />
                <input type="hidden" name="start" value={selectedSlot?.start ?? ""} />
                <input type="hidden" name="customerName" value={name ?? ""} />
                <input type="hidden" name="email" value={email ?? ""} />
                <input type="hidden" name="notes" value={notes ?? ""} />

                <div style={{ display: "grid", gap: 6 }}>
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--muted)"
                    }}
                  >
                    {dictionary.booking.reviewStepLabel}
                  </div>
                  <h3 style={{ margin: 0, fontSize: 26 }}>{dictionary.booking.reviewStepTitle}</h3>
                  <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                    {dictionary.booking.reviewStepDescription}
                  </p>
                </div>

                <div
                  style={{
                    borderRadius: 20,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    padding: 18,
                    display: "grid",
                    gap: 12
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap"
                    }}
                  >
                    <strong style={{ fontSize: 18 }}>{dictionary.booking.selectedSlotTitle}</strong>
                    <Link
                      href={bookingHref(locale, {
                        service: selectedService?.slug,
                        serviceConfirmed: "1",
                        employee: selectedEmployeeValue,
                        employeeConfirmed: "1",
                        date,
                        start,
                        slotEmployee,
                        name,
                        email,
                        notes
                      }, "booking-flow")}
                      scroll={false}
                      style={{ color: "var(--brand-accent)", textDecoration: "underline", fontSize: 14 }}
                    >
                      {dictionary.booking.editLabel}
                    </Link>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.serviceStepTitle}
                      </div>
                      <strong>{selectedService?.name}</strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.selectedEmployeeLabel}
                      </div>
                      <strong>{selectedSlot?.employeeName ?? selectedSummaryEmployee}</strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.selectedDateLabel}
                      </div>
                      <strong>{selectedSlot?.dateKey}</strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.selectedTimeLabel}
                      </div>
                      <strong>
                        {selectedSlot?.start} - {selectedSlot?.end}
                      </strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.selectedPriceLabel}
                      </div>
                      <strong>{selectedSlot?.priceLabel}</strong>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 20,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    padding: 18,
                    display: "grid",
                    gap: 12
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap"
                    }}
                  >
                    <strong style={{ fontSize: 18 }}>{dictionary.booking.reviewCustomerTitle}</strong>
                    <Link
                      href={bookingHref(locale, {
                        service: selectedService?.slug,
                        serviceConfirmed: "1",
                        employee: selectedEmployeeValue,
                        employeeConfirmed: "1",
                        date,
                        start,
                        slotEmployee,
                        timeConfirmed: "1",
                        name,
                        email,
                        notes
                      }, "booking-flow")}
                      scroll={false}
                      style={{ color: "var(--brand-accent)", textDecoration: "underline", fontSize: 14 }}
                    >
                      {dictionary.booking.editLabel}
                    </Link>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.nameLabel}
                      </div>
                      <strong>{name}</strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.emailLabel}
                      </div>
                      <strong>{email || "-"}</strong>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.notesLabel}
                      </div>
                      <strong>{notes || "-"}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedSlot || !selectedService || !name}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 999,
                    border: "none",
                    background: !selectedSlot || !name
                      ? "var(--border)"
                      : "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                    color: "#fffaf4",
                    fontWeight: 700,
                    cursor: !selectedSlot || !name ? "not-allowed" : "pointer"
                  }}
                >
                  {dictionary.booking.submitLabel}
                </button>
              </form>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
