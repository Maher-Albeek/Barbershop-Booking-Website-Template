import { siteConfig } from "@/lib/site-config";
import type { BookingRecord } from "@/lib/booking";

export function sendBookingConfirmationEmail(booking: BookingRecord) {
  const contact = siteConfig.contact[booking.locale].items;
  const payload = {
    to: booking.email,
    subject: `${siteConfig.brand.shopName} booking confirmation`,
    body: [
      `Shop: ${siteConfig.brand.shopName}`,
      `Service: ${booking.serviceName}`,
      `Barber: ${booking.employeeName}`,
      `Date: ${booking.date}`,
      `Time: ${booking.start} - ${booking.end}`,
      `Price: ${booking.priceSnapshot}`,
      `Phone: ${contact.phone.value}`,
      `Email: ${contact.email.value}`,
      `Address: ${contact.address.value}`
    ].join("\n")
  };

  console.info("Booking confirmation email", payload);
  return payload;
}
