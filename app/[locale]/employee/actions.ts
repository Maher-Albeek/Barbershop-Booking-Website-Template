"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { addBlockedTime, ensureLocale, isValidTimeRange } from "@/lib/admin-data";
import {
  getEmployeeSlugFromSession,
  updateOwnBookingStatus,
  type EmployeeBookingStatus
} from "@/lib/employee-data";

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function redirectToEmployee(locale: string, section: "bookings" | "schedule" | "dashboard") {
  redirect(`/${locale}/employee/${section}`);
}

async function authorize(localeValue: string) {
  const locale = ensureLocale(localeValue);
  const session = await requireRole(["employee", "admin"], locale, "/employee");
  const employeeSlug = getEmployeeSlugFromSession(session);

  if (!employeeSlug) {
    redirectToEmployee(locale, "dashboard");
  }

  return { locale, session, employeeSlug: employeeSlug as string };
}

function isEmployeeBookingStatus(value: string): value is EmployeeBookingStatus {
  return value === "completed" || value === "no_show";
}

export async function updateOwnBookingStatusAction(formData: FormData) {
  const { locale, session } = await authorize(normalize(formData.get("locale")));
  const statusValue = normalize(formData.get("status"));

  if (!isEmployeeBookingStatus(statusValue)) {
    redirectToEmployee(locale, "bookings");
  }

  const status = statusValue as EmployeeBookingStatus;
  updateOwnBookingStatus(session, normalize(formData.get("bookingId")), status);
  redirectToEmployee(locale, "bookings");
}

export async function addOwnBlockedTimeAction(formData: FormData) {
  const { locale, session, employeeSlug } = await authorize(normalize(formData.get("locale")));
  const start = normalize(formData.get("start"));
  const end = normalize(formData.get("end"));

  if (!session.canManageAvailability) {
    redirectToEmployee(locale, "schedule");
  }

  if (!normalize(formData.get("date")) || !start || !end || !isValidTimeRange(start, end)) {
    redirectToEmployee(locale, "schedule");
  }

  addBlockedTime({
    employeeSlug,
    date: normalize(formData.get("date")),
    start,
    end,
    reason: normalize(formData.get("reason")) || undefined
  });

  redirectToEmployee(locale, "schedule");
}
