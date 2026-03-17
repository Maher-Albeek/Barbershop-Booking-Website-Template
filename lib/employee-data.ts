import type { AuthSession } from "@/lib/auth";
import {
  listBookings,
  updateEmployeeBookingStatus,
  type BookingRecord
} from "@/lib/booking";
import { type Locale } from "@/lib/i18n";
import { siteConfig, getEmployeeBySlug, getServiceBySlug } from "@/lib/site-config";

const weekdayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type EmployeeBookingStatus = "completed" | "no_show";

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getEmployeeSlugFromSession(session: AuthSession) {
  if (session.employeeSlug) {
    return session.employeeSlug;
  }

  const match = siteConfig.team[siteConfig.defaultLocale].members.find(
    (member) => normalizeName(member.name) === normalizeName(session.displayName)
  );

  return match?.slug ?? null;
}

export function getEmployeeProfile(session: AuthSession, locale: Locale) {
  const slug = getEmployeeSlugFromSession(session);

  if (!slug) {
    return null;
  }

  return (
    getEmployeeBySlug(locale, slug) ??
    getEmployeeBySlug(siteConfig.defaultLocale, slug) ??
    null
  );
}

export function listEmployeeBookings(
  session: AuthSession,
  filters: { date?: string; status?: BookingRecord["status"] } = {}
) {
  const employeeSlug = getEmployeeSlugFromSession(session);

  if (!employeeSlug) {
    return [];
  }

  return listBookings({
    employeeSlug,
    date: filters.date,
    status: filters.status
  });
}

export function listEmployeeAssignedServices(session: AuthSession, locale: Locale) {
  const employeeSlug = getEmployeeSlugFromSession(session);

  if (!employeeSlug) {
    return [];
  }

  const activeAssignments = siteConfig.booking.employeeServices.filter(
    (entry) => entry.employeeSlug === employeeSlug && entry.isActive
  );

  return activeAssignments.map((assignment) => ({
    ...assignment,
    serviceName:
      getServiceBySlug(locale, assignment.serviceSlug)?.name ?? assignment.serviceSlug
  }));
}

export function listEmployeeWorkingHours(session: AuthSession) {
  const employeeSlug = getEmployeeSlugFromSession(session);

  if (!employeeSlug) {
    return [];
  }

  return siteConfig.booking.workingHours
    .filter((entry) => entry.employeeSlug === employeeSlug)
    .sort((left, right) => left.weekday - right.weekday)
    .map((entry) => ({
      ...entry,
      weekdayLabel: weekdayLabels[entry.weekday] ?? `Day ${entry.weekday}`
    }));
}

export function listEmployeeBlockedTimes(session: AuthSession) {
  const employeeSlug = getEmployeeSlugFromSession(session);

  if (!employeeSlug) {
    return [];
  }

  return siteConfig.booking.blockedTimes
    .filter((entry) => entry.employeeSlug === employeeSlug)
    .sort((left, right) =>
      `${left.date}-${left.start}`.localeCompare(`${right.date}-${right.start}`)
    );
}

export function getEmployeeDashboardSummary(session: AuthSession, locale: Locale) {
  const bookings = listEmployeeBookings(session);
  const profile = getEmployeeProfile(session, locale);
  const today = new Date().toISOString().slice(0, 10);

  return {
    profile,
    bookings,
    upcomingBookings: bookings.filter((booking) => booking.date >= today).slice(0, 5),
    completedBookings: bookings.filter((booking) => booking.status === "completed").length,
    pendingBookings: bookings.filter((booking) => booking.status === "confirmed").length,
    blockedTimeCount: listEmployeeBlockedTimes(session).length,
    services: listEmployeeAssignedServices(session, locale)
  };
}

export function updateOwnBookingStatus(
  session: AuthSession,
  bookingId: string,
  status: EmployeeBookingStatus
) {
  const employeeSlug = getEmployeeSlugFromSession(session);

  if (!employeeSlug) {
    return null;
  }

  return updateEmployeeBookingStatus(employeeSlug, bookingId, status);
}
