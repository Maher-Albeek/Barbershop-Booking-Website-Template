"use server";

import { redirect } from "next/navigation";
import { authenticateUser, clearSession, createSession } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";
import type { AuthRole } from "@/lib/auth-users";

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isAuthRole(value: string): value is AuthRole {
  return value === "admin" || value === "employee";
}

export async function loginUser(formData: FormData) {
  const localeValue = normalize(formData.get("locale"));
  const email = normalize(formData.get("email"));
  const password = normalize(formData.get("password"));
  const requestedRoleValue = normalize(formData.get("role"));
  const redirectTo = normalize(formData.get("redirectTo"));

  const locale = isLocale(localeValue) ? localeValue : "de";
  const requestedRole: AuthRole = isAuthRole(requestedRoleValue) ? requestedRoleValue : "employee";
  const safeRedirect =
    redirectTo.startsWith(`/${locale}/`) && !redirectTo.includes("://")
      ? redirectTo
      : `/${locale}/${requestedRole}`;

  if (!email || !password) {
    redirect(
      `/${locale}/login?role=${requestedRole}&redirectTo=${encodeURIComponent(safeRedirect)}&error=missing_fields`
    );
  }

  const user = authenticateUser(email, password);

  if (!user) {
    redirect(
      `/${locale}/login?role=${requestedRole}&redirectTo=${encodeURIComponent(safeRedirect)}&error=invalid_credentials`
    );
  }

  if (requestedRole === "admin" && user.role !== "admin") {
    redirect(
      `/${locale}/login?role=admin&redirectTo=${encodeURIComponent(safeRedirect)}&error=forbidden_role`
    );
  }

  await createSession({
    userId: user.id,
    role: user.role,
    email: user.email,
    displayName: user.displayName,
    employeeSlug: user.employeeSlug,
    canManageAvailability: user.canManageAvailability
  });

  redirect(safeRedirect);
}

export async function logoutUser(formData: FormData) {
  const localeValue = normalize(formData.get("locale"));
  const locale = isLocale(localeValue) ? localeValue : "de";

  await clearSession();
  redirect(`/${locale}/login`);
}
