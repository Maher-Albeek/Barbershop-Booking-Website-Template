import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getLegalContent } from "@/lib/site-config";

type DatenschutzPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DatenschutzPage({ params }: DatenschutzPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const privacy = getLegalContent(locale).privacy;

  return (
    <main
      lang={locale}
      dir={dictionary.direction}
      style={{
        minHeight: "100vh",
        padding: "32px 20px 56px"
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <section
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface)",
            boxShadow: "var(--shadow)",
            borderRadius: 32,
            padding: "32px 24px"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              background: "var(--surface-strong)",
              color: "var(--muted)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase"
            }}
          >
            {privacy.eyebrow}
          </div>

          <h1 style={{ margin: "18px 0 12px", fontSize: "clamp(2.4rem, 6vw, 4rem)" }}>{privacy.title}</h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8 }}>{privacy.introduction}</p>

          <div style={{ display: "grid", gap: 20, marginTop: 28 }}>
            {privacy.sections.map((section) => (
              <section
                key={section.title}
                style={{
                  padding: 20,
                  borderRadius: 24,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.02)"
                }}
              >
                <h2 style={{ margin: "0 0 12px", fontSize: 22 }}>{section.title}</h2>
                <div style={{ display: "grid", gap: 10 }}>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} style={{ margin: 0, lineHeight: 1.8, color: "var(--muted)" }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
