import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { AdminShell, SectionTitle, sectionStyle } from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminTeamPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminTeamHeroPage({ params }: AdminTeamPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-015" title="Manage team page" />
        <PageHeroEditor
          locale={locale}
          page="team"
          label="Team page hero image"
          description="Upload the hero image used on the public team page."
        />
      </section>
    </AdminShell>
  );
}