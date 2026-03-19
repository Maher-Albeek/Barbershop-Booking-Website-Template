import { notFound } from "next/navigation";
import {
  buildWeekdaySummary,
  getBlockedTimeSummary,
  getBookingOptions,
  getDashboardData,
  listFilteredBookings
} from "@/lib/admin-data";
import { getSession } from "@/lib/auth";
import { isLocale, locales } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import {
  addBlockedTimeAction,
  deleteGalleryAction,
  deleteOfferAction,
  updateBookingStatusAction,
  updateContactContentAction,
  updateEmailSettingsAction,
  updateShopSettingsAction,
  upsertAssignmentAction,
  upsertEmployeeAction,
  upsertGalleryAction,
  upsertOfferAction,
  upsertServiceAction,
  upsertWorkingHoursAction
} from "./actions";
import {
  AdminShell,
  LocaleFields,
  SectionTitle,
  gridTwo,
  inputStyle,
  localeLabels,
  sectionStyle,
  surfaceCardStyle,
  weekdayLabels
} from "./_components";
import { HeroImageField } from "./hero-image-field";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    bookingDate?: string;
    bookingEmployee?: string;
    bookingService?: string;
    bookingStatus?: "confirmed" | "cancelled" | "completed" | "no_show";
  }>;
};

export default async function AdminPage({ params, searchParams }: AdminPageProps) {
  const [{ locale }, filters] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();
  const dashboard = getDashboardData(locale);
  const options = getBookingOptions(locale);
  const bookings = listFilteredBookings({
    date: filters.bookingDate,
    employeeSlug: filters.bookingEmployee,
    serviceSlug: filters.bookingService,
    status: filters.bookingStatus
  });

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

      <section id="services" style={sectionStyle}>
        <SectionTitle story="ADMIN-002" title="Manage services" />
        <div style={gridTwo}>
          {siteConfig.services[locale].services.map((service) => (
            <article key={service.slug} style={surfaceCardStyle}>
              <strong>{service.name}</strong>
              <div style={{ color: "var(--muted)", marginTop: 8 }}>{service.slug}</div>
              <div style={{ marginTop: 8 }}>
                {service.isActive ? "Active" : "Inactive"} · {service.durationLabel}
              </div>
            </article>
          ))}
        </div>
        <form action={upsertServiceAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input name="serviceSlug" placeholder="Existing slug" style={inputStyle} />
            <input name="slug" placeholder="New slug override" style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isActive" defaultChecked />
              Active service
            </label>
          </div>
          <div style={gridTwo}>
            {locales.map((item) => (
              <LocaleFields key={item} title={localeLabels[item]}>
                <input name={`name_${item}`} placeholder="Name" style={inputStyle} />
                <input name={`description_${item}`} placeholder="Description" style={inputStyle} />
                <input name={`duration_${item}`} placeholder="Duration label" style={inputStyle} />
                <input name={`price_${item}`} placeholder="Price label" style={inputStyle} />
              </LocaleFields>
            ))}
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save service
          </button>
        </form>
      </section>

      <section id="employees" style={sectionStyle}>
        <SectionTitle story="ADMIN-003" title="Manage employees" />
        <div style={gridTwo}>
          {siteConfig.team[locale].members.map((member) => (
            <article key={member.slug} style={surfaceCardStyle}>
              <strong>{member.name}</strong>
              <div style={{ color: "var(--muted)", marginTop: 8 }}>{member.slug}</div>
              <div style={{ marginTop: 8 }}>{member.isActive ? "Active" : "Inactive"}</div>
              <div style={{ marginTop: 8, color: "var(--muted)" }}>
                {member.specialties.join(", ")}
              </div>
            </article>
          ))}
        </div>
        <form action={upsertEmployeeAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input name="employeeSlug" placeholder="Existing slug" style={inputStyle} />
            <input name="slug" placeholder="New slug override" style={inputStyle} />
            <input name="loginEmail" placeholder="Employee login email" style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isActive" defaultChecked />
              Active employee
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="linkLogin" />
              Create/link login
            </label>
          </div>
          <div style={gridTwo}>
            {locales.map((item) => (
              <LocaleFields key={item} title={localeLabels[item]}>
                <input name={`name_${item}`} placeholder="Display name" style={inputStyle} />
                <input name={`image_${item}`} placeholder="Avatar URL" style={inputStyle} />
                <input
                  name={`specialties_${item}`}
                  placeholder="Comma-separated specialties"
                  style={inputStyle}
                />
                <textarea name={`bio_${item}`} rows={4} placeholder="Bio" style={inputStyle} />
              </LocaleFields>
            ))}
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save employee
          </button>
        </form>
      </section>

      <section id="availability" style={sectionStyle}>
        <SectionTitle
          story="ADMIN-004 / ADMIN-005 / ADMIN-006"
          title="Assignments, working hours, blocked times"
        />
        <div style={gridTwo}>
          {siteConfig.team[locale].members.map((member) => (
            <article key={member.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <strong>{member.name}</strong>
              <div>
                Assignments:{" "}
                {siteConfig.booking.employeeServices
                  .filter((entry) => entry.employeeSlug === member.slug)
                  .map(
                    (entry) =>
                      `${entry.serviceSlug} (${entry.durationMinutes} min, ${entry.priceLabel}, ${
                        entry.isActive ? "active" : "inactive"
                      })`
                  )
                  .join("; ") || "none"}
              </div>
              <div>Hours: {buildWeekdaySummary(member.slug) || "none"}</div>
              <div>
                Blocks:{" "}
                {getBlockedTimeSummary(member.slug)
                  .slice(0, 3)
                  .map((entry) => `${entry.date} ${entry.start}-${entry.end}`)
                  .join("; ") || "none"}
              </div>
            </article>
          ))}
        </div>
        <div style={gridTwo}>
          <form action={upsertAssignmentAction} style={sectionStyle}>
            <input type="hidden" name="locale" value={locale} />
            <strong>Employee-service assignment</strong>
            <select name="employeeSlug" style={inputStyle}>
              {siteConfig.team[locale].members.map((member) => (
                <option key={member.slug} value={member.slug}>
                  {member.name}
                </option>
              ))}
            </select>
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
              placeholder="Duration minutes"
              style={inputStyle}
            />
            <input name="priceLabel" placeholder="Price label" style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isActive" defaultChecked />
              Active assignment
            </label>
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Save assignment
            </button>
          </form>

          <form action={upsertWorkingHoursAction} style={sectionStyle}>
            <input type="hidden" name="locale" value={locale} />
            <strong>Weekly working hours</strong>
            <select name="employeeSlug" style={inputStyle}>
              {siteConfig.team[locale].members.map((member) => (
                <option key={member.slug} value={member.slug}>
                  {member.name}
                </option>
              ))}
            </select>
            <select name="weekday" style={inputStyle}>
              {weekdayLabels.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
            <input name="start" type="time" style={inputStyle} />
            <input name="end" type="time" style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isOff" />
              Mark day off
            </label>
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Save hours
            </button>
          </form>

          <form action={addBlockedTimeAction} style={sectionStyle}>
            <input type="hidden" name="locale" value={locale} />
            <strong>Blocked time</strong>
            <select name="employeeSlug" style={inputStyle}>
              {siteConfig.team[locale].members.map((member) => (
                <option key={member.slug} value={member.slug}>
                  {member.name}
                </option>
              ))}
            </select>
            <input name="date" type="date" style={inputStyle} />
            <input name="start" type="time" style={inputStyle} />
            <input name="end" type="time" style={inputStyle} />
            <input name="reason" placeholder="Optional reason" style={inputStyle} />
            <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
              Add blocked time
            </button>
          </form>
        </div>
      </section>

      <section id="bookings" style={sectionStyle}>
        <SectionTitle story="ADMIN-007" title="Manage bookings" />
        <form method="get" style={gridTwo}>
          <input type="date" name="bookingDate" defaultValue={filters.bookingDate} style={inputStyle} />
          <select
            name="bookingEmployee"
            defaultValue={filters.bookingEmployee ?? ""}
            style={inputStyle}
          >
            <option value="">All employees</option>
            {options.employees.map((member) => (
              <option key={member.slug} value={member.slug}>
                {member.name}
              </option>
            ))}
          </select>
          <select name="bookingService" defaultValue={filters.bookingService ?? ""} style={inputStyle}>
            <option value="">All services</option>
            {options.services.map((service) => (
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
              <div
                style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
              >
                <strong>
                  {booking.date} {booking.start}-{booking.end}
                </strong>
                <span>{booking.status}</span>
              </div>
              <div>
                {booking.customerName} · {booking.serviceName} · {booking.employeeName}
              </div>
              <div style={{ color: "var(--muted)" }}>
                Snapshot: {booking.priceSnapshot} · Ref: {booking.id}
              </div>
              <div style={{ color: "var(--muted)" }}>
                Email: {booking.email || "n/a"} · Notes: {booking.notes || "n/a"}
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
                <button
                  type="submit"
                  style={{ ...inputStyle, maxWidth: 180, cursor: "pointer", fontWeight: 700 }}
                >
                  Update status
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="gallery" style={sectionStyle}>
        <SectionTitle story="ADMIN-008" title="Manage gallery" />
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
                  {image.slug} · order {image.sortOrder} · {image.isVisible ? "visible" : "hidden"}
                </div>
                <form action={deleteGalleryAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="slug" value={image.slug} />
                  <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                    Delete image
                  </button>
                </form>
              </article>
            ))}
        </div>
        <form action={upsertGalleryAction} style={gridTwo}>
          <input type="hidden" name="locale" value={locale} />
          <input name="slug" placeholder="Existing slug to update" style={inputStyle} />
          <input name="imageSrc" placeholder="Image URL" style={inputStyle} />
          <input name="alt" placeholder="Alt text" style={inputStyle} />
          <input name="caption" placeholder="Caption" style={inputStyle} />
          <input name="sortOrder" type="number" placeholder="Sort order" style={inputStyle} />
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" name="isVisible" defaultChecked />
            Visible on public gallery
          </label>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save gallery image
          </button>
        </form>
      </section>

      <section id="offers" style={sectionStyle}>
        <SectionTitle story="ADMIN-009" title="Manage offers" />
        <div style={gridTwo}>
          {siteConfig.offers[locale].offers.map((offer) => (
            <article key={offer.slug} style={{ ...surfaceCardStyle, display: "grid", gap: 10 }}>
              <strong>{offer.title}</strong>
              <div style={{ color: "var(--muted)" }}>
                {offer.validFrom} to {offer.validUntil}
              </div>
              <div>{offer.isActive ? "Active" : "Inactive"}</div>
              <form action={deleteOfferAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="slug" value={offer.slug} />
                <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
                  Delete offer
                </button>
              </form>
            </article>
          ))}
        </div>
        <form action={upsertOfferAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input name="offerSlug" placeholder="Existing slug" style={inputStyle} />
            <input name="slug" placeholder="New slug override" style={inputStyle} />
            <input name="validFrom" type="date" style={inputStyle} />
            <input name="validUntil" type="date" style={inputStyle} />
            <input name="imageSrc" placeholder="Image URL" style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="isActive" defaultChecked />
              Offer active
            </label>
          </div>
          <div style={gridTwo}>
            {locales.map((item) => (
              <LocaleFields key={item} title={localeLabels[item]}>
                <input name={`title_${item}`} placeholder="Offer title" style={inputStyle} />
                <textarea
                  name={`description_${item}`}
                  rows={4}
                  placeholder="Description"
                  style={inputStyle}
                />
              </LocaleFields>
            ))}
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save offer
          </button>
        </form>
      </section>

      <section id="settings" style={sectionStyle}>
        <SectionTitle story="ADMIN-010" title="Manage shop settings" />
        <form action={updateShopSettingsAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input
              name="shopName"
              defaultValue={siteConfig.brand.shopName}
              placeholder="Shop name"
              style={inputStyle}
            />
            <input
              name="logoText"
              defaultValue={siteConfig.brand.logoText}
              placeholder="Logo text"
              style={inputStyle}
            />
            <input
              name="primaryColor"
              defaultValue={siteConfig.brand.primaryColor}
              placeholder="Primary color"
              style={inputStyle}
            />
            <input
              name="secondaryColor"
              defaultValue={siteConfig.brand.secondaryColor}
              placeholder="Secondary color"
              style={inputStyle}
            />
            <input
              name="accentColor"
              defaultValue={siteConfig.brand.accentColor}
              placeholder="Accent color"
              style={inputStyle}
            />
          </div>
          <div style={gridTwo}>
            {locales.map((item) => (
              <div key={item} style={{ ...surfaceCardStyle, display: "grid", gap: 12 }}>
                <strong>{localeLabels[item]}</strong>
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    name={`locale_${item}`}
                    defaultChecked={siteConfig.locales.includes(item)}
                  />
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
                <input
                  name={`hero_kicker_${item}`}
                  defaultValue={siteConfig.content[item].hero.kicker}
                  placeholder="Hero kicker"
                  style={inputStyle}
                />
                <input
                  name={`hero_title_${item}`}
                  defaultValue={siteConfig.content[item].hero.title}
                  placeholder="Hero title"
                  style={inputStyle}
                />
                <textarea
                  name={`hero_subtitle_${item}`}
                  defaultValue={siteConfig.content[item].hero.subtitle}
                  rows={4}
                  placeholder="Hero subtitle"
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
          <div style={{ ...surfaceCardStyle, display: "grid", gap: 12 }}>
            <strong>Hero image per page</strong>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Use a public path like /images/hero-services.jpg or an absolute URL.
            </p>
            <div style={gridTwo}>
              <HeroImageField
                name="hero_image_home"
                defaultValue={siteConfig.brand.heroImages.home}
                label="Home"
              />
              <HeroImageField
                name="hero_image_services"
                defaultValue={siteConfig.brand.heroImages.services}
                label="Services"
              />
              <HeroImageField
                name="hero_image_team"
                defaultValue={siteConfig.brand.heroImages.team}
                label="Team"
              />
              <HeroImageField
                name="hero_image_offers"
                defaultValue={siteConfig.brand.heroImages.offers}
                label="Offers"
              />
              <HeroImageField
                name="hero_image_gallery"
                defaultValue={siteConfig.brand.heroImages.gallery}
                label="Gallery"
              />
              <HeroImageField
                name="hero_image_booking"
                defaultValue={siteConfig.brand.heroImages.booking}
                label="Booking"
              />
              <HeroImageField
                name="hero_image_bookingSuccess"
                defaultValue={siteConfig.brand.heroImages.bookingSuccess}
                label="Booking Success"
              />
              <HeroImageField
                name="hero_image_contact"
                defaultValue={siteConfig.brand.heroImages.contact}
                label="Contact"
              />
            </div>
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save shop settings
          </button>
        </form>
      </section>

      <section id="email" style={sectionStyle}>
        <SectionTitle story="ADMIN-011" title="Manage email settings" />
        <form action={updateEmailSettingsAction} style={gridTwo}>
          <input type="hidden" name="locale" value={locale} />
          <input
            name="providerName"
            defaultValue={siteConfig.emailSettings.providerName}
            placeholder="Provider name"
            style={inputStyle}
          />
          <input
            name="fromEmail"
            defaultValue={siteConfig.emailSettings.fromEmail}
            placeholder="From email"
            style={inputStyle}
          />
          <input
            name="replyToEmail"
            defaultValue={siteConfig.emailSettings.replyToEmail}
            placeholder="Reply-to email"
            style={inputStyle}
          />
          <input
            name="internalNotificationEmail"
            defaultValue={siteConfig.emailSettings.internalNotificationEmail}
            placeholder="Internal notification email"
            style={inputStyle}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              name="sendCustomerConfirmation"
              defaultChecked={siteConfig.emailSettings.sendCustomerConfirmation}
            />
            Send customer confirmations
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              name="sendInternalNotification"
              defaultChecked={siteConfig.emailSettings.sendInternalNotification}
            />
            Send internal notifications
          </label>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save email settings
          </button>
        </form>
      </section>

      <section id="contact" style={sectionStyle}>
        <SectionTitle story="ADMIN-012" title="Manage contact page content" />
        <form action={updateContactContentAction} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="locale" value={locale} />
          <div style={gridTwo}>
            <input
              name="phone"
              defaultValue={siteConfig.contact[locale].items.phone.value}
              placeholder="Phone"
              style={inputStyle}
            />
            <input
              name="email"
              defaultValue={siteConfig.contact[locale].items.email.value}
              placeholder="Email"
              style={inputStyle}
            />
            <input
              name="address"
              defaultValue={siteConfig.contact[locale].items.address.value}
              placeholder="Address"
              style={inputStyle}
            />
            <input
              name="whatsapp"
              defaultValue={siteConfig.contact[locale].items.whatsapp?.href ?? ""}
              placeholder="WhatsApp link"
              style={inputStyle}
            />
            <input
              name="mapEmbedUrl"
              defaultValue={siteConfig.contact[locale].map.embedUrl}
              placeholder="Map embed URL"
              style={inputStyle}
            />
            <input
              name="mapDirectionsHref"
              defaultValue={siteConfig.contact[locale].map.directionsHref}
              placeholder="Directions URL"
              style={inputStyle}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                name="mapVisible"
                defaultChecked={siteConfig.contact[locale].map.isVisible}
              />
              Show embedded map
            </label>
          </div>
          <div style={gridTwo}>
            {locales.map((item) => (
              <LocaleFields key={item} title={localeLabels[item]}>
                <input
                  name={`title_${item}`}
                  defaultValue={siteConfig.contact[item].title}
                  placeholder="Page title"
                  style={inputStyle}
                />
                <input
                  name={`subtitle_${item}`}
                  defaultValue={siteConfig.contact[item].subtitle}
                  placeholder="Subtitle"
                  style={inputStyle}
                />
                <input
                  name={`addressLabel_${item}`}
                  defaultValue={siteConfig.contact[item].items.address.label}
                  placeholder="Address label"
                  style={inputStyle}
                />
                <textarea
                  name={`hours_${item}`}
                  rows={5}
                  defaultValue={siteConfig.contact[item].workingHours
                    .map((entry) => `${entry.days}: ${entry.hours}`)
                    .join("\n")}
                  placeholder="One line per row: Day: hours"
                  style={inputStyle}
                />
              </LocaleFields>
            ))}
          </div>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save contact content
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
