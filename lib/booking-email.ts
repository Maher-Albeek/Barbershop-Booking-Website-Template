import { getContactContent, siteConfig } from "@/lib/site-config";
import nodemailer, { type Transporter } from "nodemailer";
import type { BookingRecord } from "@/lib/booking";

declare global {
  // eslint-disable-next-line no-var
  var __barbershopMailTransporter: Transporter | undefined;
}

function getSenderAddresses() {
  const from = process.env.SMTP_FROM?.trim() || siteConfig.emailSettings.fromEmail;
  const replyTo = process.env.SMTP_REPLY_TO?.trim() || siteConfig.emailSettings.replyToEmail;
  return { from, replyTo };
}

function parseMailbox(value: string) {
  const match = value.match(/^\s*"?([^"<]+?)"?\s*<\s*([^>\s]+)\s*>\s*$/);

  if (match) {
    return {
      name: match[1].trim(),
      email: match[2].trim()
    };
  }

  return { email: value.trim() };
}

function getSmtpSettings(forceRejectUnauthorized?: boolean) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const rawPort = Number(process.env.SMTP_PORT ?? "587");
  const port = Number.isFinite(rawPort) ? rawPort : 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const rejectUnauthorized =
    typeof forceRejectUnauthorized === "boolean"
      ? forceRejectUnauthorized
      : process.env.SMTP_REJECT_UNAUTHORIZED !== "false";

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

function isSelfSignedTlsError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const maybeCode = (error as { code?: string }).code;
  const message = error.message.toLowerCase();

  return maybeCode === "ESOCKET" && message.includes("self-signed certificate");
}

class BrevoApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(`Brevo API error ${status}: ${body}`);
    this.name = "BrevoApiError";
    this.status = status;
    this.body = body;
  }
}

function getCustomerConfirmationText(booking: BookingRecord) {
  return [
    `Hello ${booking.customerName},`,
    "",
    `your booking at ${siteConfig.brand.shopName} is confirmed.`,
    "",
    `Service: ${booking.serviceName}`,
    `Barber: ${booking.employeeName}`,
    `Date: ${booking.date}`,
    `Time: ${booking.start} - ${booking.end}`,
    `Price: ${booking.priceSnapshot}`,
    "",
    "If you need to change your appointment, please reply to this email.",
    "",
    `Best regards,`,
    siteConfig.brand.shopName
  ].join("\n");
}

function getPublicWebsiteUrl() {
  return (
    process.env.EMAIL_PUBLIC_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://maher-albeek.com"
  );
}

function getBrevoTemplateParams(booking: BookingRecord) {
  const contact = getContactContent(booking.locale);
  const appointmentTime = `${booking.start} - ${booking.end}`;
  const servicePrice = String(booking.priceSnapshot ?? "");
  const website = getPublicWebsiteUrl();
  const bookingManageUrl = `${website}/${booking.locale}/booking/success?id=${encodeURIComponent(booking.id)}`;
  const bookingCancelUrl = bookingManageUrl;
  const shopPhone = contact.items.phone.value;
  const shopAddress = contact.items.address.value;
  const shopWebsite = website;
  const instagramUrl = process.env.SHOP_INSTAGRAM_URL?.trim() || "";
  const instagramHandle = process.env.SHOP_INSTAGRAM_HANDLE?.trim() || "";
  const tiktokUrl = process.env.SHOP_TIKTOK_URL?.trim() || "";
  const unsubscribeUrl = `${website}/${booking.locale}/contact`;
  const privacyUrl = `${website}/${booking.locale}/datenschutz`;

  return {
    // Requested keys
    CUSTOMER_NAME: booking.customerName,
    APPOINTMENT_DATE: booking.date,
    APPOINTMENT_TIME: appointmentTime,
    SERVICE_NAME: booking.serviceName,
    BARBER_NAME: booking.employeeName,
    SERVICE_PRICE: servicePrice,
    BOOKING_MANAGE_URL: bookingManageUrl,
    BOOKING_CANCEL_URL: bookingCancelUrl,
    SHOP_ADDRESS: shopAddress,
    SHOP_PHONE: shopPhone,
    SHOP_WEBSITE: shopWebsite,
    INSTAGRAM_URL: instagramUrl,
    INSTAGRAM_HANDLE: instagramHandle,
    TIKTOK_URL: tiktokUrl,
    UNSUBSCRIBE_URL: unsubscribeUrl,
    PRIVACY_URL: privacyUrl,

    // Common alternative keys used in templates
    customer_name: booking.customerName,
    appointment_date: booking.date,
    appointment_time: appointmentTime,
    service_name: booking.serviceName,
    barber_name: booking.employeeName,
    service_price: servicePrice,
    booking_manage_url: bookingManageUrl,
    booking_cancel_url: bookingCancelUrl,
    shop_address: shopAddress,
    shop_phone: shopPhone,
    shop_website: shopWebsite,
    instagram_url: instagramUrl,
    instagram_handle: instagramHandle,
    tiktok_url: tiktokUrl,
    unsubscribe_url: unsubscribeUrl,
    privacy_url: privacyUrl,

    CUSTOMERNAME: booking.customerName,
    DATE: booking.date,
    TIME: appointmentTime,
    SERVICE: booking.serviceName,
    BARBER: booking.employeeName,
    PRICE: servicePrice,
    TIKTOK: tiktokUrl
  };
}

