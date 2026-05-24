import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type AdminOffersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminOffersPage({ params }: AdminOffersPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  redirect(`/${locale}/admin/pages/offers`);
}
