import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type TeamPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  redirect(`/${locale}#team`);
}
