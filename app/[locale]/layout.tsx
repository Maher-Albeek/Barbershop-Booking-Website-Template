import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CookieConsent } from "@/components/cookie-consent";
import { isLocale } from "@/lib/i18n";
import { SiteFooter } from "@/components/site-footer";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      {children}
      <SiteFooter locale={locale} />
      <CookieConsent locale={locale} />
    </>
  );
}
