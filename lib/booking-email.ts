import { siteConfig } from "@/lib/site-config";
import type { BookingRecord } from "@/lib/booking";

export function sendBookingConfirmationEmail(booking: BookingRecord) {
  if (!siteConfig.emailSettings.sendCustomerConfirmation || !booking.email) {
    return null;
  }

  const contact = siteConfig.contact[booking.locale].items;
  const payload = {
    to: booking.email,
    subject: `${siteConfig.brand.shopName} booking confirmation`,
    body: [
      `Shop: ${siteConfig.brand.shopName}`,
      `Provider: ${siteConfig.emailSettings.providerName}`,
      `From: ${siteConfig.emailSettings.fromEmail}`,
      `Reply-To: ${siteConfig.emailSettings.replyToEmail}`,
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

  if (siteConfig.emailSettings.sendInternalNotification) {
    console.info("Internal booking notification", {
      to: siteConfig.emailSettings.internalNotificationEmail,
      bookingId: booking.id,
      customerName: booking.customerName,
      date: booking.date,
      time: `${booking.start} - ${booking.end}`
    });
  }

  return payload;
}
