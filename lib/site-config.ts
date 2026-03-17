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

type LocalizedHomepageContent = {
  hero: HeroContent;
  highlights: Highlight[];
};

export const siteConfig: {
  defaultLocale: Locale;
  locales: readonly Locale[];
  brand: {
    shopName: string;
    logoText: string;
  };
  content: Record<Locale, LocalizedHomepageContent>;
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
  }
};
