import type { Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ContactFormField = keyof ContactFormValues;

export type ContactFormErrorCode = "required" | "invalid_email";

export type ContactFormErrors = Partial<Record<ContactFormField, ContactFormErrorCode>>;

export function emptyContactFormValues(): ContactFormValues {
  return {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  };
}

export function normalizeContactValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactForm(values: ContactFormValues) {
  const errors: ContactFormErrors = {};

  if (!values.name) {
    errors.name = "required";
  }

  if (!values.email) {
    errors.email = "required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "invalid_email";
  }

  if (!values.subject) {
    errors.subject = "required";
  }

  if (!values.message) {
    errors.message = "required";
  }

  return {
    values,
    errors,
    isValid: Object.keys(errors).length === 0
  };
}

export async function sendContactMessage(locale: Locale, values: ContactFormValues) {
  const recipient = siteConfig.contact[locale].items.email.value;

  console.info("Contact form submission", {
    locale,
    recipient,
    submittedAt: new Date().toISOString(),
    ...values
  });
}
