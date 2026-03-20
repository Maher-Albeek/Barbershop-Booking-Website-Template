import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { AdminShell, SectionTitle, sectionStyle } from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminServicesHeroPage({ params }: AdminServicesPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-014" title="Manage services page" />
        <PageHeroEditor
          locale={locale}
          page="services"
          label="Services page hero image"
          description="Upload the hero image used on the public services page."
        />
      </section>
    </AdminShell>
  );
}