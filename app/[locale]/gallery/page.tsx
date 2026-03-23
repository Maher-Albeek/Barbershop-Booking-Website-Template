import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type GalleryPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  redirect(`/${locale}#gallery`);
}
