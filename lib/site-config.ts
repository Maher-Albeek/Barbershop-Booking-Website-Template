import { defaultLocale, locales, type Locale } from "@/lib/i18n";

type HeroContent = {
  kicker: string;
  title: string;
  subtitle: string;
};

type Highlight = {
  title: string;
  description: string;
};

type Service = {
  slug: string;
  isActive: boolean;
  pricing: "variable" | "fixed";
  priceLabel?: string;
  durationLabel: string;
  name: string;
  description: string;
};

type LocalizedHomepageContent = {
  hero: HeroContent;
  highlights: Highlight[];
};

type LocalizedServicesContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  services: Service[];
};

export const siteConfig: {
  defaultLocale: Locale;
  locales: readonly Locale[];
  brand: {
    shopName: string;
    logoText: string;
  };
  content: Record<Locale, LocalizedHomepageContent>;
  services: Record<Locale, LocalizedServicesContent>;
} = {
  defaultLocale,
  locales,
  brand: {
    shopName: "Crown & Blade",
    logoText: "CB"
  },
  content: {
    en: {
      hero: {
        kicker: "Sharp appointments. Calm atmosphere.",
        title: "Classic craft for the modern gentleman.",
        subtitle:
          "Present your brand, signature service quality, and a clear booking call to action from one editable content source."
      },
      highlights: [
        {
          title: "Brand-first landing experience",
          description:
            "Shop identity, voice, and visual tone are driven from the central site config so each deployment can be tailored quickly."
        },
        {
          title: "Built for multilingual shops",
          description:
            "English, German, and Arabic homepage content is ready, including right-to-left support for Arabic."
        }
      ]
    },
    de: {
      hero: {
        kicker: "Präzise Termine. Ruhige Atmosphäre.",
        title: "Klassisches Handwerk für den modernen Gentleman.",
        subtitle:
          "Präsentiere Marke, Servicequalität und einen klaren Buchungsaufruf aus einer bearbeitbaren Inhaltsquelle."
      },
      highlights: [
        {
          title: "Startseite mit Markenfokus",
          description:
            "Identität, Sprache und Farbwirkung des Shops werden zentral gepflegt und lassen sich je Deployment schnell anpassen."
        },
        {
          title: "Mehrsprachig vorbereitet",
          description:
            "Die Startseite ist für Deutsch, Englisch und Arabisch vorbereitet, inklusive RTL-Unterstützung für Arabisch."
        }
      ]
    },
    ar: {
      hero: {
        kicker: "مواعيد دقيقة وأجواء هادئة.",
        title: "حرفة كلاسيكية للرجل العصري.",
        subtitle:
          "اعرض هوية المتجر وجودة الخدمات مع دعوة واضحة للحجز من مصدر محتوى واحد قابل للتعديل."
      },
      highlights: [
        {
          title: "واجهة رئيسية تركز على العلامة",
          description:
            "هوية المتجر ونبرة المحتوى والاتجاه البصري كلها تُدار من إعداد مركزي ليسهل تخصيص كل نسخة."
        },
        {
          title: "جاهز لعدة لغات",
          description:
            "المحتوى متوفر بالإنجليزية والألمانية والعربية مع دعم الاتجاه من اليمين إلى اليسار."
        }
      ]
    }
  },
  services: {
    en: {
      eyebrow: "Service menu",
      title: "Choose the service that fits your next appointment.",
      subtitle:
        "Only active services are shown here. Pricing can remain flexible per barber while customers still understand the offer clearly.",
      services: [
        {
          slug: "signature-cut",
          isActive: true,
          pricing: "variable",
          durationLabel: "45 min",
          name: "Signature Cut",
          description:
            "Precision consultation, tailored haircut, hot towel finish, and styling shaped around your routine."
        },
        {
          slug: "beard-ritual",
          isActive: true,
          pricing: "variable",
          durationLabel: "30 min",
          name: "Beard Ritual",
          description:
            "Detailed beard sculpting, line work, and conditioning treatment for a sharper profile."
        },
        {
          slug: "full-grooming-session",
          isActive: true,
          pricing: "fixed",
          priceLabel: "from $48",
          durationLabel: "60 min",
          name: "Full Grooming Session",
          description:
            "Haircut, beard refinement, and finishing care bundled into one extended appointment."
        },
        {
          slug: "student-cut",
          isActive: false,
          pricing: "fixed",
          priceLabel: "from $22",
          durationLabel: "30 min",
          name: "Student Cut",
          description: "A simplified maintenance cut reserved for off-peak campaign periods."
        }
      ]
    },
    de: {
      eyebrow: "Leistungsmen\u00fc",
      title: "W\u00e4hle die Leistung, die zu deinem n\u00e4chsten Termin passt.",
      subtitle:
        "Hier werden nur aktive Leistungen gezeigt. Preise k\u00f6nnen je Barber variieren, ohne dass das Angebot unklar wird.",
      services: [
        {
          slug: "signature-cut",
          isActive: true,
          pricing: "variable",
          durationLabel: "45 Min.",
          name: "Signature Cut",
          description:
            "Pr\u00e4zise Beratung, individueller Haarschnitt, hei\u00dfes Handtuch und Styling passend zu deinem Alltag."
        },
        {
          slug: "beard-ritual",
          isActive: true,
          pricing: "variable",
          durationLabel: "30 Min.",
          name: "Beard Ritual",
          description:
            "Detailliertes Bartstyling, saubere Konturen und pflegende Behandlung f\u00fcr ein markantes Finish."
        },
        {
          slug: "full-grooming-session",
          isActive: true,
          pricing: "fixed",
          priceLabel: "ab 48 $",
          durationLabel: "60 Min.",
          name: "Full Grooming Session",
          description:
            "Haarschnitt, Bartpflege und Abschlussbehandlung in einem l\u00e4ngeren Termin kombiniert."
        },
        {
          slug: "student-cut",
          isActive: false,
          pricing: "fixed",
          priceLabel: "ab 22 $",
          durationLabel: "30 Min.",
          name: "Student Cut",
          description:
            "Ein reduzierter Maintenance-Cut, der nur w\u00e4hrend saisonaler Aktionen angeboten wird."
        }
      ]
    },
    ar: {
      eyebrow: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062e\u062f\u0645\u0627\u062a",
      title: "\u0627\u062e\u062a\u0631 \u0627\u0644\u062e\u062f\u0645\u0629 \u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0645\u0648\u0639\u062f\u0643 \u0627\u0644\u0642\u0627\u062f\u0645.",
      subtitle:
        "\u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062d\u0629 \u062a\u0639\u0631\u0636 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629 \u0641\u0642\u0637. \u064a\u0645\u0643\u0646 \u0623\u0646 \u064a\u062e\u062a\u0644\u0641 \u0627\u0644\u0633\u0639\u0631 \u062d\u0633\u0628 \u0627\u0644\u062d\u0644\u0627\u0642 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u0639\u0631\u0636 \u0648\u0627\u0636\u062d\u0627 \u0644\u0644\u0639\u0645\u064a\u0644.",
      services: [
        {
          slug: "signature-cut",
          isActive: true,
          pricing: "variable",
          durationLabel: "45 \u062f\u0642\u064a\u0642\u0629",
          name: "\u0642\u0635\u0629 \u0633\u064a\u063a\u0646\u0627\u062a\u0634\u0631",
          description:
            "\u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u062f\u0642\u064a\u0642\u0629\u060c \u0648\u0642\u0635\u0629 \u0645\u062e\u0635\u0635\u0629\u060c \u0648\u0645\u0646\u0634\u0641\u0629 \u0633\u0627\u062e\u0646\u0629\u060c \u0648\u062a\u0633\u0631\u064a\u062d \u064a\u0646\u0627\u0633\u0628 \u0631\u0648\u062a\u064a\u0646\u0643."
        },
        {
          slug: "beard-ritual",
          isActive: true,
          pricing: "variable",
          durationLabel: "30 \u062f\u0642\u064a\u0642\u0629",
          name: "\u0637\u0642\u0633 \u0627\u0644\u0644\u062d\u064a\u0629",
          description:
            "\u062a\u0634\u0630\u064a\u0628 \u062f\u0642\u064a\u0642 \u0644\u0644\u062d\u064a\u0629\u060c \u0648\u0631\u0633\u0645 \u0627\u0644\u062d\u0648\u0627\u0641\u060c \u0648\u0639\u0646\u0627\u064a\u0629 \u0645\u063a\u0630\u064a\u0629 \u0644\u0645\u0638\u0647\u0631 \u0623\u0643\u062b\u0631 \u062d\u062f\u0629."
        },
        {
          slug: "full-grooming-session",
          isActive: true,
          pricing: "fixed",
          priceLabel: "\u064a\u0628\u062f\u0623 \u0645\u0646 48$",
          durationLabel: "60 \u062f\u0642\u064a\u0642\u0629",
          name: "\u062c\u0644\u0633\u0629 \u0639\u0646\u0627\u064a\u0629 \u0643\u0627\u0645\u0644\u0629",
          description:
            "\u062d\u0644\u0627\u0642\u0629 \u0627\u0644\u0634\u0639\u0631 \u0648\u062a\u0647\u0630\u064a\u0628 \u0627\u0644\u0644\u062d\u064a\u0629 \u0648\u0639\u0646\u0627\u064a\u0629 \u0646\u0647\u0627\u0626\u064a\u0629 \u0641\u064a \u0645\u0648\u0639\u062f \u0645\u062a\u0643\u0627\u0645\u0644."
        },
        {
          slug: "student-cut",
          isActive: false,
          pricing: "fixed",
          priceLabel: "\u064a\u0628\u062f\u0623 \u0645\u0646 22$",
          durationLabel: "30 \u062f\u0642\u064a\u0642\u0629",
          name: "\u0642\u0635\u0629 \u0627\u0644\u0637\u0644\u0627\u0628",
          description:
            "\u062e\u062f\u0645\u0629 \u0635\u064a\u0627\u0646\u0629 \u0645\u0628\u0633\u0637\u0629 \u062a\u064f\u0637\u0631\u062d \u0641\u0642\u0637 \u0641\u064a \u0641\u062a\u0631\u0627\u062a \u0627\u0644\u0639\u0631\u0648\u0636."
        }
      ]
    }
  }
};
