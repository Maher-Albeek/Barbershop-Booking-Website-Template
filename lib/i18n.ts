export const locales = ["en", "de", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

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
    booking: {
      eyebrow: "Public booking",
      title: "Start your appointment without signing in.",
      subtitle:
        "Choose a service first, then continue with your preferred barber, time, and contact details.",
      serviceStepLabel: "Step 1",
      serviceStepTitle: "Select a service",
      serviceStepDescription:
        "Only active services are available here so the booking flow starts with a valid appointment type.",
      selectServiceLabel: "Choose your service",
      serviceHint: "The rest of the booking form unlocks after service selection.",
      noSelectionTitle: "Select a service to continue",
      noSelectionDescription:
        "Customers can start the booking flow immediately, but the first required choice is the service.",
      detailsTitle: "Next in the flow",
      detailsDescription:
        "After service selection, the booking flow can continue with employee choice, available time slots, and customer details.",
      employeeStep: "Employee selection",
      timeStep: "Available time slots",
      customerStep: "Customer details",
      privacyNote: "No customer login is required to start a booking."
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
    booking: {
      eyebrow: "Oeffentliche Buchung",
      title: "Starte deinen Termin ohne Anmeldung.",
      subtitle:
        "Waehle zuerst eine Leistung und fahre dann mit Barber, Uhrzeit und Kontaktdaten fort.",
      serviceStepLabel: "Schritt 1",
      serviceStepTitle: "Leistung auswaehlen",
      serviceStepDescription:
        "Hier stehen nur aktive Leistungen zur Auswahl, damit der Buchungsablauf mit einem gueltigen Termin startet.",
      selectServiceLabel: "Leistung waehlen",
      serviceHint: "Der restliche Buchungsablauf wird nach der Leistungswahl fortgesetzt.",
      noSelectionTitle: "Waehle eine Leistung, um fortzufahren",
      noSelectionDescription:
        "Kundinnen und Kunden koennen die Buchung direkt starten, aber die erste Pflichtauswahl ist die Leistung.",
      detailsTitle: "Als Naechstes im Ablauf",
      detailsDescription:
        "Nach der Leistungswahl kann der Flow mit Barber-Auswahl, freien Zeiten und Kundendaten weitergehen.",
      employeeStep: "Barber auswaehlen",
      timeStep: "Freie Zeiten",
      customerStep: "Kundendaten",
      privacyNote: "Zum Start der Buchung ist kein Login erforderlich."
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
    booking: {
      eyebrow: "\u0627\u0644\u062d\u062c\u0632 \u0627\u0644\u0639\u0627\u0645",
      title: "\u0627\u0628\u062f\u0623 \u0645\u0648\u0639\u062f\u0643 \u062f\u0648\u0646 \u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644.",
      subtitle:
        "\u0627\u062e\u062a\u0631 \u0627\u0644\u062e\u062f\u0645\u0629 \u0623\u0648\u0644\u0627\u064b\u060c \u062b\u0645 \u0623\u0643\u0645\u0644 \u0645\u0639 \u0627\u0644\u062d\u0644\u0627\u0642 \u0648\u0627\u0644\u0648\u0642\u062a \u0648\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644.",
      serviceStepLabel: "\u0627\u0644\u062e\u0637\u0648\u0629 1",
      serviceStepTitle: "\u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u062e\u062f\u0645\u0629",
      serviceStepDescription:
        "\u062a\u0638\u0647\u0631 \u0647\u0646\u0627 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629 \u0641\u0642\u0637 \u0644\u064a\u0628\u062f\u0623 \u0645\u0633\u0627\u0631 \u0627\u0644\u062d\u062c\u0632 \u0628\u062e\u062f\u0645\u0629 \u0635\u0627\u0644\u062d\u0629.",
      selectServiceLabel: "\u0627\u062e\u062a\u0631 \u0627\u0644\u062e\u062f\u0645\u0629",
      serviceHint: "\u064a\u062a\u0627\u062d \u0628\u0627\u0642\u064a \u0627\u0644\u0646\u0645\u0648\u0630\u062c \u0628\u0639\u062f \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u062e\u062f\u0645\u0629.",
      noSelectionTitle: "\u0627\u062e\u062a\u0631 \u062e\u062f\u0645\u0629 \u0644\u0644\u0645\u062a\u0627\u0628\u0639\u0629",
      noSelectionDescription:
        "\u064a\u0645\u0643\u0646 \u0644\u0644\u0639\u0645\u064a\u0644 \u0628\u062f\u0621 \u0627\u0644\u062d\u062c\u0632 \u0641\u0648\u0631\u0627\u064b\u060c \u0644\u0643\u0646 \u0623\u0648\u0644 \u062e\u064a\u0627\u0631 \u0625\u0644\u0632\u0627\u0645\u064a \u0647\u0648 \u0627\u0644\u062e\u062f\u0645\u0629.",
      detailsTitle: "\u0627\u0644\u062e\u0637\u0648\u0627\u062a \u0627\u0644\u062a\u0627\u0644\u064a\u0629",
      detailsDescription:
        "\u0628\u0639\u062f \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u062e\u062f\u0645\u0629 \u064a\u0645\u0643\u0646 \u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u062d\u062c\u0632 \u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0645\u0639 \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u062d\u0644\u0627\u0642 \u0648\u0627\u0644\u0623\u0648\u0642\u0627\u062a \u0627\u0644\u0645\u062a\u0627\u062d\u0629 \u0648\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0639\u0645\u064a\u0644.",
      employeeStep: "\u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u062d\u0644\u0627\u0642",
      timeStep: "\u0627\u0644\u0623\u0648\u0642\u0627\u062a \u0627\u0644\u0645\u062a\u0627\u062d\u0629",
      customerStep: "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0639\u0645\u064a\u0644",
      privacyNote: "\u0644\u0627 \u064a\u0644\u0632\u0645 \u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644 \u0644\u0628\u062f\u0621 \u0627\u0644\u062d\u062c\u0632."
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
    booking: {
      eyebrow: string;
      title: string;
      subtitle: string;
      serviceStepLabel: string;
      serviceStepTitle: string;
      serviceStepDescription: string;
      selectServiceLabel: string;
      serviceHint: string;
      noSelectionTitle: string;
      noSelectionDescription: string;
      detailsTitle: string;
      detailsDescription: string;
      employeeStep: string;
      timeStep: string;
      customerStep: string;
      privacyNote: string;
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
