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

type TeamMember = {
  slug: string;
  isActive: boolean;
  imageSrc: string;
  specialties: string[];
  name: string;
  bio?: string;
};

type LocalizedTeamContent = {
  members: TeamMember[];
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
  team: Record<Locale, LocalizedTeamContent>;
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
  },
  team: {
    en: {
      members: [
        {
          slug: "marcus-reed",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
          specialties: ["Skin fades", "Executive grooming"],
          name: "Marcus Reed",
          bio: "Known for calm consultations and sharp finishing work, Marcus handles precise cuts for clients who want a polished weekly look."
        },
        {
          slug: "samir-haddad",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
          specialties: ["Beard sculpting", "Hot towel ritual"],
          name: "Samir Haddad",
          bio: "Samir focuses on beard architecture, detail lines, and a relaxed service flow that suits longer grooming appointments."
        },
        {
          slug: "jonah-brooks",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
          specialties: ["Texture", "Modern crop cuts"],
          name: "Jonah Brooks"
        },
        {
          slug: "oliver-stone",
          isActive: false,
          imageSrc:
            "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=900&q=80",
          specialties: ["Classic scissor work"],
          name: "Oliver Stone",
          bio: "Shown in config but hidden from the public team page while inactive."
        }
      ]
    },
    de: {
      members: [
        {
          slug: "marcus-reed",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
          specialties: ["Skin Fades", "Executive Grooming"],
          name: "Marcus Reed",
          bio: "Marcus ist für ruhige Beratung und saubere Finishing-Details bekannt und betreut präzise Schnitte für einen gepflegten Alltagslook."
        },
        {
          slug: "samir-haddad",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
          specialties: ["Bartkonturen", "Hot-Towel-Ritual"],
          name: "Samir Haddad",
          bio: "Samir konzentriert sich auf Bartarchitektur, exakte Linien und einen entspannten Serviceablauf für längere Grooming-Termine."
        },
        {
          slug: "jonah-brooks",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
          specialties: ["Textur", "Moderne Crop Cuts"],
          name: "Jonah Brooks"
        },
        {
          slug: "oliver-stone",
          isActive: false,
          imageSrc:
            "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=900&q=80",
          specialties: ["Klassische Scherenarbeit"],
          name: "Oliver Stone",
          bio: "Im Inhalt gepflegt, aber bei inaktivem Status nicht öffentlich sichtbar."
        }
      ]
    },
    ar: {
      members: [
        {
          slug: "marcus-reed",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
          specialties: [
            "\u062a\u062f\u0631\u062c \u0627\u0644\u0633\u0643\u0646 \u0641\u064a\u062f",
            "\u0639\u0646\u0627\u064a\u0629 \u0627\u062d\u062a\u0631\u0627\u0641\u064a\u0629"
          ],
          name: "Marcus Reed",
          bio: "\u064a\u0634\u062a\u0647\u0631 \u0645\u0627\u0631\u0643\u0633 \u0628\u0627\u0644\u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u0627\u0644\u0647\u0627\u062f\u0626\u0629 \u0648\u0627\u0644\u0644\u0645\u0633\u0627\u062a \u0627\u0644\u0646\u0647\u0627\u0626\u064a\u0629 \u0627\u0644\u062f\u0642\u064a\u0642\u0629 \u0644\u0642\u0635\u0627\u062a \u0623\u0646\u064a\u0642\u0629 \u0648\u0645\u0646\u062a\u0638\u0645\u0629."
        },
        {
          slug: "samir-haddad",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
          specialties: [
            "\u0646\u062d\u062a \u0627\u0644\u0644\u062d\u064a\u0629",
            "\u0637\u0642\u0633 \u0627\u0644\u0645\u0646\u0634\u0641\u0629 \u0627\u0644\u0633\u0627\u062e\u0646\u0629"
          ],
          name: "Samir Haddad",
          bio: "\u064a\u0631\u0643\u0632 \u0633\u0645\u064a\u0631 \u0639\u0644\u0649 \u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u0644\u062d\u064a\u0629 \u0648\u0631\u0633\u0645 \u0627\u0644\u062d\u0648\u0627\u0641 \u0628\u062f\u0642\u0629 \u0645\u0639 \u062a\u062c\u0631\u0628\u0629 \u0645\u0631\u064a\u062d\u0629 \u0644\u062c\u0644\u0633\u0627\u062a \u0627\u0644\u0639\u0646\u0627\u064a\u0629 \u0627\u0644\u0637\u0648\u064a\u0644\u0629."
        },
        {
          slug: "jonah-brooks",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
          specialties: [
            "\u062a\u0635\u0641\u064a\u0641 \u0628\u0627\u0644\u0645\u0644\u0645\u0633",
            "\u0642\u0635\u0627\u062a \u0643\u0631\u0648\u0628 \u0639\u0635\u0631\u064a\u0629"
          ],
          name: "Jonah Brooks"
        },
        {
          slug: "oliver-stone",
          isActive: false,
          imageSrc:
            "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=900&q=80",
          specialties: ["\u0627\u0644\u0642\u0635 \u0628\u0627\u0644\u0645\u0642\u0635"],
          name: "Oliver Stone",
          bio: "\u0645\u0648\u062c\u0648\u062f \u0641\u064a \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0648\u0644\u0643\u0646\u0647 \u0645\u062e\u0641\u064a \u0639\u0646 \u0627\u0644\u0648\u0627\u062c\u0647\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0639\u0646\u062f \u062a\u0639\u0637\u064a\u0644\u0647."
        }
      ]
    }
  }
};
