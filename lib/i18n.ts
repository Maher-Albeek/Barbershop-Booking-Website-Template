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
      employeeStepLabel: "Step 2",
      employeeStepTitle: "Choose your employee",
      employeeStepDescription:
        "Pick a specific barber or let the system assign the first available team member for this service.",
      employeeAnyOption: "Any available employee",
      employeeAnyDescription:
        "We will match you with the earliest available barber for the selected service.",
      employeeSpecificLabel: "Specific employees for this service",
      employeeSpecialtiesLabel: "Best for",
      employeeUnavailableTitle: "No employee is available for this service yet",
      employeeUnavailableDescription:
        "This service stays selected, but booking can only continue after an eligible team member is assigned.",
      selectedEmployeeLabel: "Employee preference",
      timeStepLabel: "Step 3",
      timeStepTitle: "View available time slots",
      timeStepDescription:
        "Slots are generated from working hours, blocked periods, existing bookings, and the selected employee-service duration.",
      timeStepAnyDescription:
        "When you leave employee selection open, the booking flow shows the earliest valid slots and the assigned barber for each one.",
      durationForEmployeeLabel: "Duration for this employee",
      slotAssignedLabel: "Assigned barber",
      slotEmptyTitle: "No valid time slots found yet",
      slotEmptyDescription:
        "Try another employee or check a different day after schedules or blocked times change.",
      slotWindowLabel: "Booking window",
      slotTimezoneNote: "Slots are shown in local shop time.",
      timeStep: "Available time slots",
      customerStep: "Customer details",
      customerStepLabel: "Step 4",
      customerStepTitle: "Enter your booking details",
      customerStepDescription:
        "Add your name, email, and optional notes to create a confirmed appointment.",
      selectedSlotTitle: "Selected appointment",
      selectedDateLabel: "Date",
      selectedTimeLabel: "Time",
      selectedPriceLabel: "Price snapshot",
      selectedStatusLabel: "Booking status",
      confirmedStatus: "Confirmed",
      noSlotTitle: "Choose a time slot first",
      noSlotDescription:
        "Select one of the available appointments above before entering your contact details.",
      nameLabel: "Full name",
      emailLabel: "Email address",
      notesLabel: "Notes",
      notesHint: "Optional notes for the shop",
      submitLabel: "Confirm booking",
      referenceLabel: "Booking reference",
      successEyebrow: "Booking confirmed",
      successTitle: "Your appointment is confirmed.",
      successDescription:
        "The appointment was created with confirmed status and the booking details are shown below.",
      successMissingTitle: "Booking not found",
      successMissingDescription:
        "The success page could not load that booking reference. Start a new booking from the booking page.",
      backToBookingLabel: "Book another appointment",
      backToHomeLabel: "Back to homepage",
      contactTitle: "Shop contact details",
      errorMissingFields: "Enter your name and a valid time slot.",
      errorInvalidEmail: "Enter a valid email address or leave the field empty.",
      errorInvalidSelection: "The selected service or employee is no longer available.",
      errorSlotUnavailable:
        "That time slot is no longer available. Choose another appointment and try again.",
      privacyNote: "No customer login is required to start a booking."
    },
    contact: {
      directLabel: "Direct details",
      title: "Choose the fastest way to reach us.",
      visitLabel: "Before your visit",
      visitTitle: "Plan the call, message, or walk-in.",
      bookingCta: "Continue to booking"
    },
    footer: {
      legalLabel: "Legal",
      impressum: "Imprint",
      datenschutz: "Privacy policy"
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
      employeeStepLabel: "Schritt 2",
      employeeStepTitle: "Mitarbeiter waehlen",
      employeeStepDescription:
        "Waehle einen bestimmten Barber oder lass automatisch das zuerst verfuegbare Teammitglied fuer diese Leistung zuweisen.",
      employeeAnyOption: "Beliebiger verfuegbarer Barber",
      employeeAnyDescription:
        "Wir ordnen dir den fruehest verfuegbaren Barber fuer die ausgewaehlte Leistung zu.",
      employeeSpecificLabel: "Verfuegbare Barber fuer diese Leistung",
      employeeSpecialtiesLabel: "Staerken",
      employeeUnavailableTitle: "Fuer diese Leistung ist noch kein Mitarbeiter verfuegbar",
      employeeUnavailableDescription:
        "Die Leistung bleibt ausgewaehlt, aber die Buchung kann erst weitergehen, wenn ein passendes Teammitglied zugewiesen ist.",
      selectedEmployeeLabel: "Barber-Praeferenz",
      timeStepLabel: "Schritt 3",
      timeStepTitle: "Freie Zeitfenster ansehen",
      timeStepDescription:
        "Die Zeitfenster werden aus Arbeitszeiten, Sperrzeiten, bestehenden Buchungen und der gewaelten Dauer je Mitarbeiter und Leistung berechnet.",
      timeStepAnyDescription:
        "Wenn kein bestimmter Barber gewaehlt ist, zeigt der Ablauf die fruehesten gueltigen Zeiten inklusive zugewiesenem Barber.",
      durationForEmployeeLabel: "Dauer fuer diesen Barber",
      slotAssignedLabel: "Zugewiesener Barber",
      slotEmptyTitle: "Noch keine gueltigen Zeitfenster verfuegbar",
      slotEmptyDescription:
        "Versuche einen anderen Barber oder pruefe spaeter erneut, wenn sich Plan oder Sperrzeiten aendern.",
      slotWindowLabel: "Buchungsfenster",
      slotTimezoneNote: "Alle Zeiten werden in der lokalen Shop-Zeit angezeigt.",
      timeStep: "Freie Zeiten",
      customerStep: "Kundendaten",
      customerStepLabel: "Schritt 4",
      customerStepTitle: "Buchungsdaten eingeben",
      customerStepDescription:
        "Trage Name, E-Mail und optionale Hinweise ein, um den Termin direkt zu bestaetigen.",
      selectedSlotTitle: "Ausgewaehlter Termin",
      selectedDateLabel: "Datum",
      selectedTimeLabel: "Uhrzeit",
      selectedPriceLabel: "Preis-Snapshot",
      selectedStatusLabel: "Buchungsstatus",
      confirmedStatus: "Bestaetigt",
      noSlotTitle: "Waehle zuerst ein Zeitfenster",
      noSlotDescription:
        "Waehle oben einen verfuegbaren Termin aus, bevor du deine Kontaktdaten eingibst.",
      nameLabel: "Vollstaendiger Name",
      emailLabel: "E-Mail-Adresse",
      notesLabel: "Hinweise",
      notesHint: "Optionale Hinweise fuer den Shop",
      submitLabel: "Buchung bestaetigen",
      referenceLabel: "Buchungsreferenz",
      successEyebrow: "Buchung bestaetigt",
      successTitle: "Dein Termin ist bestaetigt.",
      successDescription:
        "Der Termin wurde sofort mit dem Status bestaetigt erstellt. Die Details stehen unten.",
      successMissingTitle: "Buchung nicht gefunden",
      successMissingDescription:
        "Zu dieser Referenz konnten keine Buchungsdaten geladen werden. Starte die Buchung erneut auf der Buchungsseite.",
      backToBookingLabel: "Weiteren Termin buchen",
      backToHomeLabel: "Zur Startseite",
      contactTitle: "Kontakt des Shops",
      errorMissingFields: "Gib Namen und ein gueltiges Zeitfenster an.",
      errorInvalidEmail: "Gib eine gueltige E-Mail-Adresse ein oder lasse das Feld leer.",
      errorInvalidSelection:
        "Die ausgewaehlte Leistung oder der ausgewaehlte Barber ist nicht mehr verfuegbar.",
      errorSlotUnavailable:
        "Dieses Zeitfenster ist nicht mehr verfuegbar. Waehle einen anderen Termin und versuche es erneut.",
      privacyNote: "Zum Start der Buchung ist kein Login erforderlich."
    },
    contact: {
      directLabel: "Direkte Kontaktdaten",
      title: "Waehle den schnellsten Kontaktweg.",
      visitLabel: "Vor deinem Besuch",
      visitTitle: "Plane Anruf, Nachricht oder spontanen Besuch.",
      bookingCta: "Weiter zur Buchung"
    },
    footer: {
      legalLabel: "Rechtliches",
      impressum: "Impressum",
      datenschutz: "Datenschutz"
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
      employeeStepLabel: "\u0627\u0644\u062e\u0637\u0648\u0629 2",
      employeeStepTitle: "\u0627\u062e\u062a\u0631 \u0627\u0644\u062d\u0644\u0627\u0642",
      employeeStepDescription:
        "\u0627\u062e\u062a\u0631 \u062d\u0644\u0627\u0642\u0627\u064b \u0645\u0639\u064a\u0646\u0627\u064b \u0623\u0648 \u062f\u0639 \u0627\u0644\u0646\u0638\u0627\u0645 \u064a\u0633\u0646\u062f \u0623\u0648\u0644 \u0639\u0636\u0648 \u0641\u0631\u064a\u0642 \u0645\u062a\u0627\u062d \u0644\u0647\u0630\u0647 \u0627\u0644\u062e\u062f\u0645\u0629.",
      employeeAnyOption: "\u0623\u064a \u062d\u0644\u0627\u0642 \u0645\u062a\u0627\u062d",
      employeeAnyDescription:
        "\u0633\u0646\u0648\u0641\u0631 \u0644\u0643 \u0623\u0628\u0643\u0631 \u062d\u0644\u0627\u0642 \u0645\u062a\u0627\u062d \u0644\u0644\u062e\u062f\u0645\u0629 \u0627\u0644\u0645\u062d\u062f\u062f\u0629.",
      employeeSpecificLabel: "\u0627\u0644\u062d\u0644\u0627\u0642\u0648\u0646 \u0627\u0644\u0645\u062a\u0627\u062d\u0648\u0646 \u0644\u0647\u0630\u0647 \u0627\u0644\u062e\u062f\u0645\u0629",
      employeeSpecialtiesLabel: "\u0627\u0644\u062a\u062e\u0635\u0635\u0627\u062a",
      employeeUnavailableTitle: "\u0644\u0627 \u064a\u0648\u062c\u062f \u062d\u0644\u0627\u0642 \u0645\u062a\u0627\u062d \u0644\u0647\u0630\u0647 \u0627\u0644\u062e\u062f\u0645\u0629 \u062d\u0627\u0644\u064a\u0627\u064b",
      employeeUnavailableDescription:
        "\u062a\u0638\u0644 \u0627\u0644\u062e\u062f\u0645\u0629 \u0645\u062d\u062f\u062f\u0629\u060c \u0644\u0643\u0646 \u0644\u0627 \u064a\u0645\u0643\u0646 \u0625\u0643\u0645\u0627\u0644 \u0627\u0644\u062d\u062c\u0632 \u062d\u062a\u0649 \u064a\u062a\u0645 \u062a\u0639\u064a\u064a\u0646 \u0639\u0636\u0648 \u0641\u0631\u064a\u0642 \u0645\u0646\u0627\u0633\u0628.",
      selectedEmployeeLabel: "\u062a\u0641\u0636\u064a\u0644 \u0627\u0644\u062d\u0644\u0627\u0642",
      timeStepLabel: "\u0627\u0644\u062e\u0637\u0648\u0629 3",
      timeStepTitle: "\u0639\u0631\u0636 \u0627\u0644\u0627\u0648\u0642\u0627\u062a \u0627\u0644\u0645\u062a\u0627\u062d\u0629",
      timeStepDescription:
        "\u064a\u062a\u0645 \u062d\u0633\u0627\u0628 \u0627\u0644\u0627\u0648\u0642\u0627\u062a \u0645\u0646 \u0633\u0627\u0639\u0627\u062a \u0627\u0644\u0639\u0645\u0644 \u0648\u0641\u062a\u0631\u0627\u062a \u0627\u0644\u062d\u0638\u0631 \u0648\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0648\u0645\u062f\u0629 \u0627\u0644\u062e\u062f\u0645\u0629 \u0644\u062f\u0649 \u0627\u0644\u062d\u0644\u0627\u0642 \u0627\u0644\u0645\u062d\u062f\u062f.",
      timeStepAnyDescription:
        "\u0639\u0646\u062f \u062a\u0631\u0643 \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u062d\u0644\u0627\u0642 \u0645\u0641\u062a\u0648\u062d\u0627\u060c \u064a\u0639\u0631\u0636 \u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0628\u0643\u0631 \u0627\u0644\u0627\u0648\u0642\u0627\u062a \u0627\u0644\u0635\u0627\u0644\u062d\u0629 \u0645\u0639 \u0627\u0633\u0645 \u0627\u0644\u062d\u0644\u0627\u0642 \u0627\u0644\u0645\u0643\u0644\u0641 \u0628\u0647\u0627.",
      durationForEmployeeLabel: "\u0645\u062f\u0629 \u0647\u0630\u0627 \u0627\u0644\u062d\u0644\u0627\u0642",
      slotAssignedLabel: "\u0627\u0644\u062d\u0644\u0627\u0642 \u0627\u0644\u0645\u062e\u0635\u0635",
      slotEmptyTitle: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0627\u0648\u0642\u0627\u062a \u0635\u0627\u0644\u062d\u0629 \u062d\u0627\u0644\u064a\u0627\u064b",
      slotEmptyDescription:
        "\u062c\u0631\u0628 \u062d\u0644\u0627\u0642\u0627\u064b \u0627\u062e\u0631 \u0627\u0648 \u062a\u062d\u0642\u0642 \u0645\u0631\u0629 \u0627\u062e\u0631\u0649 \u0628\u0639\u062f \u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u062c\u062f\u0627\u0648\u0644 \u0627\u0648 \u0641\u062a\u0631\u0627\u062a \u0627\u0644\u062d\u0638\u0631.",
      slotWindowLabel: "\u0646\u0627\u0641\u0630\u0629 \u0627\u0644\u062d\u062c\u0632",
      slotTimezoneNote: "\u062a\u0639\u0631\u0636 \u062c\u0645\u064a\u0639 \u0627\u0644\u0627\u0648\u0642\u0627\u062a \u0628\u062a\u0648\u0642\u064a\u062a \u0627\u0644\u0635\u0627\u0644\u0648\u0646 \u0627\u0644\u0645\u062d\u0644\u064a.",
      timeStep: "\u0627\u0644\u0623\u0648\u0642\u0627\u062a \u0627\u0644\u0645\u062a\u0627\u062d\u0629",
      customerStep: "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0639\u0645\u064a\u0644",
      customerStepLabel: "\u0627\u0644\u062e\u0637\u0648\u0629 4",
      customerStepTitle: "\u0623\u062f\u062e\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062d\u062c\u0632",
      customerStepDescription:
        "\u0623\u0636\u0641 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0648\u0627\u0644\u0645\u0644\u0627\u062d\u0638\u0627\u062a \u0627\u0644\u0627\u062e\u062a\u064a\u0627\u0631\u064a\u0629 \u0644\u0625\u0646\u0634\u0627\u0621 \u0645\u0648\u0639\u062f \u0645\u0624\u0643\u062f.",
      selectedSlotTitle: "\u0627\u0644\u0645\u0648\u0639\u062f \u0627\u0644\u0645\u062d\u062f\u062f",
      selectedDateLabel: "\u0627\u0644\u062a\u0627\u0631\u064a\u062e",
      selectedTimeLabel: "\u0627\u0644\u0648\u0642\u062a",
      selectedPriceLabel: "\u0644\u0642\u0637\u0629 \u0627\u0644\u0633\u0639\u0631",
      selectedStatusLabel: "\u062d\u0627\u0644\u0629 \u0627\u0644\u062d\u062c\u0632",
      confirmedStatus: "\u0645\u0624\u0643\u062f",
      noSlotTitle: "\u0627\u062e\u062a\u0631 \u0648\u0642\u062a\u0627\u064b \u0623\u0648\u0644\u0627\u064b",
      noSlotDescription:
        "\u0627\u062e\u062a\u0631 \u0623\u062d\u062f \u0627\u0644\u0645\u0648\u0627\u0639\u064a\u062f \u0627\u0644\u0645\u062a\u0627\u062d\u0629 \u0623\u0639\u0644\u0627\u0647 \u0642\u0628\u0644 \u0625\u062f\u062e\u0627\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644.",
      nameLabel: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
      emailLabel: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      notesLabel: "\u0645\u0644\u0627\u062d\u0638\u0627\u062a",
      notesHint: "\u0645\u0644\u0627\u062d\u0638\u0627\u062a \u0627\u062e\u062a\u064a\u0627\u0631\u064a\u0629 \u0644\u0644\u0635\u0627\u0644\u0648\u0646",
      submitLabel: "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u062d\u062c\u0632",
      referenceLabel: "\u0631\u0642\u0645 \u0645\u0631\u062c\u0639 \u0627\u0644\u062d\u062c\u0632",
      successEyebrow: "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u062d\u062c\u0632",
      successTitle: "\u062a\u0645 \u062a\u0623\u0643\u064a\u062f \u0645\u0648\u0639\u062f\u0643.",
      successDescription:
        "\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u0648\u0639\u062f \u0641\u0648\u0631\u0627\u064b \u0628\u062d\u0627\u0644\u0629 \u0645\u0624\u0643\u062f\u0629 \u0648\u062a\u0638\u0647\u0631 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u0623\u062f\u0646\u0627\u0647.",
      successMissingTitle: "\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u062d\u062c\u0632",
      successMissingDescription:
        "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0647\u0630\u0647 \u0627\u0644\u0645\u0631\u062c\u0639\u064a\u0629. \u0627\u0628\u062f\u0623 \u062d\u062c\u0632\u0627\u064b \u062c\u062f\u064a\u062f\u0627\u064b \u0645\u0646 \u0635\u0641\u062d\u0629 \u0627\u0644\u062d\u062c\u0632.",
      backToBookingLabel: "\u0627\u062d\u062c\u0632 \u0645\u0648\u0639\u062f\u0627\u064b \u0622\u062e\u0631",
      backToHomeLabel: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
      contactTitle: "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u062a\u0635\u0627\u0644 \u0627\u0644\u0635\u0627\u0644\u0648\u0646",
      errorMissingFields:
        "\u0623\u062f\u062e\u0644 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u062e\u062a\u0631 \u0648\u0642\u062a\u0627\u064b \u0635\u0627\u0644\u062d\u0627\u064b.",
      errorInvalidEmail:
        "\u0623\u062f\u062e\u0644 \u0628\u0631\u064a\u062f\u0627\u064b \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0627\u064b \u0635\u062d\u064a\u062d\u0627\u064b \u0623\u0648 \u0627\u062a\u0631\u0643 \u0627\u0644\u062d\u0642\u0644 \u0641\u0627\u0631\u063a\u0627\u064b.",
      errorInvalidSelection:
        "\u0644\u0645 \u062a\u0639\u062f \u0627\u0644\u062e\u062f\u0645\u0629 \u0623\u0648 \u0627\u0644\u062d\u0644\u0627\u0642 \u0627\u0644\u0645\u062d\u062f\u062f \u0645\u062a\u0627\u062d\u064a\u0646.",
      errorSlotUnavailable:
        "\u0647\u0630\u0627 \u0627\u0644\u0648\u0642\u062a \u0644\u0645 \u064a\u0639\u062f \u0645\u062a\u0627\u062d\u0627\u064b. \u0627\u062e\u062a\u0631 \u0645\u0648\u0639\u062f\u0627\u064b \u0622\u062e\u0631 \u0648\u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.",
      privacyNote: "\u0644\u0627 \u064a\u0644\u0632\u0645 \u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644 \u0644\u0628\u062f\u0621 \u0627\u0644\u062d\u062c\u0632."
    },
    contact: {
      directLabel: "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0645\u0628\u0627\u0634\u0631",
      title: "\u0627\u062e\u062a\u0631 \u0623\u0633\u0631\u0639 \u0637\u0631\u064a\u0642\u0629 \u0644\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627.",
      visitLabel: "\u0642\u0628\u0644 \u0627\u0644\u0632\u064a\u0627\u0631\u0629",
      visitTitle: "\u062e\u0637\u0637 \u0644\u0644\u0627\u062a\u0635\u0627\u0644 \u0623\u0648 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0623\u0648 \u0627\u0644\u0632\u064a\u0627\u0631\u0629.",
      bookingCta: "\u0627\u0644\u0627\u0646\u062a\u0642\u0627\u0644 \u0625\u0644\u0649 \u0627\u0644\u062d\u062c\u0632"
    },
    footer: {
      legalLabel: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0642\u0627\u0646\u0648\u0646\u064a\u0629",
      impressum: "\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629",
      datenschutz: "\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629"
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
      employeeStepLabel: string;
      employeeStepTitle: string;
      employeeStepDescription: string;
      employeeAnyOption: string;
      employeeAnyDescription: string;
      employeeSpecificLabel: string;
      employeeSpecialtiesLabel: string;
      employeeUnavailableTitle: string;
      employeeUnavailableDescription: string;
      selectedEmployeeLabel: string;
      timeStepLabel: string;
      timeStepTitle: string;
      timeStepDescription: string;
      timeStepAnyDescription: string;
      durationForEmployeeLabel: string;
      slotAssignedLabel: string;
      slotEmptyTitle: string;
      slotEmptyDescription: string;
      slotWindowLabel: string;
      slotTimezoneNote: string;
      timeStep: string;
      customerStep: string;
      customerStepLabel: string;
      customerStepTitle: string;
      customerStepDescription: string;
      selectedSlotTitle: string;
      selectedDateLabel: string;
      selectedTimeLabel: string;
      selectedPriceLabel: string;
      selectedStatusLabel: string;
      confirmedStatus: string;
      noSlotTitle: string;
      noSlotDescription: string;
      nameLabel: string;
      emailLabel: string;
      notesLabel: string;
      notesHint: string;
      submitLabel: string;
      referenceLabel: string;
      successEyebrow: string;
      successTitle: string;
      successDescription: string;
      successMissingTitle: string;
      successMissingDescription: string;
      backToBookingLabel: string;
      backToHomeLabel: string;
      contactTitle: string;
      errorMissingFields: string;
      errorInvalidEmail: string;
      errorInvalidSelection: string;
      errorSlotUnavailable: string;
      privacyNote: string;
    };
    contact: {
      directLabel: string;
      title: string;
      visitLabel: string;
      visitTitle: string;
      bookingCta: string;
    };
    footer: {
      legalLabel: string;
      impressum: string;
      datenschutz: string;
    };
  }
>;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
