import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type OffersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OffersPage({ params }: OffersPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  redirect(`/${locale}#offers`);
}
