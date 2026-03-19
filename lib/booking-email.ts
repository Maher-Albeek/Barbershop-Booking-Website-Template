import { siteConfig } from "@/lib/site-config";
import nodemailer, { type Transporter } from "nodemailer";
import type { BookingRecord } from "@/lib/booking";

declare global {
  // eslint-disable-next-line no-var
  var __barbershopMailTransporter: Transporter | undefined;
}

type BookingEmailPayload = {
  to: string;
  subject: string;
  body: string;
};

function getSenderAddresses() {
  const from = process.env.SMTP_FROM?.trim() || siteConfig.emailSettings.fromEmail;
  const replyTo = process.env.SMTP_REPLY_TO?.trim() || siteConfig.emailSettings.replyToEmail;
  return { from, replyTo };
}

function getSmtpSettings() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const rawPort = Number(process.env.SMTP_PORT ?? "587");
  const port = Number.isFinite(rawPort) ? rawPort : 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const rejectUnauthorized = process.env.SMTP_REJECT_UNAUTHORIZED !== "false";

  return {
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized
    }
  };
}

function getTransporter() {
  if (!globalThis.__barbershopMailTransporter) {
    const smtpSettings = getSmtpSettings();

    if (!smtpSettings) {
      return null;
    }

    globalThis.__barbershopMailTransporter = nodemailer.createTransport(smtpSettings);
  }

  return globalThis.__barbershopMailTransporter;
}

export async function sendBookingConfirmationEmail(booking: BookingRecord) {
  if (!siteConfig.emailSettings.sendCustomerConfirmation || !booking.email) {
    return null;
  }

  const contact = siteConfig.contact[booking.locale].items;
  const payload: BookingEmailPayload = {
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

  const transporter = getTransporter();

  if (!transporter) {
    console.warn("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER and SMTP_PASS.");
    console.info("Booking confirmation email payload", payload);
    return payload;
  }

  const sender = getSenderAddresses();

  const confirmationInfo = await transporter.sendMail({
    from: sender.from,
    replyTo: sender.replyTo,
    to: payload.to,
    subject: payload.subject,
    text: payload.body
  });

  console.info("Booking confirmation email sent", {
    to: payload.to,
    messageId: confirmationInfo.messageId,
    accepted: confirmationInfo.accepted,
    rejected: confirmationInfo.rejected,
    response: confirmationInfo.response
  });

  if (siteConfig.emailSettings.sendInternalNotification) {
    const internalInfo = await transporter.sendMail({
      from: sender.from,
      replyTo: sender.replyTo,
      to: siteConfig.emailSettings.internalNotificationEmail,
      subject: `${siteConfig.brand.shopName} new booking ${booking.id}`,
      text: [
        `Booking ID: ${booking.id}`,
        `Customer: ${booking.customerName}`,
        `Email: ${booking.email ?? "-"}`,
        `Service: ${booking.serviceName}`,
        `Barber: ${booking.employeeName}`,
        `Date: ${booking.date}`,
        `Time: ${booking.start} - ${booking.end}`,
        `Price: ${booking.priceSnapshot}`,
        booking.notes ? `Notes: ${booking.notes}` : undefined
      ]
        .filter((line): line is string => Boolean(line))
        .join("\n")
    });

    console.info("Internal booking notification sent", {
      to: siteConfig.emailSettings.internalNotificationEmail,
      messageId: internalInfo.messageId,
      accepted: internalInfo.accepted,
      rejected: internalInfo.rejected,
      response: internalInfo.response
    });
  }

  return payload;
}