function getBrevoCancellationTemplateParams(booking: BookingRecord) {
  const contact = getContactContent(booking.locale);
  const appointmentTime = `${booking.start} - ${booking.end}`;
  const website = getPublicWebsiteUrl();
  const bookingUrl = `${website}/${booking.locale}/booking`;
  const instagramUrl = process.env.SHOP_INSTAGRAM_URL?.trim() || "";
  const tiktokUrl = process.env.SHOP_TIKTOK_URL?.trim() || "";

  return {
    CUSTOMER_NAME: booking.customerName,
    APPOINTMENT_DATE: booking.date,
    APPOINTMENT_TIME: appointmentTime,
    SERVICE_NAME: booking.serviceName,
    BARBER_NAME: booking.employeeName,
    BOOKING_URL: bookingUrl,
    SHOP_ADDRESS: contact.items.address.value,
    SHOP_PHONE: contact.items.phone.value,
    SHOP_WEBSITE: website,
    TIKTOK_URL: tiktokUrl,
    INSTAGRAM_URL: instagramUrl
  };
}

async function sendCustomerConfirmationViaSmtp(booking: BookingRecord) {
  const transporter = getTransporter();

  if (!transporter || !booking.email) {
    return null;
  }

  const sender = getSenderAddresses();
  const mailOptions = {
    from: sender.from,
    replyTo: sender.replyTo,
    to: booking.email,
    subject: `${siteConfig.brand.shopName} booking confirmation ${booking.date} ${booking.start}`,
    text: getCustomerConfirmationText(booking)
  };

  let info;

  try {
    info = await transporter.sendMail(mailOptions);
  } catch (error) {
    if (!isSelfSignedTlsError(error)) {
      throw error;
    }

    const insecureSettings = getSmtpSettings(false);

    if (!insecureSettings) {
      throw error;
    }

    console.warn(
      "SMTP TLS validation failed due to a self-signed certificate. Retrying with rejectUnauthorized=false."
    );

    const insecureTransporter = nodemailer.createTransport(insecureSettings);
    info = await insecureTransporter.sendMail(mailOptions);
  }

  console.info("SMTP booking confirmation email sent", {
    channel: "smtp_fallback",
    to: booking.email,
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response
  });

  return info;
}

async function sendBrevoConfirmation(booking: BookingRecord) {
  if (process.env.BREVO_USE_API === "false") {
    return null;
  }

  const apiKey = process.env.BREVO_API_KEY;
  const templateId = Number(process.env.BREVO_TEMPLATE_ID);

  if (!apiKey || !templateId) {
    console.warn("Brevo is not configured. Set BREVO_API_KEY and BREVO_TEMPLATE_ID.");
    return null;
  }

  const sender = parseMailbox(getSenderAddresses().from);
  const replyTo = parseMailbox(getSenderAddresses().replyTo);
  const templateParams = getBrevoTemplateParams(booking);

  const body = {
    sender,
    replyTo,
    to: [{ email: booking.email, name: booking.customerName }],
    templateId,
    // Support both template syntaxes: {{ CUSTOMER_NAME }} and {{ params.CUSTOMER_NAME }}
    params: {
      ...templateParams,
      params: templateParams
    }
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new BrevoApiError(response.status, error);
  }

  const result = await response.json() as { messageId?: string };
  console.info("Brevo booking confirmation email sent", {
    channel: "brevo_template_api",
    to: booking.email,
    messageId: result.messageId,
    templateId
  });
  return result;
}

