import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { AdminShell, SectionTitle, sectionStyle } from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminBookingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminBookingHeroPage({ params }: AdminBookingPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-017" title="Manage booking page" />
        <PageHeroEditor
          locale={locale}
          page="booking"
          label="Booking page hero image"
          description="Upload the hero image used on the public booking page."
        />
      </section>
    </AdminShell>
  );
}