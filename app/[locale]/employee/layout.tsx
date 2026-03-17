import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";

type EmployeeLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function EmployeeLayout({ children, params }: EmployeeLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await requireRole(["employee", "admin"], locale, "/employee");

  return children;
}
