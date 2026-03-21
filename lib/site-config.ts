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
  bookingServiceSlugs: string[];
  specialties: string[];
  name: string;
  bio?: string;
};

type LocalizedTeamContent = {
  members: TeamMember[];
};

type GalleryImage = {
  slug: string;
  imageSrc: string;
  alt: string;
  caption: string;
  sourceHref?: string;
  isVisible: boolean;
  sortOrder: number;
};

type LocalizedGalleryContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  images: GalleryImage[];
};

type Offer = {
  slug: string;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  imageSrc?: string;
  title: string;
  description: string;
};

type LocalizedOffersContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  offers: Offer[];
};

type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

type WorkingHoursEntry = {
  days: string;
  hours: string;
};

type LocalizedContactContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  shopSummary: string;
  visitNote: string;
  responseNote: string;
  workingHoursTitle: string;
  workingHoursNote: string;
  workingHours: WorkingHoursEntry[];
  form: {
    eyebrow: string;
    title: string;
    description: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    subjectLabel: string;
    messageLabel: string;
    submitLabel: string;
    submittingLabel: string;
    privacyNote: string;
    successMessage: string;
    errorMessage: string;
    requiredMessage: string;
    invalidEmailMessage: string;
  };
  map: {
    isVisible: boolean;
    eyebrow: string;
    title: string;
    description: string;
    directionsLabel: string;
    directionsHref: string;
    embedUrl: string;
    consentTitle: string;
    consentDescription: string;
    consentButtonLabel: string;
    privacyNotice: string;
  };
  items: {
    phone: ContactItem;
    email: ContactItem;
    address: ContactItem;
    whatsapp?: ContactItem;
  };
};

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LocalizedLegalContent = {
  impressum: {
    eyebrow: string;
    title: string;
    introduction: string;
    ownerLabel: string;
    ownerName: string;
    responsibleLabel: string;
    responsibleName: string;
    sections: LegalSection[];
  };
  privacy: {
    eyebrow: string;
    title: string;
    introduction: string;
    sections: LegalSection[];
  };
};

type EmployeeServiceAssignment = {
  employeeSlug: string;
  serviceSlug: string;
  durationMinutes: number;
  priceLabel: string;
  isActive: boolean;
};

type EmployeeWorkingHours = {
  employeeSlug: string;
  weekday: number;
  start: string;
  end: string;
  isOff?: boolean;
};

type EmployeeBlockedTime = {
  employeeSlug: string;
  date: string;
  start: string;
  end: string;
  reason?: string;
};

type ExistingBooking = {
  employeeSlug: string;
  serviceSlug: string;
  date: string;
  start: string;
  end: string;
};

