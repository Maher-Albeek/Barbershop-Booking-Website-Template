import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import {
  AdminShell,
  SectionTitle,
  sectionStyle
} from "../../_components";
import { HeroImageManager } from "../../_hero-image-manager";

type AdminHeroPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminHeroPage({ params }: AdminHeroPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-013" title="Manage hero images" />
        <div style={{ ...sectionStyle, display: "grid", gap: 12 }}>
          <strong>Homepage hero section image</strong>
          <HeroImageManager locale={locale} />
        </div>
      </section>
    </AdminShell>
  );
}
