import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  redirect(`/${locale}/admin/dashboard`);
}
