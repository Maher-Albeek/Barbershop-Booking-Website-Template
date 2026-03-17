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
    },
    services: {
      durationLabel: "Duration",
      variablePriceLabel: "Price varies by barber",
      fixedPriceLabel: "Price",
      bookingCta: "Book this service"
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
    },
    services: {
      durationLabel: "Dauer",
      variablePriceLabel: "Preis variiert je Barber",
      fixedPriceLabel: "Preis",
      bookingCta: "Diese Leistung buchen"
    }
  },
  ar: {
    direction: "rtl",
    labels: {
      since: "\u0642\u0627\u0644\u0628 \u0635\u0627\u0644\u0648\u0646 \u0627\u0644\u062d\u0644\u0627\u0642\u0629",
      primaryNavigation: "\u0627\u0644\u062a\u0646\u0642\u0644 \u0627\u0644\u0631\u0626\u064a\u0633\u064a"
    },
    navigation: [
      { href: "/services", label: "\u0627\u0644\u062e\u062f\u0645\u0627\u062a" },
      { href: "/team", label: "\u0627\u0644\u0641\u0631\u064a\u0642" },
      { href: "/gallery", label: "\u0627\u0644\u0645\u0639\u0631\u0636" },
      { href: "/offers", label: "\u0627\u0644\u0639\u0631\u0648\u0636" },
      { href: "/contact", label: "\u0627\u0644\u062a\u0648\u0627\u0635\u0644" },
      { href: "/booking", label: "\u0627\u0644\u062d\u062c\u0632" }
    ],
    actions: {
      bookNow: "\u0627\u062d\u062c\u0632 \u0627\u0644\u0622\u0646",
      viewServices: "\u0627\u0633\u062a\u0639\u0631\u0636 \u0627\u0644\u062e\u062f\u0645\u0627\u062a"
    },
    services: {
      durationLabel: "\u0627\u0644\u0645\u062f\u0629",
      variablePriceLabel: "\u0627\u0644\u0633\u0639\u0631 \u064a\u062e\u062a\u0644\u0641 \u062d\u0633\u0628 \u0627\u0644\u062d\u0644\u0627\u0642",
      fixedPriceLabel: "\u0627\u0644\u0633\u0639\u0631",
      bookingCta: "\u0627\u062d\u062c\u0632 \u0647\u0630\u0647 \u0627\u0644\u062e\u062f\u0645\u0629"
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
    services: {
      durationLabel: string;
      variablePriceLabel: string;
      fixedPriceLabel: string;
      bookingCta: string;
    };
  }
>;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
