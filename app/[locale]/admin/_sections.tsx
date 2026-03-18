import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildWeekdaySummary,
  getBlockedTimeSummary,
  getBookingOptions,
  getDashboardData,
  listFilteredBookings
} from "@/lib/admin-data";
import { getSession } from "@/lib/auth";
import { authUsers } from "@/lib/auth-users";
import { isLocale, locales } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import {
  deleteAssignmentAction,
  deleteBlockedTimeAction,
  deleteEmployeeAction,
  deleteGalleryAction,
  deleteOfferAction,
  deleteServiceAction,
  updateBookingStatusAction,
  updateContactContentAction,
  updateEmailSettingsAction,
  updateShopSettingsAction,
  upsertAssignmentAction,
  upsertBlockedTimeAction,
  upsertEmployeeAction,
  upsertGalleryAction,
  upsertOfferAction,
  upsertServiceAction,
  upsertWorkingHoursAction
} from "./actions";
import {
  LocaleFields,
  SectionTitle,
  gridTwo,
  inputStyle,
  localeLabels,
  sectionStyle,
  surfaceCardStyle,
  weekdayLabels
} from "./_components";
import { GalleryImagePicker } from "./GalleryImagePicker";

export type AdminSearchFilters = {
  bookingDate?: string;
  bookingEmployee?: string;
  bookingService?: string;
  bookingStatus?: "confirmed" | "cancelled" | "completed" | "no_show";
  editService?: string;
  editEmployee?: string;
  editOffer?: string;
};

export async function getAdminPageState(localeValue: string, filters: AdminSearchFilters = {}) {
  if (!isLocale(localeValue)) {
    notFound();
  }

  const locale = localeValue;
  const session = await getSession();
  const dashboard = getDashboardData(locale);
  const options = getBookingOptions(locale);
  const serviceToEdit = filters.editService
    ? siteConfig.services[locale].services.find((service) => service.slug === filters.editService)
    : undefined;
  const employeeToEdit = filters.editEmployee
    ? siteConfig.team[locale].members.find((member) => member.slug === filters.editEmployee)
    : undefined;
  const offerToEdit = filters.editOffer
    ? siteConfig.offers[locale].offers.find((offer) => offer.slug === filters.editOffer)
    : undefined;
  const employeeLogin = employeeToEdit
    ? authUsers.find((user) => user.role === "employee" && user.employeeSlug === employeeToEdit.slug)
    : undefined;
  const bookings = listFilteredBookings({
    date: filters.bookingDate,
    employeeSlug: filters.bookingEmployee,
    serviceSlug: filters.bookingService,
    status: filters.bookingStatus
  });

  return {
    locale,
    session,
    dashboard,
    options,
    filters,
    serviceToEdit,
    employeeToEdit,
    offerToEdit,
    employeeLogin,
    bookings,
    currentLocaleLabel: localeLabels[locale]
  };
}

type AdminPageState = Awaited<ReturnType<typeof getAdminPageState>>;

function getServiceName(locale: keyof typeof siteConfig.services, serviceSlug: string) {
  return siteConfig.services[locale].services.find((service) => service.slug === serviceSlug)?.name;
}