export const siteConfig: {
  defaultLocale: Locale;
  locales: readonly Locale[];
  brand: {
    shopName: string;
    logoText: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    socials?: {
      instagram?: string;
      tiktok?: string;
    };
  };
  content: Record<Locale, LocalizedHomepageContent>;
  services: Record<Locale, LocalizedServicesContent>;
  team: Record<Locale, LocalizedTeamContent>;
  gallery: Record<Locale, LocalizedGalleryContent>;
  offers: Record<Locale, LocalizedOffersContent>;
  contact: Record<Locale, LocalizedContactContent>;
  legal: Record<Locale, LocalizedLegalContent>;
  booking: {
    slotIntervalMinutes: number;
    searchWindowDays: number;
    maxDaysWithSlots: number;
    employeeServices: EmployeeServiceAssignment[];
    workingHours: EmployeeWorkingHours[];
    blockedTimes: EmployeeBlockedTime[];
    existingBookings: ExistingBooking[];
  };
  emailSettings: {
    providerName: string;
    fromEmail: string;
    replyToEmail: string;
    sendCustomerConfirmation: boolean;
    sendInternalNotification: boolean;
    internalNotificationEmail: string;
  };
} = {
  defaultLocale,
  locales,
  brand: {
    shopName: "Crown & Blade",
    logoText: "CB",
    primaryColor: "#8b5e3c",
    secondaryColor: "#d6b07d",
    accentColor: "#22333b",
    socials: {
      instagram: "https://www.instagram.com/",
      tiktok: "https://www.tiktok.com/"
    }
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
          bookingServiceSlugs: ["signature-cut", "beard-ritual", "full-grooming-session"],
          specialties: ["Skin fades", "Executive grooming"],
          name: "Marcus Reed",
          bio: "Known for calm consultations and sharp finishing work, Marcus handles precise cuts for clients who want a polished weekly look."
        },
        {
          slug: "samir-haddad",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
          bookingServiceSlugs: ["beard-ritual", "full-grooming-session"],
          specialties: ["Beard sculpting", "Hot towel ritual"],
          name: "Samir Haddad",
          bio: "Samir focuses on beard architecture, detail lines, and a relaxed service flow that suits longer grooming appointments."
        },
        {
          slug: "jonah-brooks",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
          bookingServiceSlugs: ["signature-cut"],
          specialties: ["Texture", "Modern crop cuts"],
          name: "Jonah Brooks"
        },
        {
          slug: "oliver-stone",
          isActive: false,
          imageSrc:
            "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=900&q=80",
          bookingServiceSlugs: ["signature-cut"],
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
          bookingServiceSlugs: ["signature-cut", "beard-ritual", "full-grooming-session"],
          specialties: ["Skin Fades", "Executive Grooming"],
          name: "Marcus Reed",
          bio: "Marcus ist für ruhige Beratung und saubere Finishing-Details bekannt und betreut präzise Schnitte für einen gepflegten Alltagslook."
        },
        {
          slug: "samir-haddad",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
          bookingServiceSlugs: ["beard-ritual", "full-grooming-session"],
          specialties: ["Bartkonturen", "Hot-Towel-Ritual"],
          name: "Samir Haddad",
          bio: "Samir konzentriert sich auf Bartarchitektur, exakte Linien und einen entspannten Serviceablauf für längere Grooming-Termine."
        },
        {
          slug: "jonah-brooks",
          isActive: true,
          imageSrc:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
          bookingServiceSlugs: ["signature-cut"],
          specialties: ["Textur", "Moderne Crop Cuts"],
          name: "Jonah Brooks"
        },
        {
          slug: "oliver-stone",
          isActive: false,
          imageSrc:
            "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=900&q=80",
          bookingServiceSlugs: ["signature-cut"],
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
          bookingServiceSlugs: ["signature-cut", "beard-ritual", "full-grooming-session"],
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
          bookingServiceSlugs: ["beard-ritual", "full-grooming-session"],
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
          bookingServiceSlugs: ["signature-cut"],
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
          bookingServiceSlugs: ["signature-cut"],
          specialties: ["\u0627\u0644\u0642\u0635 \u0628\u0627\u0644\u0645\u0642\u0635"],
          name: "Oliver Stone",
          bio: "\u0645\u0648\u062c\u0648\u062f \u0641\u064a \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0648\u0644\u0643\u0646\u0647 \u0645\u062e\u0641\u064a \u0639\u0646 \u0627\u0644\u0648\u0627\u062c\u0647\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0639\u0646\u062f \u062a\u0639\u0637\u064a\u0644\u0647."
        }
      ]
    }
  },
  gallery: {
    en: {
      eyebrow: "Inside the shop",
      title: "Browse the gallery before you book.",
      subtitle:
        "Only visible gallery images are shown here, ordered by sort order so the featured presentation stays consistent.",
      images: [
        {
          slug: "interior-detail",
          imageSrc:
            "https://69b8a91cdbcf8e0d39e5177b.imgix.net/luxury-coffee-shop-table-inside-barista-bar-generated-by-ai.jpg",
          alt: "Warm barbershop interior with leather chairs and mirrors",
          sourceHref:
            "https://www.freepik.com/free-ai-image/luxury-coffee-shop-table-inside-barista-bar-generated-by-ai_42131531.htm#fromView=search&page=1&position=1&uuid=d69de93f-7c8d-4fed-8591-04e815b2da71&query=Warmer+Barbershop-Innenraum+mit+Ledersesseln+und+Spiegeln",
          caption: "A calm interior built around warm tones, clean stations, and comfortable waiting space.",
          isVisible: true,
          sortOrder: 1
        },
        {
          slug: "service-finish",
          imageSrc:
            "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
          alt: "Barber refining a haircut with close finishing work",
          caption: "Detail-focused finishing work that reflects the shop's precision and consistency.",
          isVisible: true,
          sortOrder: 2
        },
        {
          slug: "tools-counter",
          imageSrc:
            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
          alt: "Barber tools arranged neatly on a workstation",
          caption: "Clean tools, organized stations, and presentation that supports a premium service standard.",
          isVisible: true,
          sortOrder: 3
        },
        {
          slug: "hidden-campaign-shot",
          imageSrc:
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
          alt: "Customer in a barber chair during an appointment",
          caption: "Kept in config for admin control, but hidden from the public page while not visible.",
          isVisible: false,
          sortOrder: 4
        }
      ]
    },
    de: {
      eyebrow: "Ein Blick in den Shop",
      title: "Sieh dir die Galerie vor der Buchung an.",
      subtitle:
        "Hier werden nur sichtbare Galeriebilder angezeigt, sortiert nach der festgelegten Reihenfolge.",
      images: [
        {
          slug: "interior-detail",
          imageSrc:
            "https://69b8a91cdbcf8e0d39e5177b.imgix.net/luxury-coffee-shop-table-inside-barista-bar-generated-by-ai.jpg",
          alt: "Warmer Barbershop-Innenraum mit Ledersesseln und Spiegeln",
          caption:
            "Ein ruhiger Innenraum mit warmen Tönen, sauberen Stationen und einem angenehmen Wartebereich.",
          isVisible: true,
          sortOrder: 1
        },
        {
          slug: "service-finish",
          imageSrc:
            "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
          alt: "Barber bei der präzisen Abschlussarbeit am Haarschnitt",
          caption:
            "Präzise Finish-Arbeit, die den Anspruch des Shops an saubere und verlässliche Ergebnisse zeigt.",
          isVisible: true,
          sortOrder: 2
        },
        {
          slug: "tools-counter",
          imageSrc:
            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
          alt: "Ordentlich angeordnete Barber-Werkzeuge auf einer Arbeitsfläche",
          caption:
            "Saubere Werkzeuge, organisierte Arbeitsplätze und eine Präsentation mit hochwertigem Eindruck.",
          isVisible: true,
          sortOrder: 3
        },
        {
          slug: "hidden-campaign-shot",
          imageSrc:
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
          alt: "Kunde während eines Termins im Barberstuhl",
          caption:
            "Bleibt zur Verwaltung in der Konfiguration, ist aber bei deaktivierter Sichtbarkeit nicht öffentlich zu sehen.",
          isVisible: false,
          sortOrder: 4
        }
      ]
    },
    ar: {
      eyebrow: "من داخل الصالون",
      title: "تصفح المعرض قبل الحجز.",
      subtitle:
        "تعرض هذه الصفحة صور المعرض الظاهرة فقط، مرتبة حسب ترتيب العرض المحدد.",
      images: [
        {
          slug: "interior-detail",
          imageSrc:
            "https://69b8a91cdbcf8e0d39e5177b.imgix.net/luxury-coffee-shop-table-inside-barista-bar-generated-by-ai.jpg",
          alt: "داخل صالون حلاقة دافئ مع كراسٍ جلدية ومرايا",
          caption: "مساحة هادئة بألوان دافئة ومحطات مرتبة ومنطقة انتظار مريحة.",
          isVisible: true,
          sortOrder: 1
        },
        {
          slug: "service-finish",
          imageSrc:
            "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
          alt: "حلاق ينهي تفاصيل قصة الشعر بدقة",
          caption: "لمسات نهائية دقيقة تعكس مستوى العناية والثبات في جودة الخدمة داخل الصالون.",
          isVisible: true,
          sortOrder: 2
        },
        {
          slug: "tools-counter",
          imageSrc:
            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
          alt: "أدوات الحلاقة مرتبة بعناية على محطة العمل",
          caption: "أدوات نظيفة ومحطات منظمة وعرض بصري يدعم إحساس الخدمة المميزة.",
          isVisible: true,
          sortOrder: 3
        },
        {
          slug: "hidden-campaign-shot",
          imageSrc:
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
          alt: "عميل يجلس على كرسي الحلاقة أثناء الموعد",
          caption: "تبقى الصورة في الإعدادات لإدارة المشرف لكنها مخفية عن الصفحة العامة عند تعطيلها.",
          isVisible: false,
          sortOrder: 4
        }
      ]
    }
  },
  offers: {
    en: {
      eyebrow: "Current promotions",
      title: "See what is running before you book.",
      subtitle:
        "Only active offers inside their live campaign window are shown here so the page always reflects current promotions.",
      offers: [
        {
          slug: "weekday-beard-detail",
          isActive: true,
          validFrom: "2026-03-01",
          validUntil: "2026-04-15",
          imageSrc:
            "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80",
          title: "Weekday Beard Detail",
          description:
            "Book a beard service from Tuesday to Thursday and receive a complimentary conditioning finish during the promotion window."
        },
        {
          slug: "father-son-session",
          isActive: true,
          validFrom: "2026-03-10",
          validUntil: "2026-05-05",
          title: "Father & Son Session",
          description:
            "Pair two appointments in one visit and receive a bundled promotional rate for a coordinated grooming session."
        },
        {
          slug: "winter-refresh",
          isActive: true,
          validFrom: "2026-01-05",
          validUntil: "2026-02-10",
          imageSrc:
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
          title: "Winter Refresh",
          description:
            "Stored in content history but no longer displayed because the offer has passed its validity range."
        },
        {
          slug: "members-preview",
          isActive: false,
          validFrom: "2026-03-20",
          validUntil: "2026-04-30",
          title: "Members Preview",
          description:
            "Configured for later activation but hidden from the public page until the campaign is marked active."
        }
      ]
    },
    de: {
      eyebrow: "Aktuelle Aktionen",
      title: "Sieh dir laufende Angebote vor der Buchung an.",
      subtitle:
        "Hier erscheinen nur aktive Angebote innerhalb ihres gueltigen Zeitraums, damit die Seite immer aktuell bleibt.",
      offers: [
        {
          slug: "weekday-beard-detail",
          isActive: true,
          validFrom: "2026-03-01",
          validUntil: "2026-04-15",
          imageSrc:
            "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80",
          title: "Bart-Detail unter der Woche",
          description:
            "Buche einen Bartservice von Dienstag bis Donnerstag und erhalte im Aktionszeitraum ein pflegendes Finish dazu."
        },
        {
          slug: "father-son-session",
          isActive: true,
          validFrom: "2026-03-10",
          validUntil: "2026-05-05",
          title: "Vater-und-Sohn-Termin",
          description:
            "Zwei Termine in einem Besuch mit Aktionspreis fuer eine gemeinsame Grooming-Session."
        },
        {
          slug: "winter-refresh",
          isActive: true,
          validFrom: "2026-01-05",
          validUntil: "2026-02-10",
          imageSrc:
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
          title: "Winter Refresh",
          description:
            "Bleibt in der Inhaltsquelle erhalten, wird aber nicht mehr angezeigt, weil der Zeitraum abgelaufen ist."
        },
        {
          slug: "members-preview",
          isActive: false,
          validFrom: "2026-03-20",
          validUntil: "2026-04-30",
          title: "Mitglieder-Vorschau",
          description:
            "Ist fuer eine spaetere Aktivierung vorbereitet und bleibt bis dahin auf der oeffentlichen Seite verborgen."
        }
      ]
    },
    ar: {
      eyebrow: "العروض الحالية",
      title: "اطلع على العروض الجارية قبل الحجز.",
      subtitle:
        "تعرض هذه الصفحة العروض النشطة فقط ضمن فترة صلاحيتها حتى يبقى المحتوى معبرا عن الحملات الحالية.",
      offers: [
        {
          slug: "weekday-beard-detail",
          isActive: true,
          validFrom: "2026-03-01",
          validUntil: "2026-04-15",
          imageSrc:
            "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80",
          title: "تفاصيل اللحية خلال ايام الاسبوع",
          description:
            "احجز خدمة اللحية من الثلاثاء الى الخميس واحصل على لمسة عناية نهائية مجانية خلال فترة العرض."
        },
        {
          slug: "father-son-session",
          isActive: true,
          validFrom: "2026-03-10",
          validUntil: "2026-05-05",
          title: "جلسة الاب والابن",
          description:
            "احجز موعدين في زيارة واحدة واحصل على سعر ترويجي لجلسة عناية منسقة."
        },
        {
          slug: "winter-refresh",
          isActive: true,
          validFrom: "2026-01-05",
          validUntil: "2026-02-10",
          imageSrc:
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
          title: "تجديد الشتاء",
          description:
            "يبقى هذا العرض في مصدر المحتوى لكنه لا يظهر بعد انتهاء فترة صلاحيته."
        },
        {
          slug: "members-preview",
          isActive: false,
          validFrom: "2026-03-20",
          validUntil: "2026-04-30",
          title: "معاينة الاعضاء",
          description:
            "تم اعداده لحملة لاحقة لكنه يظل مخفيا حتى يتم تفعيله."
        }
      ]
    }
  },
  contact: {
    en: {
      eyebrow: "Contact & location",
      title: "Reach the shop before you arrive.",
      subtitle:
        "Phone, email, address, and messaging details are managed from one editable config so each deployment can publish the correct local contact information.",
      shopSummary:
        "Crown & Blade keeps every essential contact point in one place so guests can call, message, or navigate to the shop without friction.",
      visitNote:
        "Walk-ins are welcome when capacity allows, but calling ahead is the fastest way to confirm same-day availability.",
      responseNote:
        "Messages sent through WhatsApp are typically answered during business hours.",
      workingHoursTitle: "Working hours",
      workingHoursNote:
        "Hours can shift on holidays or campaign days, so call ahead if you need same-day confirmation.",
      workingHours: [
        { days: "Monday", hours: "09:00 - 18:00" },
        { days: "Tuesday - Friday", hours: "09:00 - 20:00" },
        { days: "Saturday", hours: "10:00 - 18:00" },
        { days: "Sunday", hours: "Closed" }
      ],
      form: {
        eyebrow: "Send a message",
        title: "Use the contact form for questions or special requests.",
        description:
          "Share your message and preferred contact details. The shop can follow up by email or phone.",
        nameLabel: "Name",
        emailLabel: "Email",
        phoneLabel: "Phone (optional)",
        subjectLabel: "Subject",
        messageLabel: "Message",
        submitLabel: "Send request",
        submittingLabel: "Sending...",
        privacyNote: "By sending this form, you agree that the shop may contact you about your request.",
        successMessage: "Your message has been sent. The shop will reply as soon as possible.",
        errorMessage: "Check the form and correct the highlighted fields before sending.",
        requiredMessage: "Complete all required fields before sending your message.",
        invalidEmailMessage: "Enter a valid email address so the shop can reply to you."
      },
      map: {
        isVisible: true,
        eyebrow: "Map",
        title: "Find Crown & Blade in central Berlin.",
        description:
          "The map is embedded on the page so customers can verify the location before they travel.",
        directionsLabel: "Open directions",
        directionsHref:
          "https://www.google.com/maps/search/?api=1&query=Friedrichstrasse+148%2C+10117+Berlin",
        embedUrl:
          "https://www.google.com/maps?q=Friedrichstrasse+148,+10117+Berlin&z=15&output=embed",
        consentTitle: "Load the embedded map",
        consentDescription:
          "The map uses a third-party provider. Load it only if you want to share data with that provider on this page.",
        consentButtonLabel: "Load map",
        privacyNotice: "You can use the directions link without loading the embedded map."
      },
      items: {
        phone: {
          label: "Phone",
          value: "+49 30 1234 5678",
          href: "tel:+493012345678"
        },
        email: {
          label: "Email",
          value: "hello@crownandblade.de",
          href: "mailto:hello@crownandblade.de"
        },
        address: {
          label: "Address",
          value: "Friedrichstrasse 148, 10117 Berlin, Germany"
        },
        whatsapp: {
          label: "WhatsApp",
          value: "Chat with the shop",
          href: "https://wa.me/493012345678"
        }
      }
    },
    de: {
      eyebrow: "Kontakt & Standort",
      title: "Erreiche den Shop vor deinem Besuch.",
      subtitle:
        "Telefon, E-Mail, Adresse und Messenger-Kontakt werden zentral gepflegt, damit jede Bereitstellung die korrekten lokalen Kontaktdaten zeigt.",
      shopSummary:
        "Crown & Blade buendelt alle wichtigen Kontaktdaten an einem Ort, damit Kundinnen und Kunden schnell anrufen, schreiben oder den Weg planen koennen.",
      visitNote:
        "Spontane Besuche sind moeglich, wenn Kapazitaet frei ist. Fuer Termine am selben Tag ist ein kurzer Anruf am schnellsten.",
      responseNote:
        "WhatsApp-Nachrichten werden in der Regel waehrend der Geschaeftszeiten beantwortet.",
      workingHoursTitle: "Oeffnungszeiten",
      workingHoursNote:
        "An Feiertagen oder Aktionstagen koennen die Zeiten abweichen. Fuer denselben Tag am besten kurz anrufen.",
      workingHours: [
        { days: "Montag", hours: "09:00 - 18:00" },
        { days: "Dienstag - Freitag", hours: "09:00 - 20:00" },
        { days: "Samstag", hours: "10:00 - 18:00" },
        { days: "Sonntag", hours: "Geschlossen" }
      ],
      form: {
        eyebrow: "Nachricht senden",
        title: "Nutze das Kontaktformular fuer Fragen oder besondere Anliegen.",
        description:
          "Teile deine Nachricht und passende Kontaktdaten mit. Der Shop kann per E-Mail oder Telefon reagieren.",
        nameLabel: "Name",
        emailLabel: "E-Mail",
        phoneLabel: "Telefon (optional)",
        subjectLabel: "Betreff",
        messageLabel: "Nachricht",
        submitLabel: "Anfrage senden",
        submittingLabel: "Wird gesendet...",
        privacyNote:
          "Mit dem Absenden stimmst du zu, dass der Shop dich zu deiner Anfrage kontaktieren darf.",
        successMessage: "Deine Nachricht wurde gesendet. Der Shop meldet sich so schnell wie moeglich.",
        errorMessage:
          "Pruefe das Formular und korrigiere die markierten Felder, bevor du es erneut sendest.",
        requiredMessage: "Bitte fuelle alle Pflichtfelder aus, bevor du deine Nachricht sendest.",
        invalidEmailMessage:
          "Bitte gib eine gueltige E-Mail-Adresse an, damit der Shop dir antworten kann."
      },
      map: {
        isVisible: true,
        eyebrow: "Karte",
        title: "Finde Crown & Blade im Zentrum von Berlin.",
        description:
          "Die Karte ist direkt auf der Seite eingebettet, damit Kundinnen und Kunden den Standort sofort pruefen koennen.",
        directionsLabel: "Route oeffnen",
        directionsHref:
          "https://www.google.com/maps/search/?api=1&query=Friedrichstrasse+148%2C+10117+Berlin",
        embedUrl:
          "https://www.google.com/maps?q=Friedrichstrasse+148,+10117+Berlin&z=15&output=embed",
        consentTitle: "Eingebettete Karte laden",
        consentDescription:
          "Die Karte stammt von einem Drittanbieter. Lade sie nur, wenn du der Datenuebertragung an diesen Anbieter auf dieser Seite zustimmst.",
        consentButtonLabel: "Karte laden",
        privacyNotice: "Du kannst die Route auch ohne eingebettete Karte ueber den Link oeffnen."
      },
      items: {
        phone: {
          label: "Telefon",
          value: "+49 30 1234 5678",
          href: "tel:+493012345678"
        },
        email: {
          label: "E-Mail",
          value: "hello@crownandblade.de",
          href: "mailto:hello@crownandblade.de"
        },
        address: {
          label: "Adresse",
          value: "Friedrichstrasse 148, 10117 Berlin, Deutschland"
        },
        whatsapp: {
          label: "WhatsApp",
          value: "Mit dem Shop chatten",
          href: "https://wa.me/493012345678"
        }
      }
    },
    ar: {
      eyebrow: "\u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0648\u0627\u0644\u0645\u0648\u0642\u0639",
      title: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u0635\u0627\u0644\u0648\u0646 \u0642\u0628\u0644 \u0627\u0644\u0648\u0635\u0648\u0644.",
      subtitle:
        "\u064a\u062a\u0645 \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0647\u0627\u062a\u0641 \u0648\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0648\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0648\u0648\u0633\u0627\u0626\u0644 \u0627\u0644\u0645\u0631\u0627\u0633\u0644\u0629 \u0645\u0646 \u0645\u0635\u062f\u0631 \u0648\u0627\u062d\u062f \u0642\u0627\u0628\u0644 \u0644\u0644\u062a\u0639\u062f\u064a\u0644 \u0644\u0625\u0638\u0647\u0627\u0631 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0641\u0631\u0639 \u0627\u0644\u0635\u062d\u064a\u062d\u0629.",
      shopSummary:
        "\u064a\u062c\u0645\u0639 Crown & Blade \u0643\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0641\u064a \u0645\u0643\u0627\u0646 \u0648\u0627\u062d\u062f \u0644\u064a\u062a\u0645\u0643\u0646 \u0627\u0644\u0639\u0645\u064a\u0644 \u0645\u0646 \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0623\u0648 \u0627\u0644\u0645\u0631\u0627\u0633\u0644\u0629 \u0623\u0648 \u0627\u0644\u0648\u0635\u0648\u0644 \u0628\u0633\u0647\u0648\u0644\u0629.",
      visitNote:
        "\u064a\u0645\u0643\u0646 \u0627\u0633\u062a\u0642\u0628\u0627\u0644 \u0627\u0644\u0632\u0648\u0627\u0631 \u062f\u0648\u0646 \u062d\u062c\u0632 \u0639\u0646\u062f \u062a\u0648\u0641\u0631 \u0627\u0644\u0633\u0639\u0629\u060c \u0648\u0644\u0643\u0646 \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0645\u0633\u0628\u0642\u0627 \u0647\u0648 \u0627\u0644\u0623\u0633\u0631\u0639 \u0644\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u062a\u0648\u0641\u0631 \u0641\u064a \u0646\u0641\u0633 \u0627\u0644\u064a\u0648\u0645.",
      responseNote:
        "\u062a\u064f\u0631\u062f \u0631\u0633\u0627\u0626\u0644 \u0648\u0627\u062a\u0633\u0627\u0628 \u0639\u0627\u062f\u0629 \u062e\u0644\u0627\u0644 \u0633\u0627\u0639\u0627\u062a \u0627\u0644\u0639\u0645\u0644.",
      workingHoursTitle: "\u0633\u0627\u0639\u0627\u062a \u0627\u0644\u0639\u0645\u0644",
      workingHoursNote:
        "\u0642\u062f \u062a\u062a\u063a\u064a\u0631 \u0627\u0644\u0633\u0627\u0639\u0627\u062a \u0641\u064a \u0627\u0644\u0639\u0637\u0644 \u0623\u0648 \u0623\u064a\u0627\u0645 \u0627\u0644\u0639\u0631\u0648\u0636\u060c \u0644\u0630\u0627 \u064a\u0641\u0636\u0644 \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0645\u0633\u0628\u0642\u0627 \u0644\u0644\u062a\u0623\u0643\u062f \u0645\u0646 \u0645\u0648\u0627\u0639\u064a\u062f \u0627\u0644\u064a\u0648\u0645 \u0646\u0641\u0633\u0647.",
      workingHours: [
        { days: "\u0627\u0644\u0627\u062b\u0646\u064a\u0646", hours: "09:00 - 18:00" },
        { days: "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 - \u0627\u0644\u062c\u0645\u0639\u0629", hours: "09:00 - 20:00" },
        { days: "\u0627\u0644\u0633\u0628\u062a", hours: "10:00 - 18:00" },
        { days: "\u0627\u0644\u0623\u062d\u062f", hours: "\u0645\u063a\u0644\u0642" }
      ],
      form: {
        eyebrow: "\u0623\u0631\u0633\u0644 \u0631\u0633\u0627\u0644\u0629",
        title: "\u0627\u0633\u062a\u062e\u062f\u0645 \u0646\u0645\u0648\u0630\u062c \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0644\u0644\u0623\u0633\u0626\u0644\u0629 \u0623\u0648 \u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u062e\u0627\u0635\u0629.",
        description:
          "\u0627\u0643\u062a\u0628 \u0631\u0633\u0627\u0644\u062a\u0643 \u0648\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629\u060c \u0648\u0633\u064a\u0642\u0648\u0645 \u0627\u0644\u0635\u0627\u0644\u0648\u0646 \u0628\u0627\u0644\u0631\u062f \u0639\u0628\u0631 \u0627\u0644\u0628\u0631\u064a\u062f \u0623\u0648 \u0627\u0644\u0647\u0627\u062a\u0641.",
        nameLabel: "\u0627\u0644\u0627\u0633\u0645",
        emailLabel: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
        phoneLabel: "\u0627\u0644\u0647\u0627\u062a\u0641 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
        subjectLabel: "\u0627\u0644\u0645\u0648\u0636\u0648\u0639",
        messageLabel: "\u0627\u0644\u0631\u0633\u0627\u0644\u0629",
        submitLabel: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628",
        submittingLabel: "\u062c\u0627\u0631\u064a \u0627\u0644\u0625\u0631\u0633\u0627\u0644...",
        privacyNote:
          "\u0628\u0625\u0631\u0633\u0627\u0644 \u0647\u0630\u0627 \u0627\u0644\u0646\u0645\u0648\u0630\u062c \u0623\u0646\u062a \u062a\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0635\u0627\u0644\u0648\u0646 \u0645\u0639\u0643 \u0628\u062e\u0635\u0648\u0635 \u0637\u0644\u0628\u0643.",
        successMessage:
          "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u062a\u0643 \u0628\u0646\u062c\u0627\u062d. \u0633\u064a\u0631\u062f \u0627\u0644\u0635\u0627\u0644\u0648\u0646 \u0639\u0644\u064a\u0643 \u0641\u064a \u0623\u0642\u0631\u0628 \u0648\u0642\u062a.",
        errorMessage:
          "\u0631\u0627\u062c\u0639 \u0627\u0644\u0646\u0645\u0648\u0630\u062c \u0648\u0635\u062d\u062d \u0627\u0644\u062d\u0642\u0648\u0644 \u0627\u0644\u0645\u0638\u0644\u0644\u0629 \u0642\u0628\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644.",
        requiredMessage:
          "\u0623\u0643\u0645\u0644 \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0644 \u0627\u0644\u0625\u0644\u0632\u0627\u0645\u064a\u0629 \u0642\u0628\u0644 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u062a\u0643.",
        invalidEmailMessage:
          "\u0623\u062f\u062e\u0644 \u0628\u0631\u064a\u062f\u0627\u064b \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0627\u064b \u0635\u062d\u064a\u062d\u0627\u064b \u0644\u064a\u062a\u0645\u0643\u0646 \u0627\u0644\u0635\u0627\u0644\u0648\u0646 \u0645\u0646 \u0627\u0644\u0631\u062f."
      },
      map: {
        isVisible: true,
        eyebrow: "\u0627\u0644\u062e\u0631\u064a\u0637\u0629",
        title: "\u0627\u0639\u062b\u0631 \u0639\u0644\u0649 Crown & Blade \u0641\u064a \u0648\u0633\u0637 \u0628\u0631\u0644\u064a\u0646.",
        description:
          "\u062a\u0638\u0647\u0631 \u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u062f\u0627\u062e\u0644 \u0627\u0644\u0635\u0641\u062d\u0629 \u0644\u064a\u062a\u062d\u0642\u0642 \u0627\u0644\u0639\u0645\u064a\u0644 \u0645\u0646 \u0627\u0644\u0645\u0648\u0642\u0639 \u0642\u0628\u0644 \u0627\u0644\u0627\u0646\u0637\u0644\u0627\u0642.",
        directionsLabel: "\u0627\u0641\u062a\u062d \u0627\u0644\u0627\u062a\u062c\u0627\u0647\u0627\u062a",
        directionsHref:
          "https://www.google.com/maps/search/?api=1&query=Friedrichstrasse+148%2C+10117+Berlin",
        embedUrl:
          "https://www.google.com/maps?q=Friedrichstrasse+148,+10117+Berlin&z=15&output=embed",
        consentTitle: "\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0645\u0636\u0645\u0646\u0629",
        consentDescription:
          "\u062a\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u0645\u0648\u0641\u0631\u0627\u064b \u062e\u0627\u0631\u062c\u064a\u0627\u064b. \u062d\u0645\u0644\u0647\u0627 \u0641\u0642\u0637 \u0625\u0630\u0627 \u0643\u0646\u062a \u062a\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0645\u0634\u0627\u0631\u0643\u0629 \u0628\u0639\u0636 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0639 \u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0641\u0631 \u0641\u064a \u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062d\u0629.",
        consentButtonLabel: "\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u062e\u0631\u064a\u0637\u0629",
        privacyNotice:
          "\u064a\u0645\u0643\u0646\u0643 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0631\u0627\u0628\u0637 \u0627\u0644\u0627\u062a\u062c\u0627\u0647\u0627\u062a \u062f\u0648\u0646 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0645\u0636\u0645\u0646\u0629."
      },
      items: {
        phone: {
          label: "\u0627\u0644\u0647\u0627\u062a\u0641",
          value: "+49 30 1234 5678",
          href: "tel:+493012345678"
        },
        email: {
          label: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
          value: "hello@crownandblade.de",
          href: "mailto:hello@crownandblade.de"
        },
        address: {
          label: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
          value: "Friedrichstrasse 148, 10117 Berlin, Germany"
        },
        whatsapp: {
          label: "\u0648\u0627\u062a\u0633\u0627\u0628",
          value: "\u0627\u0628\u062f\u0623 \u0627\u0644\u062f\u0631\u062f\u0634\u0629 \u0645\u0639 \u0627\u0644\u0635\u0627\u0644\u0648\u0646",
          href: "https://wa.me/493012345678"
        }
      }
    }
  },
  legal: {
    en: {
      impressum: {
        eyebrow: "Legal notice",
        title: "Imprint",
        introduction:
          "This page provides the operator details required for a Germany-focused barbershop website.",
        ownerLabel: "Shop owner",
        ownerName: "Mahir Barber GmbH",
        responsibleLabel: "Responsible for content",
        responsibleName: "Mahir Almasi",
        sections: [
          {
            title: "Provider information",
            paragraphs: [
              "Mahir Barber GmbH",
              "Friedrichstrasse 148",
              "10117 Berlin",
              "Germany"
            ]
          },
          {
            title: "Contact",
            paragraphs: [
              "Email: hello@crownandblade.de",
              "Phone: +49 30 1234 5678"
            ]
          }
        ]
      },
      privacy: {
        eyebrow: "Privacy",
        title: "Privacy policy",
        introduction:
          "This summary explains which personal data is processed on this website and for which purposes.",
        sections: [
          {
            title: "Data collected on this website",
            paragraphs: [
              "When you use the booking or contact forms, the website processes your name, email address, phone number, selected service details, appointment data, and any message you provide.",
              "Server logs may also store technical information such as IP address, browser type, referrer, and access time to keep the service secure and stable."
            ]
          },
          {
            title: "Booking and communication",
            paragraphs: [
              "Booking data is used to create, confirm, and manage appointments.",
              "Email communication is used for booking confirmations, follow-up contact, and operational messages related to your request."
            ]
          },
          {
            title: "Hosting and service providers",
            paragraphs: [
              "The website can be hosted by a third-party hosting provider that processes technical access data on behalf of the shop.",
              "Embedded maps or external communication tools should only be loaded when this is compatible with the visitor's privacy choices."
            ]
          },
          {
            title: "Cookies and similar technologies",
            paragraphs: [
              "Essential cookies may be used for session security, language preferences, and core booking functionality.",
              "Functional or analytics cookies must remain disabled until the visitor has given valid consent."
            ]
          },
          {
            title: "Your rights under GDPR",
            paragraphs: [
              "You have the right to request access, rectification, erasure, restriction of processing, data portability, and to object to processing where applicable.",
              "You also have the right to lodge a complaint with a supervisory authority."
            ]
          },
          {
            title: "Privacy contact",
            paragraphs: [
              "For privacy-related questions, contact: hello@crownandblade.de"
            ]
          }
        ]
      }
    },
    de: {
      impressum: {
        eyebrow: "Rechtliche Angaben",
        title: "Impressum",
        introduction:
          "Diese Seite stellt die fuer eine auf Deutschland ausgerichtete Barbershop-Website erforderlichen Anbieterangaben bereit.",
        ownerLabel: "Inhaber",
        ownerName: "Mahir Barber GmbH",
        responsibleLabel: "Verantwortlich fuer den Inhalt",
        responsibleName: "Mahir Almasi",
        sections: [
          {
            title: "Anbieterangaben",
            paragraphs: [
              "Mahir Barber GmbH",
              "Friedrichstrasse 148",
              "10117 Berlin",
              "Deutschland"
            ]
          },
          {
            title: "Kontakt",
            paragraphs: [
              "E-Mail: hello@crownandblade.de",
              "Telefon: +49 30 1234 5678"
            ]
          }
        ]
      },
      privacy: {
        eyebrow: "Datenschutz",
        title: "Datenschutzerklaerung",
        introduction:
          "Diese Uebersicht erklaert, welche personenbezogenen Daten auf dieser Website verarbeitet werden und zu welchen Zwecken dies geschieht.",
        sections: [
          {
            title: "Erhobene Daten",
            paragraphs: [
              "Bei der Nutzung des Buchungs- oder Kontaktformulars verarbeitet die Website insbesondere Name, E-Mail-Adresse, Telefonnummer, ausgewaehlte Leistungsdaten, Termindaten und freiwillige Nachrichteninhalte.",
              "Zusaetzlich koennen Server-Logs technische Informationen wie IP-Adresse, Browsertyp, Referrer und Zeitpunkt des Zugriffs speichern, um Stabilitaet und Sicherheit zu gewaehrleisten."
            ]
          },
          {
            title: "Buchung und Kommunikation",
            paragraphs: [
              "Buchungsdaten werden verwendet, um Termine anzulegen, zu bestaetigen und zu verwalten.",
              "E-Mail-Kommunikation wird fuer Terminbestaetigungen, Rueckfragen und organisatorische Hinweise zu deiner Anfrage verwendet."
            ]
          },
          {
            title: "Hosting und Dienstleister",
            paragraphs: [
              "Die Website kann bei einem Hosting-Anbieter betrieben werden, der technische Zugriffsdaten im Auftrag des Shops verarbeitet.",
              "Eingebettete Karten oder externe Kommunikationstools duerfen nur geladen werden, wenn dies mit den Datenschutzentscheidungen der Besuchenden vereinbar ist."
            ]
          },
          {
            title: "Cookies und aehnliche Technologien",
            paragraphs: [
              "Essenzielle Cookies koennen fuer Sitzungssicherheit, Spracheinstellungen und grundlegende Buchungsfunktionen eingesetzt werden.",
              "Funktionale oder analytische Cookies muessen bis zu einer wirksamen Einwilligung deaktiviert bleiben."
            ]
          },
          {
            title: "Deine Rechte nach DSGVO",
            paragraphs: [
              "Du hast das Recht auf Auskunft, Berichtigung, Loeschung, Einschraenkung der Verarbeitung, Datenuebertragbarkeit sowie auf Widerspruch, soweit die gesetzlichen Voraussetzungen vorliegen.",
              "Ausserdem besteht ein Beschwerderecht bei einer zustaendigen Aufsichtsbehoerde."
            ]
          },
          {
            title: "Kontakt fuer Datenschutzanfragen",
            paragraphs: [
              "Bei Fragen zum Datenschutz: hello@crownandblade.de"
            ]
          }
        ]
      }
    },
    ar: {
      impressum: {
        eyebrow: "Legal notice",
        title: "Imprint",
        introduction:
          "This page provides the operator details required for a Germany-focused barbershop website.",
        ownerLabel: "Shop owner",
        ownerName: "Mahir Barber GmbH",
        responsibleLabel: "Responsible for content",
        responsibleName: "Mahir Almasi",
        sections: [
          {
            title: "Provider information",
            paragraphs: [
              "Mahir Barber GmbH",
              "Friedrichstrasse 148",
              "10117 Berlin",
              "Germany"
            ]
          },
          {
            title: "Contact",
            paragraphs: [
              "Email: hello@crownandblade.de",
              "Phone: +49 30 1234 5678"
            ]
          }
        ]
      },
      privacy: {
        eyebrow: "Privacy",
        title: "Privacy policy",
        introduction:
          "This summary explains which personal data is processed on this website and for which purposes.",
        sections: [
          {
            title: "Data collected on this website",
            paragraphs: [
              "When you use the booking or contact forms, the website processes your name, email address, phone number, selected service details, appointment data, and any message you provide.",
              "Server logs may also store technical information such as IP address, browser type, referrer, and access time to keep the service secure and stable."
            ]
          },
          {
            title: "Booking and communication",
            paragraphs: [
              "Booking data is used to create, confirm, and manage appointments.",
              "Email communication is used for booking confirmations, follow-up contact, and operational messages related to your request."
            ]
          },
          {
            title: "Hosting and service providers",
            paragraphs: [
              "The website can be hosted by a third-party hosting provider that processes technical access data on behalf of the shop.",
              "Embedded maps or external communication tools should only be loaded when this is compatible with the visitor's privacy choices."
            ]
          },
          {
            title: "Cookies and similar technologies",
            paragraphs: [
              "Essential cookies may be used for session security, language preferences, and core booking functionality.",
              "Functional or analytics cookies must remain disabled until the visitor has given valid consent."
            ]
          },
          {
            title: "Your rights under GDPR",
            paragraphs: [
              "You have the right to request access, rectification, erasure, restriction of processing, data portability, and to object to processing where applicable.",
              "You also have the right to lodge a complaint with a supervisory authority."
            ]
          },
          {
            title: "Privacy contact",
            paragraphs: [
              "For privacy-related questions, contact: hello@crownandblade.de"
            ]
          }
        ]
      }
    }
  },
  booking: {
    slotIntervalMinutes: 15,
    searchWindowDays: 10,
    maxDaysWithSlots: 4,
    employeeServices: [
      {
        employeeSlug: "marcus-reed",
        serviceSlug: "signature-cut",
        durationMinutes: 45,
        priceLabel: "from $34",
        isActive: true
      },
      {
        employeeSlug: "marcus-reed",
        serviceSlug: "beard-ritual",
        durationMinutes: 30,
        priceLabel: "from $24",
        isActive: true
      },
      {
        employeeSlug: "marcus-reed",
        serviceSlug: "full-grooming-session",
        durationMinutes: 60,
        priceLabel: "from $48",
        isActive: true
      },
      {
        employeeSlug: "samir-haddad",
        serviceSlug: "beard-ritual",
        durationMinutes: 45,
        priceLabel: "from $28",
        isActive: true
      },
      {
        employeeSlug: "samir-haddad",
        serviceSlug: "full-grooming-session",
        durationMinutes: 75,
        priceLabel: "from $56",
        isActive: true
      },
      {
        employeeSlug: "jonah-brooks",
        serviceSlug: "signature-cut",
        durationMinutes: 30,
        priceLabel: "from $30",
        isActive: true
      },
      {
        employeeSlug: "oliver-stone",
        serviceSlug: "signature-cut",
        durationMinutes: 45,
        priceLabel: "from $32",
        isActive: false
      }
    ],
    workingHours: [
      { employeeSlug: "marcus-reed", weekday: 1, start: "09:00", end: "17:00" },
      { employeeSlug: "marcus-reed", weekday: 2, start: "09:00", end: "18:00" },
      { employeeSlug: "marcus-reed", weekday: 3, start: "10:00", end: "19:00" },
      { employeeSlug: "marcus-reed", weekday: 4, start: "09:00", end: "18:00" },
      { employeeSlug: "marcus-reed", weekday: 5, start: "09:00", end: "18:00" },
      { employeeSlug: "marcus-reed", weekday: 6, start: "10:00", end: "15:00" },
      { employeeSlug: "marcus-reed", weekday: 0, start: "00:00", end: "00:00", isOff: true },
      { employeeSlug: "samir-haddad", weekday: 1, start: "11:00", end: "19:00" },
      { employeeSlug: "samir-haddad", weekday: 2, start: "12:00", end: "20:00" },
      { employeeSlug: "samir-haddad", weekday: 3, start: "12:00", end: "20:00" },
      { employeeSlug: "samir-haddad", weekday: 4, start: "11:00", end: "19:00" },
      { employeeSlug: "samir-haddad", weekday: 5, start: "10:00", end: "17:00" },
      { employeeSlug: "samir-haddad", weekday: 6, start: "00:00", end: "00:00", isOff: true },
      { employeeSlug: "samir-haddad", weekday: 0, start: "00:00", end: "00:00", isOff: true },
      { employeeSlug: "jonah-brooks", weekday: 1, start: "08:30", end: "16:30" },
      { employeeSlug: "jonah-brooks", weekday: 2, start: "08:30", end: "16:30" },
      { employeeSlug: "jonah-brooks", weekday: 3, start: "08:30", end: "16:30" },
      { employeeSlug: "jonah-brooks", weekday: 4, start: "09:30", end: "17:30" },
      { employeeSlug: "jonah-brooks", weekday: 5, start: "09:30", end: "14:30" },
      { employeeSlug: "jonah-brooks", weekday: 6, start: "00:00", end: "00:00", isOff: true },
      { employeeSlug: "jonah-brooks", weekday: 0, start: "00:00", end: "00:00", isOff: true }
    ],
    blockedTimes: [
      {
        employeeSlug: "marcus-reed",
        date: "2026-03-17",
        start: "13:00",
        end: "14:00",
        reason: "Team lunch"
      },
      {
        employeeSlug: "marcus-reed",
        date: "2026-03-18",
        start: "15:00",
        end: "16:00",
        reason: "Inventory delivery"
      },
      {
        employeeSlug: "samir-haddad",
        date: "2026-03-18",
        start: "16:00",
        end: "18:00",
        reason: "Private event prep"
      },
      {
        employeeSlug: "jonah-brooks",
        date: "2026-03-17",
        start: "11:30",
        end: "12:15",
        reason: "Training session"
      }
    ],
    existingBookings: [
      {
        employeeSlug: "marcus-reed",
        serviceSlug: "signature-cut",
        date: "2026-03-17",
        start: "09:00",
        end: "09:45"
      },
      {
        employeeSlug: "marcus-reed",
        serviceSlug: "beard-ritual",
        date: "2026-03-17",
        start: "10:15",
        end: "10:45"
      },
      {
        employeeSlug: "marcus-reed",
        serviceSlug: "full-grooming-session",
        date: "2026-03-18",
        start: "11:00",
        end: "12:00"
      },
      {
        employeeSlug: "samir-haddad",
        serviceSlug: "beard-ritual",
        date: "2026-03-17",
        start: "12:00",
        end: "12:45"
      },
      {
        employeeSlug: "samir-haddad",
        serviceSlug: "full-grooming-session",
        date: "2026-03-19",
        start: "13:00",
        end: "14:15"
      },
      {
        employeeSlug: "jonah-brooks",
        serviceSlug: "signature-cut",
        date: "2026-03-17",
        start: "09:30",
        end: "10:00"
      },
      {
        employeeSlug: "jonah-brooks",
        serviceSlug: "signature-cut",
        date: "2026-03-18",
        start: "14:00",
        end: "14:30"
      }
    ]
  },
  emailSettings: {
    providerName: "Console transport",
    fromEmail: "bookings@crownandblade.de",
    replyToEmail: "hello@crownandblade.de",
    sendCustomerConfirmation: true,
    sendInternalNotification: true,
    internalNotificationEmail: "hello@crownandblade.de"
  }
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeLocalizedArray(localized: unknown[], fallback: unknown[]) {
  if (localized.length === 0) {
    return fallback.map((item) => mergeLocalizedValue(undefined, item));
  }

  const localizedHasSlug = localized.every(
    (item) => isPlainObject(item) && typeof item.slug === "string"
  );
  const fallbackHasSlug = fallback.every(
    (item) => isPlainObject(item) && typeof item.slug === "string"
  );

  if (localizedHasSlug && fallbackHasSlug) {
    const localizedMap = new Map(
      localized.map((item) => [String((item as { slug: string }).slug), item])
    );
    const fallbackMap = new Map(
      fallback.map((item) => [String((item as { slug: string }).slug), item])
    );
    const orderedSlugs = [
      ...new Set([
        ...fallback.map((item) => String((item as { slug: string }).slug)),
        ...localized.map((item) => String((item as { slug: string }).slug))
      ])
    ];

    return orderedSlugs.map((slug) =>
      mergeLocalizedValue(localizedMap.get(slug), fallbackMap.get(slug))
    );
  }

  return localized.map((item, index) => mergeLocalizedValue(item, fallback[index]));
}

