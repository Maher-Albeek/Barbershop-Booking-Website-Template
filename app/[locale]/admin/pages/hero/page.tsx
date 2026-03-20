import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getHomepageContent } from "@/lib/site-config";
import { updateHomepageHeroContentAction } from "../../actions";
import {
  AdminShell,
  SectionTitle,
  inputStyle,
  sectionStyle
} from "../../_components";
import { PageHeroEditor } from "../_page-hero-editor";

type AdminHeroPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminHeroPage({ params }: AdminHeroPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const homepageContent = getHomepageContent(locale);

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-013" title="Manage home page" />
        <PageHeroEditor
          locale={locale}
          page="home"
          label="Home page hero image"
          description="Upload the hero image used on the public home page."
        />
        <form action={updateHomepageHeroContentAction} style={{ display: "grid", gap: 12 }}>
          <input type="hidden" name="locale" value={locale} />
          <input
            name="heroKicker"
            defaultValue={homepageContent.hero.kicker}
            placeholder="Hero kicker"
            style={inputStyle}
          />
          <input
            name="heroTitle"
            defaultValue={homepageContent.hero.title}
            placeholder="Hero title"
            style={inputStyle}
          />
          <input
            name="heroSubtitle"
            defaultValue={homepageContent.hero.subtitle}
            placeholder="Hero subtitle"
            style={inputStyle}
          />
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save hero content
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
