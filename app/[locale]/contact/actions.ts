"use server";

import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import {
  emptyContactFormValues,
  normalizeContactValue,
  sendContactMessage,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues
} from "@/lib/contact";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: ContactFormErrors;
  values: ContactFormValues;
  resetKey: number;
};

export async function submitContactForm(
  previousState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const localeValue = normalizeContactValue(formData.get("locale"));
  const locale = isLocale(localeValue) ? localeValue : siteConfig.defaultLocale;
  const contactFormContent = siteConfig.contact[locale].form;
  const values = {
    name: normalizeContactValue(formData.get("name")),
    email: normalizeContactValue(formData.get("email")),
    phone: normalizeContactValue(formData.get("phone")),
    subject: normalizeContactValue(formData.get("subject")),
    message: normalizeContactValue(formData.get("message"))
  };
  const result = validateContactForm(values);

  if (!result.isValid) {
    const message =
      result.errors.email === "invalid_email"
        ? contactFormContent.invalidEmailMessage
        : contactFormContent.errorMessage;

    return {
      status: "error",
      message,
      fieldErrors: result.errors,
      values,
      resetKey: previousState.resetKey
    };
  }

  await sendContactMessage(locale, values);

  return {
    status: "success",
    message: contactFormContent.successMessage,
    fieldErrors: {},
    values: emptyContactFormValues(),
    resetKey: previousState.resetKey + 1
  };
}
