import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type AdminEmployeesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminEmployeesPage({ params }: AdminEmployeesPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  redirect(`/${locale}/admin/pages/team`);
}