function mergeLocalizedValue(localized: unknown, fallback: unknown): any {
  if (localized === undefined || localized === null) {
    return fallback;
  }

  if (typeof localized === "string") {
    return localized.trim() ? localized : fallback;
  }

  if (Array.isArray(localized)) {
    return Array.isArray(fallback) ? mergeLocalizedArray(localized, fallback) : localized;
  }

  if (isPlainObject(localized) && isPlainObject(fallback)) {
    const result: Record<string, unknown> = {};

    for (const key of new Set([...Object.keys(fallback), ...Object.keys(localized)])) {
      result[key] = mergeLocalizedValue(localized[key], fallback[key]);
    }

    return result;
  }

  return localized;
}

function mergeWithDefaultLocale<T>(locale: Locale, value: T, fallback: T): T {
  return mergeLocalizedValue(value, fallback) as T;
}

export function getHomepageContent(locale: Locale) {
  return mergeWithDefaultLocale(locale, siteConfig.content[locale], siteConfig.content[siteConfig.defaultLocale]);
}

export function getServicesContent(locale: Locale) {
  return mergeWithDefaultLocale(
    locale,
    siteConfig.services[locale],
    siteConfig.services[siteConfig.defaultLocale]
  );
}

export function getTeamContent(locale: Locale) {
  return mergeWithDefaultLocale(locale, siteConfig.team[locale], siteConfig.team[siteConfig.defaultLocale]);
}

export function getGalleryContent(locale: Locale) {
  return mergeWithDefaultLocale(
    locale,
    siteConfig.gallery[locale],
    siteConfig.gallery[siteConfig.defaultLocale]
  );
}

export function getOffersContent(locale: Locale) {
  return mergeWithDefaultLocale(
    locale,
    siteConfig.offers[locale],
    siteConfig.offers[siteConfig.defaultLocale]
  );
}

export function getContactContent(locale: Locale) {
  return mergeWithDefaultLocale(
    locale,
    siteConfig.contact[locale],
    siteConfig.contact[siteConfig.defaultLocale]
  );
}

export function getLegalContent(locale: Locale) {
  return mergeWithDefaultLocale(locale, siteConfig.legal[locale], siteConfig.legal[siteConfig.defaultLocale]);
}

export function getServiceBySlug(locale: Locale, serviceSlug: string) {
  return getServicesContent(locale).services.find((service) => service.slug === serviceSlug);
}

export function getEmployeeBySlug(locale: Locale, employeeSlug: string) {
  return getTeamContent(locale).members.find((member) => member.slug === employeeSlug);
}