async function sendCustomerCancellationViaSmtp(booking: BookingRecord) {
  const transporter = getTransporter();

  if (!transporter || !booking.email) {
    return null;
  }

  const sender = getSenderAddresses();
  const cancellationText = [
    `Hello ${booking.customerName},`,
    "",
    `your booking at ${siteConfig.brand.shopName} has been cancelled.`,
    "",
    `Service: ${booking.serviceName}`,
    `Barber: ${booking.employeeName}`,
    `Date: ${booking.date}`,
    `Time: ${booking.start} - ${booking.end}`,
    "",
    "You can book another appointment at any time.",
    "",
    `Best regards,`,
    siteConfig.brand.shopName
  ].join("\n");

  const mailOptions = {
    from: sender.from,
    replyTo: sender.replyTo,
    to: booking.email,
    subject: `${siteConfig.brand.shopName} booking cancelled ${booking.date} ${booking.start}`,
    text: cancellationText
  };

  let info;

  try {
    info = await transporter.sendMail(mailOptions);
  } catch (error) {
    if (!isSelfSignedTlsError(error)) {
      throw error;
    }

    const insecureSettings = getSmtpSettings(false);

    if (!insecureSettings) {
      throw error;
    }

    console.warn(
      "SMTP TLS validation failed due to a self-signed certificate. Retrying with rejectUnauthorized=false."
    );

    const insecureTransporter = nodemailer.createTransport(insecureSettings);
    info = await insecureTransporter.sendMail(mailOptions);
  }

  console.info("SMTP booking cancellation email sent", {
    channel: "smtp_fallback",
    to: booking.email,
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response
  });

  return info;
}

async function sendBrevoCancellation(booking: BookingRecord) {
  if (process.env.BREVO_USE_API === "false") {
    return null;
  }

  const apiKey = process.env.BREVO_API_KEY;
  const templateId = Number(process.env.BREVO_CANCEL_TEMPLATE_ID);

  if (!apiKey || !templateId) {
    console.warn("Brevo cancellation email is not configured. Set BREVO_API_KEY and BREVO_CANCEL_TEMPLATE_ID.");
    return null;
  }

  const sender = parseMailbox(getSenderAddresses().from);
  const replyTo = parseMailbox(getSenderAddresses().replyTo);
  const templateParams = getBrevoCancellationTemplateParams(booking);

  const body = {
    sender,
    replyTo,
    to: [{ email: booking.email, name: booking.customerName }],
    templateId,
    // Support both template syntaxes: {{ CUSTOMER_NAME }} and {{ params.CUSTOMER_NAME }}
    params: {
      ...templateParams,
      params: templateParams
    }
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new BrevoApiError(response.status, error);
  }

  const result = await response.json() as { messageId?: string };
  console.info("Brevo booking cancellation email sent", {
    channel: "brevo_template_api",
    to: booking.email,
    messageId: result.messageId,
    templateId
  });
  return result;
}

export async function sendCancellationEmail(booking: BookingRecord) {
  if (!siteConfig.emailSettings.sendCustomerConfirmation || !booking.email) {
    return null;
  }

  let cancellationResult: unknown = null;

  try {
    cancellationResult = await sendBrevoCancellation(booking);
  } catch (error) {
    const hasSmtpFallback = Boolean(getTransporter());

    if (!hasSmtpFallback) {
      throw error;
    }

    if (error instanceof BrevoApiError && error.status === 401) {
      console.warn(
        "Brevo API returned 401 (authorized IP restriction). Template email cannot be used until this server IP is allowlisted in Brevo Security. Falling back to SMTP relay."
      );
    } else {
      console.warn("Brevo API failed. Falling back to SMTP relay.", error);
    }

    cancellationResult = await sendCustomerCancellationViaSmtp(booking);
  }

  return cancellationResult;
}

export async function sendBookingConfirmationEmail(booking: BookingRecord) {
  if (!siteConfig.emailSettings.sendCustomerConfirmation || !booking.email) {
    return null;
  }

  let customerResult: unknown = null;

  try {
    customerResult = await sendBrevoConfirmation(booking);
  } catch (error) {
    const hasSmtpFallback = Boolean(getTransporter());

    if (!hasSmtpFallback) {
      throw error;
    }

    if (error instanceof BrevoApiError && error.status === 401) {
      console.warn(
        "Brevo API returned 401 (authorized IP restriction). Template email cannot be used until this server IP is allowlisted in Brevo Security. Falling back to SMTP relay."
      );
    } else {
      console.warn("Brevo API failed. Falling back to SMTP relay.", error);
    }

    customerResult = await sendCustomerConfirmationViaSmtp(booking);
  }

  if (siteConfig.emailSettings.sendInternalNotification) {
    const transporter = getTransporter();
    const sender = getSenderAddresses();

    if (!transporter) {
      console.warn("SMTP is not configured for internal notification. Set SMTP_HOST, SMTP_USER and SMTP_PASS.");
    } else {
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
  }

  return customerResult;
}
