export const locales = ["en", "de", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const dictionaries = {
  en: {
    direction: "ltr",
    labels: {
      since: "Barbershop Template",
      primaryNavigation: "Primary navigation"
    },
    navigation: [
      { href: "/services", label: "Services" },
      { href: "/team", label: "Team" },
      { href: "/gallery", label: "Gallery" },
      { href: "/offers", label: "Offers" },
      { href: "/contact", label: "Contact" },
      { href: "/booking", label: "Booking" }
    ],
    actions: {
      bookNow: "Book now",
      viewServices: "Explore services"
    }
  },
  de: {
    direction: "ltr",
    labels: {
      since: "Barbershop Vorlage",
      primaryNavigation: "Hauptnavigation"
    },
    navigation: [
      { href: "/services", label: "Leistungen" },
      { href: "/team", label: "Team" },
      { href: "/gallery", label: "Galerie" },
      { href: "/offers", label: "Angebote" },
      { href: "/contact", label: "Kontakt" },
      { href: "/booking", label: "Buchung" }
    ],
    actions: {
      bookNow: "Jetzt buchen",
      viewServices: "Leistungen ansehen"
    }
  },
  ar: {
    direction: "rtl",
    labels: {
      since: "قالب صالون الحلاقة",
      primaryNavigation: "التنقل الرئيسي"
    },
    navigation: [
      { href: "/services", label: "الخدمات" },
      { href: "/team", label: "الفريق" },
      { href: "/gallery", label: "المعرض" },
      { href: "/offers", label: "العروض" },
      { href: "/contact", label: "التواصل" },
      { href: "/booking", label: "الحجز" }
    ],
    actions: {
      bookNow: "احجز الآن",
      viewServices: "استعرض الخدمات"
    }
  }
} as const satisfies Record<
  Locale,
  {
    direction: "ltr" | "rtl";
    labels: {
      since: string;
      primaryNavigation: string;
    };
    navigation: Array<{ href: string; label: string }>;
    actions: {
      bookNow: string;
      viewServices: string;
    };
  }
>;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
