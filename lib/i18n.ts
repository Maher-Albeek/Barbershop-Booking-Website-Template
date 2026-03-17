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
    },
    team: {
      eyebrow: "Meet the team",
      title: "Choose the barber that fits your style.",
      subtitle:
        "Active team members are shown here with their specialties and personality so customers can decide who to book with.",
      bioFallback: "Bio coming soon",
      bookingCta: "Book with this barber"
    },
    gallery: {
      imageLabel: "Gallery image"
    },
    offers: {
      validUntilLabel: "Valid until",
      bookingCta: "Book this offer"
    },
    contact: {
      directLabel: "Direct details",
      title: "Choose the fastest way to reach us.",
      visitLabel: "Before your visit",
      visitTitle: "Plan the call, message, or walk-in.",
      bookingCta: "Continue to booking"
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
    },
    team: {
      eyebrow: "Lerne das Team kennen",
      title: "Waehle den Barber, der zu deinem Stil passt.",
      subtitle:
        "Hier werden aktive Teammitglieder mit Spezialisierung und Persoenlichkeit gezeigt, damit Kundinnen und Kunden gezielt waehlen koennen.",
      bioFallback: "Bio folgt in Kuerze",
      bookingCta: "Bei diesem Barber buchen"
    },
    gallery: {
      imageLabel: "Galeriebild"
    },
    offers: {
      validUntilLabel: "Gueltig bis",
      bookingCta: "Dieses Angebot buchen"
    },
    contact: {
      directLabel: "Direkte Kontaktdaten",
      title: "Waehle den schnellsten Kontaktweg.",
      visitLabel: "Vor deinem Besuch",
      visitTitle: "Plane Anruf, Nachricht oder spontanen Besuch.",
      bookingCta: "Weiter zur Buchung"
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
    },
    team: {
      eyebrow: "\u062a\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0641\u0631\u064a\u0642",
      title: "\u0627\u062e\u062a\u0631 \u0627\u0644\u062d\u0644\u0627\u0642 \u0627\u0644\u0630\u064a \u064a\u0646\u0627\u0633\u0628 \u0623\u0633\u0644\u0648\u0628\u0643.",
      subtitle:
        "\u062a\u0639\u0631\u0636 \u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062d\u0629 \u0623\u0639\u0636\u0627\u0621 \u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0646\u0634\u0637\u064a\u0646 \u0645\u0639 \u062a\u062e\u0635\u0635\u0627\u062a\u0647\u0645 \u0648\u0646\u0628\u0630\u0629 \u0639\u0646\u0647\u0645 \u0644\u064a\u062a\u0645\u0643\u0646 \u0627\u0644\u0639\u0645\u064a\u0644 \u0645\u0646 \u0627\u0644\u0627\u062e\u062a\u064a\u0627\u0631.",
      bioFallback: "\u0627\u0644\u0633\u064a\u0631\u0629 \u0633\u062a\u062a\u0648\u0641\u0631 \u0642\u0631\u064a\u0628\u0627",
      bookingCta: "\u0627\u062d\u062c\u0632 \u0645\u0639 \u0647\u0630\u0627 \u0627\u0644\u062d\u0644\u0627\u0642"
    },
    gallery: {
      imageLabel: "\u0635\u0648\u0631\u0629 \u0645\u0646 \u0627\u0644\u0645\u0639\u0631\u0636"
    },
    offers: {
      validUntilLabel: "\u0635\u0627\u0644\u062d \u062d\u062a\u0649",
      bookingCta: "\u0627\u062d\u062c\u0632 \u0647\u0630\u0627 \u0627\u0644\u0639\u0631\u0636"
    },
    contact: {
      directLabel: "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0645\u0628\u0627\u0634\u0631",
      title: "\u0627\u062e\u062a\u0631 \u0623\u0633\u0631\u0639 \u0637\u0631\u064a\u0642\u0629 \u0644\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627.",
      visitLabel: "\u0642\u0628\u0644 \u0627\u0644\u0632\u064a\u0627\u0631\u0629",
      visitTitle: "\u062e\u0637\u0637 \u0644\u0644\u0627\u062a\u0635\u0627\u0644 \u0623\u0648 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0623\u0648 \u0627\u0644\u0632\u064a\u0627\u0631\u0629.",
      bookingCta: "\u0627\u0644\u0627\u0646\u062a\u0642\u0627\u0644 \u0625\u0644\u0649 \u0627\u0644\u062d\u062c\u0632"
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
    team: {
      eyebrow: string;
      title: string;
      subtitle: string;
      bioFallback: string;
      bookingCta: string;
    };
    gallery: {
      imageLabel: string;
    };
    offers: {
      validUntilLabel: string;
      bookingCta: string;
    };
    contact: {
      directLabel: string;
      title: string;
      visitLabel: string;
      visitTitle: string;
      bookingCta: string;
    };
  }
>;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
