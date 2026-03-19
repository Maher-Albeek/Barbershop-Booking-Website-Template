import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listAvailableSlots } from "@/lib/booking";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig, getHeroImage, getServicesContent, getTeamContent } from "@/lib/site-config";
import { submitBooking } from "./actions";
import { FullscreenHero } from "@/components/fullscreen-hero";

type BookingPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    service?: string;
    employee?: string;
    date?: string;
    start?: string;
    slotEmployee?: string;
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
    employee?: string;
    date?: string;
    start?: string;
    slotEmployee?: string;
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

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const [
    { locale },
    { service, employee, date, start, slotEmployee, error, name, email, notes }
  ] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const servicesContent = getServicesContent(locale);
  const teamContent = getTeamContent(locale);
  const bookingConfig = siteConfig.booking;
  const activeServices = servicesContent.services.filter((item) => item.isActive);
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
        backgroundImageSrc={getHeroImage("booking")}
        navigation={dictionary.navigation.map((item) => ({
          label: item.label,
          href: navHref(locale, item.href)
        }))}
        primaryAction={{
          href: bookingHref(locale, {
            service: selectedService?.slug,
            employee: selectedEmployeeValue,
            date,
            start,
            slotEmployee,
            name,
            email,
            notes,
            error
          }),
          label: dictionary.actions.bookNow
        }}
        secondaryAction={
          contactNav
            ? { label: contactNav.label, href: navHref(locale, contactNav.href) }
            : undefined
        }
        localeItems={siteConfig.locales.map((item) => ({
          label: item,
          href: bookingHref(item, {
            service: selectedService?.slug,
            employee: selectedEmployeeValue,
            date,
            start,
            slotEmployee,
            name,
            email,
            notes,
            error
          }),
          isActive: item === locale
        }))}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 56px" }}>

        <section
          id="booking-flow"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.7fr) minmax(280px, 0.9fr)",
            gap: 18
          }}
        >
          <div style={{ display: "grid", gap: 18 }}>
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
                gap: 24
              }}
            >
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

              <section
                aria-disabled={!selectedService}
                style={{
                  display: "grid",
                  gap: 14,
                  paddingTop: 24,
                  borderTop: "1px solid var(--border)",
                  opacity: selectedService ? 1 : 0.52
                }}
              >
                <h3 style={{ margin: 0, fontSize: 24 }}>{dictionary.booking.detailsTitle}</h3>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                  {dictionary.booking.detailsDescription}
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: 14,
                    padding: 18,
                    borderRadius: 22,
                    border: "1px solid var(--border)",
                    background: "var(--surface)"
                  }}
                >
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
                    <h4 style={{ margin: 0, fontSize: 24 }}>{dictionary.booking.employeeStepTitle}</h4>
                    <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                      {dictionary.booking.employeeStepDescription}
                    </p>
                  </div>

                  {selectedService && eligibleEmployees.length > 0 ? (
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
                              : "var(--surface-strong)"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <input
                            id="employee-any"
                            type="radio"
                            name="employee"
                            value="any"
                            defaultChecked={selectedEmployeeValue === "any"}
                          />
                          <strong>{dictionary.booking.employeeAnyOption}</strong>
                        </div>
                        <span style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                          {dictionary.booking.employeeAnyDescription}
                        </span>
                      </label>

                      <div style={{ display: "grid", gap: 12 }}>
                        <strong style={{ fontSize: 15 }}>
                          {dictionary.booking.employeeSpecificLabel}
                        </strong>

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
                                    : "var(--surface-strong)"
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
                    </>
                  ) : selectedService ? (
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
                  ) : null}
                </div>
              </section>
            </form>

            <section
              style={{
                borderRadius: 28,
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                boxShadow: "var(--shadow)",
                padding: 24,
                display: "grid",
                gap: 18
              }}
            >
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
                      <input type="hidden" name="employee" value={selectedEmployeeValue} />
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
                                employee: selectedEmployeeValue,
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

            <form
              action={submitBooking}
              style={{
                borderRadius: 28,
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                boxShadow: "var(--shadow)",
                padding: 24,
                display: "grid",
                gap: 18
              }}
            >
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="service" value={selectedService?.slug ?? ""} />
              <input type="hidden" name="employee" value={selectedSlot?.employeeSlug ?? ""} />
              <input type="hidden" name="date" value={selectedSlot?.dateKey ?? ""} />
              <input type="hidden" name="start" value={selectedSlot?.start ?? ""} />

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
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                        {dictionary.booking.selectedStatusLabel}
                      </div>
                      <strong>{dictionary.booking.confirmedStatus}</strong>
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
                  name="customerName"
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
                {dictionary.booking.submitLabel}
              </button>
            </form>
          </div>

          <aside
            style={{
              borderRadius: 28,
              border: "1px solid var(--border)",
              background: "var(--surface-strong)",
              boxShadow: "var(--shadow)",
              padding: 24,
              display: "grid",
              gap: 18,
              alignContent: "start"
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--muted)"
                }}
              >
                {selectedService ? dictionary.booking.serviceStepLabel : dictionary.booking.eyebrow}
              </div>
              <h2 style={{ margin: "10px 0 8px", fontSize: 28 }}>
                {selectedService ? selectedService.name : dictionary.booking.noSelectionTitle}
              </h2>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                {selectedService
                  ? selectedService.description
                  : dictionary.booking.noSelectionDescription}
              </p>
            </div>

            {selectedService ? (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  padding: 18,
                  borderRadius: 20,
                  background: "var(--surface)"
                }}
              >
                <div>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                    {dictionary.services.durationLabel}
                  </div>
                  <strong>{selectedService.durationLabel}</strong>
                </div>

                <div>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                    {dictionary.booking.selectedPriceLabel}
                  </div>
                  <strong>
                    {selectedSlot?.priceLabel ??
                      (selectedService.pricing === "variable"
                        ? dictionary.services.variablePriceLabel
                        : `${dictionary.services.fixedPriceLabel}: ${selectedService.priceLabel}`)}
                  </strong>
                </div>

                <div>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                    {dictionary.booking.selectedEmployeeLabel}
                  </div>
                  <strong>{selectedSummaryEmployee}</strong>
                </div>

                {selectedSlot ? (
                  <>
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
                  </>
                ) : selectedEmployeeValue === "any" ? (
                  <div>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)" }}>
                      {dictionary.booking.slotWindowLabel}
                    </div>
                    <strong>{bookingConfig.searchWindowDays} days</strong>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div
              style={{
                borderRadius: 20,
                background: "rgba(214, 176, 125, 0.18)",
                padding: 18,
                color: "var(--brand-accent)",
                fontWeight: 700,
                lineHeight: 1.6,
                display: "grid",
                gap: 6
              }}
            >
              <span>{dictionary.booking.privacyNote}</span>
              <span>{dictionary.booking.slotTimezoneNote}</span>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
