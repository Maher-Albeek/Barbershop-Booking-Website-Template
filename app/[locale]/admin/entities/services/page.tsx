import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type AdminServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminServicesPage({ params }: AdminServicesPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  redirect(`/${locale}/admin/pages/services`);
}