export function AdminOverviewSection({ locale, dashboard }: AdminPageState) {
  return (
    <>
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}
      >
        {[
          ["Buchungen gesamt", String(dashboard.metrics.totalBookings)],
          ["Mitarbeiter", String(dashboard.metrics.employees)],
          ["Dienstleistungen", String(dashboard.metrics.services)],
          ["Aktive Angebote", String(dashboard.metrics.activeOffers)]
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
        <SectionTitle story="ADMIN-001" title="Uebersicht der letzten Buchungen" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                <th style={{ paddingBottom: 10 }}>Datum</th>
                <th style={{ paddingBottom: 10 }}>Kunde</th>
                <th style={{ paddingBottom: 10 }}>Dienstleistung</th>
                <th style={{ paddingBottom: 10 }}>Barbier</th>
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
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={`/${locale}/admin/bookings`} style={{ ...inputStyle, maxWidth: 260, textAlign: "center" }}>
            Alle Buchungen verwalten
          </Link>
          <Link href={`/${locale}/admin/services`} style={{ ...inputStyle, maxWidth: 260, textAlign: "center" }}>
            Dienstleistungen oeffnen
          </Link>
        </div>
      </section>
    </>
  );
}

export function AdminServicesSection({ locale, serviceToEdit, currentLocaleLabel }: AdminPageState) {
  return (
    <section style={sectionStyle}>
      <SectionTitle story="ADMIN-002" title="Dienstleistungen verwalten" />
      <div style={gridTwo}>
        {siteConfig.services[locale].services.map((service) => (
          <article key={service.slug} style={surfaceCardStyle}>
            <strong>{service.name}</strong>
            <div style={{ color: "var(--muted)", marginTop: 8 }}>{service.slug}</div>
            <div style={{ marginTop: 8 }}>
              {service.isActive ? "Aktiv" : "Inaktiv"} | {service.durationLabel}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <Link href={`/${locale}/admin/services?editService=${service.slug}`}>Bearbeiten</Link>
              <form action={deleteServiceAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="serviceSlug" value={service.slug} />
                <button
                  type="submit"
                  style={{
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
      <form action={upsertServiceAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="locale" value={locale} />
        <div style={gridTwo}>
          <input
            name="serviceSlug"
            defaultValue={serviceToEdit?.slug ?? ""}
            placeholder="Vorhandener Slug"
            style={inputStyle}
          />
          <input name="slug" placeholder="Neuen Slug ueberschreiben" style={inputStyle} />
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" name="isActive" defaultChecked={serviceToEdit?.isActive ?? true} />
            Dienstleistung aktiv
          </label>
        </div>
        {serviceToEdit ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ color: "var(--muted)" }}>
              Bearbeite <strong style={{ color: "inherit" }}>{serviceToEdit.name}</strong>
            </div>
            <Link href={`/${locale}/admin/services`}>Formular leeren</Link>
          </div>
        ) : null}
        <div style={gridTwo}>
          <LocaleFields title={`${currentLocaleLabel} Inhalt`}>
            <input
              name={`name_${locale}`}
              defaultValue={serviceToEdit?.name ?? ""}
              placeholder="Name"
              style={inputStyle}
            />
            <input
              name={`description_${locale}`}
              defaultValue={serviceToEdit?.description ?? ""}
              placeholder="Beschreibung"
              style={inputStyle}
            />
            <input
              name={`duration_${locale}`}
              defaultValue={serviceToEdit?.durationLabel ?? ""}
              placeholder="Dauerbezeichnung"
              style={inputStyle}
            />
            <input
              name={`price_${locale}`}
              defaultValue={serviceToEdit?.priceLabel ?? ""}
              placeholder="Preisbezeichnung"
              style={inputStyle}
            />
          </LocaleFields>
        </div>
        <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
          {serviceToEdit ? "Dienstleistung aktualisieren" : "Dienstleistung speichern"}
        </button>
      </form>
    </section>
  );
}

export function AdminEmployeesSection({
  locale,
  employeeToEdit,
  employeeLogin,
  currentLocaleLabel
}: AdminPageState) {
  return (
    <section style={sectionStyle}>
      <SectionTitle story="ADMIN-003" title="Mitarbeiter verwalten" />
      <div style={gridTwo}>
        {siteConfig.team[locale].members.map((member) => (
          <article key={member.slug} style={surfaceCardStyle}>
            <strong>{member.name}</strong>
            <div style={{ color: "var(--muted)", marginTop: 8 }}>{member.slug}</div>
            <div style={{ marginTop: 8 }}>{member.isActive ? "Aktiv" : "Inaktiv"}</div>
            <div style={{ marginTop: 8, color: "var(--muted)" }}>{member.specialties.join(", ")}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <Link href={`/${locale}/admin/employees?editEmployee=${member.slug}`}>Bearbeiten</Link>
              <form action={deleteEmployeeAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="employeeSlug" value={member.slug} />
                <button
                  type="submit"
                  style={{
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
      <form action={upsertEmployeeAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="locale" value={locale} />
        <div style={gridTwo}>
          <input
            name="employeeSlug"
            defaultValue={employeeToEdit?.slug ?? ""}
            placeholder="Vorhandener Slug"
            style={inputStyle}
          />
          <input name="slug" placeholder="Neuen Slug ueberschreiben" style={inputStyle} />
          <input
            name="loginEmail"
            defaultValue={employeeLogin?.email ?? ""}
            placeholder="Login-E-Mail des Mitarbeiters"
            style={inputStyle}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" name="isActive" defaultChecked={employeeToEdit?.isActive ?? true} />
            Active employee
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" name="linkLogin" defaultChecked={Boolean(employeeLogin)} />
            Create/link login
          </label>
        </div>
        {employeeToEdit ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ color: "var(--muted)" }}>
              Bearbeite <strong style={{ color: "inherit" }}>{employeeToEdit.name}</strong>
            </div>
            <Link href={`/${locale}/admin/employees`}>Formular leeren</Link>
          </div>
        ) : null}
        <div style={gridTwo}>
          <LocaleFields title={`${currentLocaleLabel} Inhalt`}>
            <input
              name={`name_${locale}`}
              defaultValue={employeeToEdit?.name ?? ""}
              placeholder="Anzeigename"
              style={inputStyle}
            />
            <input
              name={`image_${locale}`}
              defaultValue={employeeToEdit?.imageSrc ?? ""}
              placeholder="Avatar-URL"
              style={inputStyle}
            />
            <input
              name={`specialties_${locale}`}
              defaultValue={(employeeToEdit?.specialties ?? []).join(", ")}
              placeholder="Spezialisierungen, kommagetrennt"
              style={inputStyle}
            />
            <textarea
              name={`bio_${locale}`}
              rows={4}
              defaultValue={employeeToEdit?.bio ?? ""}
              placeholder="Kurzprofil"
              style={inputStyle}
            />
          </LocaleFields>
        </div>
        <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
          {employeeToEdit ? "Mitarbeiter aktualisieren" : "Mitarbeiter speichern"}
        </button>
      </form>
    </section>
  );
}

export function AdminScheduleSection({ locale }: AdminPageState) {
  return (
    <section style={sectionStyle}>
      <SectionTitle
        story="ADMIN-004 / ADMIN-005 / ADMIN-006"
        title="Zuweisungen, Arbeitszeiten und Sperrzeiten"
      />
      <div style={{ display: "grid", gap: 18 }}>
        {siteConfig.team[locale].members.map((member) => {
          const assignments = siteConfig.booking.employeeServices.filter(
            (entry) => entry.employeeSlug === member.slug
          );
          const blockedTimes = getBlockedTimeSummary(member.slug);

          return (
            <article key={member.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "baseline"
                }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  <strong style={{ fontSize: "1.05rem" }}>{member.name}</strong>
                  <span style={{ color: "var(--muted)" }}>{member.slug}</span>
                </div>
                <span style={{ color: "var(--muted)" }}>
                  Arbeitszeiten: {buildWeekdaySummary(member.slug) || "keine"}
                </span>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <strong>Zuweisungen</strong>
                {assignments.length > 0 ? (
                  <div style={{ display: "grid", gap: 12 }}>
                    {assignments.map((entry) => (
                      <div
                        key={`${entry.employeeSlug}-${entry.serviceSlug}`}
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: 16,
                          padding: 14,
                          display: "grid",
                          gap: 12
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>
                          {getServiceName(locale, entry.serviceSlug) ?? entry.serviceSlug}
                        </div>
                        <form
                          action={upsertAssignmentAction}
                          style={{
                            display: "grid",
                            gap: 12,
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
                          }}
                        >
                          <input type="hidden" name="locale" value={locale} />
                          <input type="hidden" name="employeeSlug" value={member.slug} />
                          <input type="hidden" name="serviceSlug" value={entry.serviceSlug} />
                          <input
                            name="durationMinutes"
                            type="number"
                            min="5"
                            step="5"
                            defaultValue={entry.durationMinutes}
                            style={inputStyle}
                          />
                          <input name="priceLabel" defaultValue={entry.priceLabel} style={inputStyle} />
                          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <input type="checkbox" name="isActive" defaultChecked={entry.isActive} />
                            Zuweisung aktiv
                          </label>
                          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                            Zuweisung speichern
                          </button>
                        </form>
                        <form action={deleteAssignmentAction}>
                          <input type="hidden" name="locale" value={locale} />
                          <input type="hidden" name="employeeSlug" value={member.slug} />
                          <input type="hidden" name="serviceSlug" value={entry.serviceSlug} />
                          <button type="submit" style={{ ...inputStyle, cursor: "pointer", maxWidth: 200 }}>
                            Zuweisung loeschen
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "var(--muted)" }}>
                    Fuer diesen Mitarbeiter sind keine Zuweisungen gespeichert.
                  </div>
                )}
                <form action={upsertAssignmentAction} style={{ ...sectionStyle, gap: 12 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="employeeSlug" value={member.slug} />
                  <strong>Zuweisung hinzufuegen</strong>
                  <select name="serviceSlug" style={inputStyle}>
                    {siteConfig.services[locale].services.map((service) => (
                      <option key={service.slug} value={service.slug}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <input
                    name="durationMinutes"
                    type="number"
                    min="5"
                    step="5"
                    placeholder="Dauer in Minuten"
                    style={inputStyle}
                  />
                  <input name="priceLabel" placeholder="Preisbezeichnung" style={inputStyle} />
                  <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input type="checkbox" name="isActive" defaultChecked />
                    Zuweisung aktiv
                  </label>
                  <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    Zuweisung hinzufuegen
                  </button>
                </form>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <strong>Woechentliche Arbeitszeiten</strong>
                <div style={{ display: "grid", gap: 10 }}>
                  {weekdayLabels.map((day) => {
                    const existingHours = siteConfig.booking.workingHours.find(
                      (entry) => entry.employeeSlug === member.slug && entry.weekday === day.value
                    );

                    return (
                      <form
                        key={`${member.slug}-${day.value}`}
                        action={upsertWorkingHoursAction}
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: 16,
                          padding: 14,
                          display: "grid",
                          gap: 12,
                          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))"
                        }}
                      >
                        <input type="hidden" name="locale" value={locale} />
                        <input type="hidden" name="employeeSlug" value={member.slug} />
                        <input type="hidden" name="weekday" value={day.value} />
                        <div style={{ alignSelf: "center", fontWeight: 700 }}>{day.label}</div>
                        <input
                          name="start"
                          type="time"
                          defaultValue={existingHours?.isOff ? "" : existingHours?.start}
                          style={inputStyle}
                        />
                        <input
                          name="end"
                          type="time"
                          defaultValue={existingHours?.isOff ? "" : existingHours?.end}
                          style={inputStyle}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <input type="checkbox" name="isOff" defaultChecked={existingHours?.isOff ?? false} />
                          Freier Tag
                        </label>
                        <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                          Save {day.label}
                        </button>
                      </form>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <strong>Sperrzeiten</strong>
                {blockedTimes.length > 0 ? (
                  <div style={{ display: "grid", gap: 12 }}>
                    {blockedTimes.map((entry) => (
                      <div
                        key={`${entry.date}-${entry.start}-${entry.end}`}
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: 16,
                          padding: 14,
                          display: "grid",
                          gap: 12
                        }}
                      >
                        <form
                          action={upsertBlockedTimeAction}
                          style={{
                            display: "grid",
                            gap: 12,
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
                          }}
                        >
                          <input type="hidden" name="locale" value={locale} />
                          <input type="hidden" name="employeeSlug" value={member.slug} />
                          <input type="hidden" name="originalDate" value={entry.date} />
                          <input type="hidden" name="originalStart" value={entry.start} />
                          <input type="hidden" name="originalEnd" value={entry.end} />
                          <input name="date" type="date" defaultValue={entry.date} style={inputStyle} />
                          <input name="start" type="time" defaultValue={entry.start} style={inputStyle} />
                          <input name="end" type="time" defaultValue={entry.end} style={inputStyle} />
                          <input
                            name="reason"
                            defaultValue={entry.reason ?? ""}
                            placeholder="Optionaler Grund"
                            style={inputStyle}
                          />
                          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                            Sperrzeit speichern
                          </button>
                        </form>
                        <form action={deleteBlockedTimeAction}>
                          <input type="hidden" name="locale" value={locale} />
                          <input type="hidden" name="employeeSlug" value={member.slug} />
                          <input type="hidden" name="date" value={entry.date} />
                          <input type="hidden" name="start" value={entry.start} />
                          <input type="hidden" name="end" value={entry.end} />
                          <button type="submit" style={{ ...inputStyle, cursor: "pointer", maxWidth: 220 }}>
                            Sperrzeit loeschen
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "var(--muted)" }}>
                    Fuer diesen Mitarbeiter sind keine Sperrzeiten gespeichert.
                  </div>
                )}
                <form action={upsertBlockedTimeAction} style={{ ...sectionStyle, gap: 12 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="employeeSlug" value={member.slug} />
                  <strong>Sperrzeit hinzufuegen</strong>
                  <input name="date" type="date" style={inputStyle} />
                  <input name="start" type="time" style={inputStyle} />
                  <input name="end" type="time" style={inputStyle} />
                  <input name="reason" placeholder="Optionaler Grund" style={inputStyle} />
                  <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    Sperrzeit hinzufuegen
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function AdminBookingsSection({ locale, filters, options, bookings }: AdminPageState) {
  return (
    <section style={sectionStyle}>
      <SectionTitle story="ADMIN-007" title="Buchungen verwalten" />
      <form method="get" style={gridTwo}>
        <input type="date" name="bookingDate" defaultValue={filters.bookingDate} style={inputStyle} />
        <select name="bookingEmployee" defaultValue={filters.bookingEmployee ?? ""} style={inputStyle}>
          <option value="">Alle Mitarbeiter</option>
          {options.employees.map((member) => (
            <option key={member.slug} value={member.slug}>
              {member.name}
            </option>
          ))}
        </select>
        <select name="bookingService" defaultValue={filters.bookingService ?? ""} style={inputStyle}>
          <option value="">Alle Dienstleistungen</option>
          {options.services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
        <select name="bookingStatus" defaultValue={filters.bookingStatus ?? ""} style={inputStyle}>
          <option value="">Alle Status</option>
          <option value="confirmed">confirmed</option>
          <option value="cancelled">cancelled</option>
          <option value="completed">completed</option>
          <option value="no_show">no_show</option>
        </select>
        <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
          Filter anwenden
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
              {booking.customerName} | {booking.serviceName} | {booking.employeeName}
            </div>
            <div style={{ color: "var(--muted)" }}>
              Snapshot: {booking.priceSnapshot} | Ref.: {booking.id}
            </div>
            <div style={{ color: "var(--muted)" }}>
              E-Mail: {booking.email || "k. A."} | Notizen: {booking.notes || "k. A."}
            </div>
            <form action={updateBookingStatusAction} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="bookingId" value={booking.id} />
              <select name="status" defaultValue={booking.status} style={{ ...inputStyle, maxWidth: 220 }}>
                <option value="confirmed">confirmed</option>
                <option value="cancelled">cancelled</option>
                <option value="completed">completed</option>
                <option value="no_show">no_show</option>
              </select>
              <button type="submit" style={{ ...inputStyle, maxWidth: 180, cursor: "pointer", fontWeight: 700 }}>
                Status aktualisieren
              </button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AdminGallerySection({ locale }: AdminPageState) {
  return (
    <section style={sectionStyle}>
      <SectionTitle story="ADMIN-008" title="Galerie verwalten" />
      <div style={gridTwo}>
        {siteConfig.gallery[locale].images
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map((image) => (
            <article key={image.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <img
                src={image.imageSrc}
                alt={image.alt}
                style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 14 }}
              />
              <strong>{image.caption}</strong>
              <div style={{ color: "var(--muted)" }}>
                {image.slug} | Reihenfolge {image.sortOrder} | {image.isVisible ? "sichtbar" : "ausgeblendet"}
              </div>
              <form action={upsertGalleryAction} style={{ display: "grid", gap: 10 }}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="slug" value={image.slug} />
                <input type="hidden" name="currentImageSrc" value={image.imageSrc} />
                <GalleryImagePicker name="imageFile" initialPreview={image.imageSrc} />
                <input name="alt" defaultValue={image.alt} placeholder="Alt-Text" style={inputStyle} />
                <input
                  name="caption"
                  defaultValue={image.caption}
                  placeholder="Bildunterschrift"
                  style={inputStyle}
                />
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={image.sortOrder}
                  placeholder="Sortierreihenfolge"
                  style={inputStyle}
                />
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" name="isVisible" defaultChecked={image.isVisible} />
                  In oeffentlicher Galerie sichtbar
                </label>
                <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                  Aenderungen speichern
                </button>
              </form>
              <form action={deleteGalleryAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="slug" value={image.slug} />
                <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                  Bild loeschen
                </button>
              </form>
            </article>
          ))}
      </div>
      <form action={upsertGalleryAction} style={gridTwo}>
        <input type="hidden" name="locale" value={locale} />
        <input name="slug" placeholder="Slug (optional)" style={inputStyle} />
        <GalleryImagePicker name="imageFile" />
        <input name="alt" placeholder="Alt-Text" style={inputStyle} />
        <input name="caption" placeholder="Bildunterschrift" style={inputStyle} />
        <input name="sortOrder" type="number" placeholder="Sortierreihenfolge" style={inputStyle} />
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" name="isVisible" defaultChecked />
          In oeffentlicher Galerie sichtbar
        </label>
        <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
          Galeriebild speichern
        </button>
      </form>
    </section>
  );
}

export function AdminOffersSection({ locale, offerToEdit, currentLocaleLabel }: AdminPageState) {
  return (
    <section style={sectionStyle}>
      <SectionTitle story="ADMIN-009" title="Angebote verwalten" />
      <div style={gridTwo}>
        {siteConfig.offers[locale].offers.map((offer) => (
          <article key={offer.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
            <strong>{offer.title}</strong>
            <div style={{ color: "var(--muted)" }}>
              {offer.validFrom} bis {offer.validUntil}
            </div>
            <div>{offer.isActive ? "Aktiv" : "Inaktiv"}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href={`/${locale}/admin/offers?editOffer=${offer.slug}`}>Bearbeiten</Link>
              <form action={deleteOfferAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="slug" value={offer.slug} />
                <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                  Angebot loeschen
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
      <form action={upsertOfferAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="locale" value={locale} />
        <div style={gridTwo}>
          <input
            name="offerSlug"
            defaultValue={offerToEdit?.slug ?? ""}
            placeholder="Vorhandener Slug"
            style={inputStyle}
          />
          <input name="slug" placeholder="Neuen Slug ueberschreiben" style={inputStyle} />
          <input name="validFrom" type="date" defaultValue={offerToEdit?.validFrom ?? ""} style={inputStyle} />
          <input name="validUntil" type="date" defaultValue={offerToEdit?.validUntil ?? ""} style={inputStyle} />
          <input
            name="imageSrc"
            defaultValue={offerToEdit?.imageSrc ?? ""}
            placeholder="Bild-URL"
            style={inputStyle}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" name="isActive" defaultChecked={offerToEdit?.isActive ?? true} />
            Angebot aktiv
          </label>
        </div>
        {offerToEdit ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ color: "var(--muted)" }}>
              Bearbeite <strong style={{ color: "inherit" }}>{offerToEdit.title}</strong>
            </div>
            <Link href={`/${locale}/admin/offers`}>Formular leeren</Link>
          </div>
        ) : null}
        <div style={gridTwo}>
          <LocaleFields title={`${currentLocaleLabel} Inhalt`}>
            <input
              name={`title_${locale}`}
              defaultValue={offerToEdit?.title ?? ""}
              placeholder="Angebotstitel"
              style={inputStyle}
            />
            <textarea
              name={`description_${locale}`}
              rows={4}
              defaultValue={offerToEdit?.description ?? ""}
              placeholder="Beschreibung"
              style={inputStyle}
            />
          </LocaleFields>
        </div>
        <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
          {offerToEdit ? "Angebot aktualisieren" : "Angebot speichern"}
        </button>
      </form>
    </section>
  );
}

export function AdminSettingsSection({ locale, currentLocaleLabel }: AdminPageState) {
  return (
    <section style={sectionStyle}>
      <SectionTitle story="ADMIN-010" title="Shop-Einstellungen verwalten" />
      <form action={updateShopSettingsAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="locale" value={locale} />
        <div style={gridTwo}>
          <input name="shopName" defaultValue={siteConfig.brand.shopName} placeholder="Shop-Name" style={inputStyle} />
          <input name="logoText" defaultValue={siteConfig.brand.logoText} placeholder="Logo-Text" style={inputStyle} />
          <input
            name="primaryColor"
            defaultValue={siteConfig.brand.primaryColor}
            placeholder="Primaerfarbe"
            style={inputStyle}
          />
          <input
            name="secondaryColor"
            defaultValue={siteConfig.brand.secondaryColor}
            placeholder="Sekundaerfarbe"
            style={inputStyle}
          />
          <input
            name="accentColor"
            defaultValue={siteConfig.brand.accentColor}
            placeholder="Akzentfarbe"
            style={inputStyle}
          />
        </div>
        <div style={gridTwo}>
          {locales.map((item) => (
            <div key={item} style={{ ...surfaceCardStyle, display: "grid", gap: 12 }}>
              <strong>{localeLabels[item]}</strong>
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" name={`locale_${item}`} defaultChecked={siteConfig.locales.includes(item)} />
                Enabled locale
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="radio"
                  name="defaultLocale"
                  value={item}
                  defaultChecked={siteConfig.defaultLocale === item}
                />
                Default locale
              </label>
            </div>
          ))}
          <LocaleFields title={`${currentLocaleLabel} Hero-Inhalt`}>
            <input
              name={`hero_kicker_${locale}`}
              defaultValue={siteConfig.content[locale].hero.kicker}
              placeholder="Hero-Kicker"
              style={inputStyle}
            />
            <input
              name={`hero_title_${locale}`}
              defaultValue={siteConfig.content[locale].hero.title}
              placeholder="Hero-Titel"
              style={inputStyle}
            />
            <textarea
              name={`hero_subtitle_${locale}`}
              defaultValue={siteConfig.content[locale].hero.subtitle}
              rows={4}
              placeholder="Hero-Untertitel"
              style={inputStyle}
            />
          </LocaleFields>
        </div>
        <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
          Shop-Einstellungen speichern
        </button>
      </form>
    </section>
  );
}

export function AdminEmailSection({ locale }: AdminPageState) {
  return (
    <section style={sectionStyle}>
      <SectionTitle story="ADMIN-011" title="E-Mail-Einstellungen verwalten" />
      <form action={updateEmailSettingsAction} style={gridTwo}>
        <input type="hidden" name="locale" value={locale} />
        <input
          name="providerName"
          defaultValue={siteConfig.emailSettings.providerName}
          placeholder="Anbietername"
          style={inputStyle}
        />
        <input
          name="fromEmail"
          defaultValue={siteConfig.emailSettings.fromEmail}
          placeholder="Absender-E-Mail"
          style={inputStyle}
        />
        <input
          name="replyToEmail"
          defaultValue={siteConfig.emailSettings.replyToEmail}
          placeholder="Antwort-E-Mail"
          style={inputStyle}
        />
        <input
          name="internalNotificationEmail"
          defaultValue={siteConfig.emailSettings.internalNotificationEmail}
          placeholder="Interne Benachrichtigungs-E-Mail"
          style={inputStyle}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            name="sendCustomerConfirmation"
            defaultChecked={siteConfig.emailSettings.sendCustomerConfirmation}
          />
          Kundenbestaetigungen senden
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            name="sendInternalNotification"
            defaultChecked={siteConfig.emailSettings.sendInternalNotification}
          />
          Interne Benachrichtigungen senden
        </label>
        <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
          E-Mail-Einstellungen speichern
        </button>
      </form>
    </section>
  );
}

export function AdminContactSection({ locale, currentLocaleLabel }: AdminPageState) {
  return (
    <section style={sectionStyle}>
      <SectionTitle story="ADMIN-012" title="Kontaktseiten-Inhalte verwalten" />
      <form action={updateContactContentAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="locale" value={locale} />
        <div style={gridTwo}>
          <input name="phone" defaultValue={siteConfig.contact[locale].items.phone.value} placeholder="Phone" style={inputStyle} />
          <input name="email" defaultValue={siteConfig.contact[locale].items.email.value} placeholder="Email" style={inputStyle} />
          <input name="address" defaultValue={siteConfig.contact[locale].items.address.value} placeholder="Adresse" style={inputStyle} />
          <input
            name="whatsapp"
            defaultValue={siteConfig.contact[locale].items.whatsapp?.href ?? ""}
            placeholder="WhatsApp-Link"
            style={inputStyle}
          />
          <input
            name="mapEmbedUrl"
            defaultValue={siteConfig.contact[locale].map.embedUrl}
            placeholder="Karten-Embed-URL"
            style={inputStyle}
          />
          <input
            name="mapDirectionsHref"
            defaultValue={siteConfig.contact[locale].map.directionsHref}
            placeholder="Routen-URL"
            style={inputStyle}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" name="mapVisible" defaultChecked={siteConfig.contact[locale].map.isVisible} />
            Show embedded map
          </label>
        </div>
        <div style={gridTwo}>
          <LocaleFields title={`${currentLocaleLabel} Inhalt`}>
            <input
              name={`title_${locale}`}
              defaultValue={siteConfig.contact[locale].title}
              placeholder="Seitentitel"
              style={inputStyle}
            />
            <input
              name={`subtitle_${locale}`}
              defaultValue={siteConfig.contact[locale].subtitle}
              placeholder="Untertitel"
              style={inputStyle}
            />
            <input
              name={`addressLabel_${locale}`}
              defaultValue={siteConfig.contact[locale].items.address.label}
              placeholder="Adressbezeichnung"
              style={inputStyle}
            />
            <textarea
              name={`hours_${locale}`}
              rows={5}
              defaultValue={siteConfig.contact[locale].workingHours
                .map((entry) => `${entry.days}: ${entry.hours}`)
                .join("\n")}
              placeholder="Eine Zeile pro Eintrag: Tag: Zeiten"
              style={inputStyle}
            />
          </LocaleFields>
        </div>
        <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
          Kontaktinhalte speichern
        </button>
      </form>
    </section>
  );
}
