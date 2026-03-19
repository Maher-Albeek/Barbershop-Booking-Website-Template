"use server";

import { redirect } from "next/navigation";
import { createConfirmedBooking } from "@/lib/booking";
import { sendBookingConfirmationEmail } from "@/lib/booking-email";
import { isLocale } from "@/lib/i18n";

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function submitBooking(formData: FormData) {
  const locale = normalize(formData.get("locale"));
  const service = normalize(formData.get("service"));
  const employee = normalize(formData.get("employee"));
  const date = normalize(formData.get("date"));
  const start = normalize(formData.get("start"));
  const customerName = normalize(formData.get("customerName"));
  const email = normalize(formData.get("email"));
  const notes = normalize(formData.get("notes"));

  const params = new URLSearchParams();

  if (service) {
    params.set("service", service);
  }

  if (employee) {
    params.set("employee", employee);
  }

  if (date) {
    params.set("date", date);
  }

  if (start) {
    params.set("start", start);
  }

  if (employee) {
    params.set("slotEmployee", employee);
  }

  if (customerName) {
    params.set("name", customerName);
  }

  if (email) {
    params.set("email", email);
  }

  if (notes) {
    params.set("notes", notes);
  }

  if (!isLocale(locale) || !service || !employee || !date || !start || !customerName) {
    params.set("error", "missing_fields");
    redirect(`/${isLocale(locale) ? locale : "de"}/booking?${params.toString()}`);
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    params.set("error", "invalid_email");
    redirect(`/${locale}/booking?${params.toString()}`);
  }

  let bookingId = "";

  try {
    const booking = createConfirmedBooking({
      locale,
      serviceSlug: service,
      employeeSlug: employee,
      date,
      start,
      customerName,
      email: email || undefined,
      notes: notes || undefined
    });

    if (booking.email) {
      try {
        await sendBookingConfirmationEmail(booking);
      } catch (emailError) {
        console.error("Booking email delivery failed", emailError);
      }
    }

    bookingId = booking.id;
  } catch (error) {
    const code = error instanceof Error ? error.message : "slot_unavailable";
    params.set("error", code === "slot_unavailable" ? "slot_unavailable" : "invalid_selection");
    redirect(`/${locale}/booking?${params.toString()}`);
  }

  redirect(`/${locale}/booking/success?id=${encodeURIComponent(bookingId)}`);
}
