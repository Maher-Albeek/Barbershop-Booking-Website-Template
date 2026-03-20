import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { AdminShell, SectionTitle, sectionStyle } from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminOffersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminOffersHeroPage({ params }: AdminOffersPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-016" title="Manage offers page" />
        <PageHeroEditor
          locale={locale}
          page="offers"
          label="Offers page hero image"
          description="Upload the hero image used on the public offers page."
        />
      </section>
    </AdminShell>
  );
}