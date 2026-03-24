import { authUsers } from "@/lib/auth-users";
import type { CSSProperties } from "react";
import {
  listBookings,
  parseTimeToMinutes,
  updateBookingStatus,
  type BookingStatus
} from "@/lib/booking";
import { locales, type Locale } from "@/lib/i18n";
import { siteConfig, getContactContent, getHomepageContent } from "@/lib/site-config";
import { savePersistedTeamMembers } from "@/lib/team-config-storage";
import { prisma } from "@/lib/prisma";

function persistTeamConfig() {
  savePersistedTeamMembers(siteConfig.team);
}

/**
 * Get the primary shop ID for database operations
 * Returns the first shop ID, typically 1 for single-shop installations
 */
export async function getPrimaryShopId(): Promise<number | null> {
  const shop = await prisma.shop.findFirst({
    select: { id: true },
    orderBy: { id: "asc" }
  });
  return shop?.id ?? null;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

// ============================================================================
// DATABASE-BACKED FUNCTIONS (Prisma)
// ============================================================================

/**
 * Save or update a service in the database
 * This is the new database-backed version that replaces the siteConfig approach
 */
export async function saveServiceToDatabase(
  shopId: number,
  input: {
    serviceId?: number;
    name: string;
    description?: string;
    durationMinutes?: number | null;
    price?: number | null;
    isActive: boolean;
  }
) {
  if (input.serviceId) {
    // Update existing service
    return await prisma.service.update({
      where: { id: input.serviceId },
      data: {
        name: input.name,
        description: input.description || null,
        durationMinutes: input.durationMinutes ?? null,
        price: input.price ?? null,
        isActive: input.isActive
      }
    });
  } else {
    // Create new service
    return await prisma.service.create({
      data: {
        shopId,
        name: input.name,
        description: input.description || null,
        durationMinutes: input.durationMinutes ?? null,
        price: input.price ?? null,
        isActive: input.isActive
      }
    });
  }
}

/**
 * Delete a service from the database
 */
export async function deleteServiceFromDatabase(serviceId: number) {
  return await prisma.service.delete({
    where: { id: serviceId }
  });
}

/**
 * Get all services for a shop from the database
 */
export async function getServicesFromDatabase(shopId: number) {
  return await prisma.service.findMany({
    where: { shopId },
    orderBy: { name: "asc" }
  });
}

/**
 * Save or update an offer in the database
 */
export async function saveOfferToDatabase(
  shopId: number,
  input: {
    offerId?: number;
    title: string;
    description?: string;
    price?: number | null;
    avatar?: string;
    isActive: boolean;
  }
) {
  if (input.offerId) {
    // Update existing offer
    return await prisma.offer.update({
      where: { id: input.offerId },
      data: {
        title: input.title,
        description: input.description || null,
        price: input.price ?? null,
        avatar: input.avatar || null,
        isActive: input.isActive
      }
    });
  } else {
    // Create new offer
    return await prisma.offer.create({
      data: {
        shopId,
        title: input.title,
        description: input.description || null,
        price: input.price ?? null,
        avatar: input.avatar || null,
        isActive: input.isActive
      }
    });
  }
}

/**
 * Delete an offer from the database
 */
export async function deleteOfferFromDatabase(offerId: number) {
  return await prisma.offer.delete({
    where: { id: offerId }
  });
}

/**
 * Get all offers for a shop from the database
 */
export async function getOffersFromDatabase(shopId: number) {
  return await prisma.offer.findMany({
    where: { shopId },
    orderBy: { title: "asc" }
  });
}

/**
 * Save or update a gallery image in the database
 */
export async function saveGalleryImageToDatabase(
  shopId: number,
  input: {
    imageId?: number;
    imageUrl: string;
    description?: string;
    isVisible: boolean;
  }
) {
  if (input.imageId) {
    // Update existing gallery image
    return await prisma.galleryImage.update({
      where: { id: input.imageId },
      data: {
        imageUrl: input.imageUrl,
        description: input.description || null,
        isVisible: input.isVisible
      }
    });
  } else {
    // Create new gallery image
    return await prisma.galleryImage.create({
      data: {
        shopId,
        imageUrl: input.imageUrl,
        description: input.description || null,
        isVisible: input.isVisible
      }
    });
  }
}

/**
 * Delete a gallery image from the database
 */
export async function deleteGalleryImageFromDatabase(imageId: number) {
  return await prisma.galleryImage.delete({
    where: { id: imageId }
  });
}

/**
 * Get all gallery images for a shop from the database
 */
export async function getGalleryImagesFromDatabase(shopId: number) {
  return await prisma.galleryImage.findMany({
    where: { shopId },
    orderBy: { id: "desc" }
  });
}

// ============================================================================
// PUBLIC READ-ONLY GETTERS (for displaying on pages)
// ============================================================================

/**
 * Get active services for the home page
 * Used by app/[locale]/page.tsx to display services section
 */
export async function getActiveServices(shopId: number) {
  return await prisma.service.findMany({
    where: { shopId, isActive: true },
    orderBy: { name: "asc" }
  });
}

/**
 * Get active, visible gallery images sorted for display
 * Used by app/[locale]/page.tsx to display gallery section
 */
export async function getVisibleGalleryImages(shopId: number) {
  return await prisma.galleryImage.findMany({
    where: { shopId, isVisible: true },
    orderBy: { id: "desc" }
  });
}

/**
 * Get active offers for the home page
 * Used by app/[locale]/page.tsx to display offers section
 */
export async function getActiveOffers(shopId: number) {
  return await prisma.offer.findMany({
    where: { shopId, isActive: true },
    orderBy: { title: "asc" }
  });
}

export function ensureLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : siteConfig.defaultLocale;
}

export function getThemeStyle(): CSSProperties {
  return {
    "--brand-primary": siteConfig.brand.primaryColor,
    "--brand-secondary": siteConfig.brand.secondaryColor,
    "--brand-accent": siteConfig.brand.accentColor
  } as CSSProperties;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDashboardData(locale: Locale) {
  const bookings = listBookings();
  const todayKey = formatDateKey(new Date());
  const todaysBookings = bookings.filter(
    (booking) =>
      booking.date === todayKey &&
      (booking.status === "confirmed" || booking.status === "completed")
  );
  const customerKeys = todaysBookings.map((booking) => booking.email || booking.customerName);
  const todaysCustomers = new Set(customerKeys).size;
  const todaysEmployees = new Set(todaysBookings.map((booking) => booking.employeeSlug)).size;
  const todayWeekday = new Date().getDay();
  const onDutyEmployees = new Set(
    siteConfig.booking.workingHours
      .filter((entry) => entry.weekday === todayWeekday && !entry.isOff)
      .map((entry) => entry.employeeSlug)
  ).size;

  return {
    recentBookings: bookings.slice(0, 6),
    metrics: {
      totalBookings: bookings.length,
      employees: siteConfig.team[locale].members.length,
      services: siteConfig.services[locale].services.length,
      activeOffers: siteConfig.offers[locale].offers.filter((offer) => offer.isActive).length
    },
    dailyOperations: {
      date: todayKey,
      employeesServingCustomers: todaysEmployees,
      employeesOnDuty: onDutyEmployees,
      customersBooked: todaysCustomers,
      bookingsScheduled: todaysBookings.length
    },
    shopEssentials: [
      {
        title: "Supplies and inventory",
        description: "Track clipper guards, blades, neck strips, towels, and retail products before the next rush."
      },
      {
        title: "Hygiene and sanitation",
        description: "Keep chair stations, tools, and waiting areas disinfected with a clear cleaning schedule."
      },
      {
        title: "Equipment maintenance",
        description: "Plan regular checks for clippers, trimmers, dryers, and chairs to avoid service interruptions."
      },
      {
        title: "Staff and shift planning",
        description: "Balance appointments, walk-ins, breaks, and peak-hour coverage across the team."
      },
      {
        title: "Customer follow-up",
        description: "Collect feedback, reviews, and rebooking reminders to improve retention and repeat visits."
      }
    ]
  };
}

function firstNonEmptyString(...values: Array<string | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function firstNonEmptyArray(...values: Array<string[] | undefined>) {
  for (const value of values) {
    if (Array.isArray(value) && value.length > 0) {
      return [...value];
    }
  }

  return [] as string[];
}

export function getBookingOptions(locale: Locale) {
  return {
    services: siteConfig.services[locale].services,
    employees: siteConfig.team[locale].members
  };
}

export function listFilteredBookings(filters: {
  date?: string;
  employeeSlug?: string;
  serviceSlug?: string;
  status?: BookingStatus;
}) {
  return listBookings(filters);
}

export function saveService(input: {
  serviceSlug?: string;
  slug?: string;
  isActive: boolean;
  translations: Record<Locale, { name: string; description: string; durationLabel: string; priceLabel: string }>;
}) {
  const slug = slugify(input.slug || input.translations.de.name || input.translations.en.name);
  const existingSlug = input.serviceSlug;
  const explicitPriceLabel =
    firstNonEmptyString(
      input.translations.en.priceLabel,
      input.translations.de.priceLabel,
      input.translations.ar.priceLabel
    ) || undefined;
  const fallbackLocale = siteConfig.defaultLocale;
  const fallbackTranslation = input.translations[fallbackLocale];
  const fallbackExisting = siteConfig.services[fallbackLocale].services.find(
    (service) => service.slug === existingSlug
  );

  for (const locale of locales) {
    const services = siteConfig.services[locale].services;
    const index = services.findIndex((service) => service.slug === existingSlug);
    const payload = input.translations[locale];
    const existing = index >= 0 ? services[index] : undefined;
    const hasExplicitPriceInput = Boolean(payload.priceLabel.trim());
    const resolvedPriceLabel =
      firstNonEmptyString(
        payload.priceLabel,
        existing?.priceLabel,
        fallbackTranslation.priceLabel,
        fallbackExisting?.priceLabel
      ) || undefined;
    const nextService = {
      slug,
      isActive: input.isActive,
      pricing:
        (hasExplicitPriceInput ? ("fixed" as const) : undefined) ||
        existing?.pricing ||
        fallbackExisting?.pricing ||
        (resolvedPriceLabel ? ("fixed" as const) : ("variable" as const)),
      priceLabel: resolvedPriceLabel,
      durationLabel:
        firstNonEmptyString(
          payload.durationLabel,
          existing?.durationLabel,
          fallbackTranslation.durationLabel,
          fallbackExisting?.durationLabel,
          "30 min"
        ) || "30 min",
      name:
        firstNonEmptyString(
          payload.name,
          existing?.name,
          fallbackTranslation.name,
          fallbackExisting?.name,
          slug
        ) || slug,
      description: firstNonEmptyString(
        payload.description,
        existing?.description,
        fallbackTranslation.description,
        fallbackExisting?.description
      )
    };

    if (index >= 0) {
      services[index] = nextService;
    } else {
      services.push(nextService);
    }
  }

  if (existingSlug && existingSlug !== slug) {
    for (const locale of locales) {
      for (const member of siteConfig.team[locale].members) {
        member.bookingServiceSlugs = member.bookingServiceSlugs.map((item) =>
          item === existingSlug ? slug : item
        );
      }
    }

    for (const assignment of siteConfig.booking.employeeServices) {
      if (assignment.serviceSlug === existingSlug) {
        assignment.serviceSlug = slug;
      }
    }

    persistTeamConfig();
  }

  if (explicitPriceLabel) {
    for (const assignment of siteConfig.booking.employeeServices) {
      if (assignment.serviceSlug === slug) {
        assignment.priceLabel = explicitPriceLabel;
      }
    }
  }
}

export function saveEmployee(input: {
  employeeSlug?: string;
  slug?: string;
  isActive: boolean;
  email?: string;
  linkLogin: boolean;
  translations: Record<Locale, { name: string; bio: string; imageSrc: string; specialties: string[] }>;
}) {
  const slug = slugify(input.slug || input.translations.de.name || input.translations.en.name);
  const existingSlug = input.employeeSlug;
  const fallbackLocale = siteConfig.defaultLocale;
  const fallbackTranslation = input.translations[fallbackLocale];
  const fallbackExisting = siteConfig.team[fallbackLocale].members.find(
    (member) => member.slug === existingSlug
  );

  for (const locale of locales) {
    const members = siteConfig.team[locale].members;
    const index = members.findIndex((member) => member.slug === existingSlug);
    const payload = input.translations[locale];
    const existing = index >= 0 ? members[index] : undefined;
    const bookingServiceSlugs =
      index >= 0 ? members[index].bookingServiceSlugs : [];
    const nextMember = {
      slug,
      isActive: input.isActive,
      imageSrc:
        firstNonEmptyString(
          payload.imageSrc,
          existing?.imageSrc,
          fallbackTranslation.imageSrc,
          fallbackExisting?.imageSrc,
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
        ) ||
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
      bookingServiceSlugs,
      specialties: firstNonEmptyArray(
        payload.specialties,
        existing?.specialties,
        fallbackTranslation.specialties,
        fallbackExisting?.specialties
      ),
      name:
        firstNonEmptyString(
          payload.name,
          existing?.name,
          fallbackTranslation.name,
          fallbackExisting?.name,
          slug
        ) || slug,
      bio:
        firstNonEmptyString(
          payload.bio,
          existing?.bio,
          fallbackTranslation.bio,
          fallbackExisting?.bio
        ) || undefined
    };

    if (index >= 0) {
      members[index] = nextMember;
    } else {
      members.push(nextMember);
    }
  }

  if (existingSlug && existingSlug !== slug) {
    for (const assignment of siteConfig.booking.employeeServices) {
      if (assignment.employeeSlug === existingSlug) {
        assignment.employeeSlug = slug;
      }
    }

    for (const entry of siteConfig.booking.workingHours) {
      if (entry.employeeSlug === existingSlug) {
        entry.employeeSlug = slug;
      }
    }

    for (const entry of siteConfig.booking.blockedTimes) {
      if (entry.employeeSlug === existingSlug) {
        entry.employeeSlug = slug;
      }
    }
  }

  if (input.linkLogin && input.email) {
    const existingUser = authUsers.find((user) => user.email === input.email);

    if (!existingUser) {
      authUsers.push({
        id: `employee-login-${slug}`,
        email: input.email,
        role: "employee",
        displayName: input.translations.de.name || input.translations.en.name || slug,
        employeeSlug: slug,
        canManageAvailability: true,
        passwordSalt: "b572d2ea55bd90b48d3cb074a32761d6",
        passwordHash:
          "c41e2d4e694e03dccaa15a094953c9d4d143dbc572d601fbb1dc925fb46afe4f9c1cd855b4c0feb8f808911803c36d2be63018d2b860471bbc899ab4700e3dcf"
      });
    }
  }

  persistTeamConfig();
}

export function setEmployeeActive(input: { employeeSlug: string; isActive: boolean }) {
  for (const locale of locales) {
    const member = siteConfig.team[locale].members.find((item) => item.slug === input.employeeSlug);

    if (member) {
      member.isActive = input.isActive;
    }
  }

  persistTeamConfig();
}

export function saveAssignment(input: {
  employeeSlug: string;
  serviceSlug: string;
  durationMinutes: number;
  priceLabel: string;
  isActive: boolean;
}) {
  const existing = siteConfig.booking.employeeServices.find(
    (entry) => entry.employeeSlug === input.employeeSlug && entry.serviceSlug === input.serviceSlug
  );

  if (existing) {
    existing.durationMinutes = input.durationMinutes;
    existing.priceLabel = input.priceLabel;
    existing.isActive = input.isActive;
  } else {
    siteConfig.booking.employeeServices.push({ ...input });
  }

  for (const locale of locales) {
    const member = siteConfig.team[locale].members.find((item) => item.slug === input.employeeSlug);

    if (member && !member.bookingServiceSlugs.includes(input.serviceSlug)) {
      member.bookingServiceSlugs.push(input.serviceSlug);
    }
  }

  persistTeamConfig();
}

export function saveWorkingHours(input: {
  employeeSlug: string;
  weekday: number;
  start: string;
  end: string;
  isOff: boolean;
}) {
  const existing = siteConfig.booking.workingHours.find(
    (entry) => entry.employeeSlug === input.employeeSlug && entry.weekday === input.weekday
  );

  if (existing) {
    existing.start = input.start;
    existing.end = input.end;
    existing.isOff = input.isOff;
    return;
  }

  siteConfig.booking.workingHours.push({ ...input });
}

export function addBlockedTime(input: {
  employeeSlug: string;
  date: string;
  start: string;
  end: string;
  reason?: string;
}) {
  siteConfig.booking.blockedTimes.push({
    employeeSlug: input.employeeSlug,
    date: input.date,
    start: input.start,
    end: input.end,
    reason: input.reason || undefined
  });
}

export function saveGalleryImage(input: {
  slug?: string;
  imageSrc: string;
  alt: string;
  caption: string;
  isVisible: boolean;
  sortOrder: number;
}) {
  const slug = slugify(input.slug || input.caption || `gallery-${Date.now()}`);

  for (const locale of locales) {
    const images = siteConfig.gallery[locale].images;
    const index = images.findIndex((image) => image.slug === slug);
    const nextImage = {
      slug,
      imageSrc: input.imageSrc,
      alt: input.alt,
      caption: input.caption,
      isVisible: input.isVisible,
      sortOrder: input.sortOrder
    };

    if (index >= 0) {
      images[index] = { ...images[index], ...nextImage };
    } else {
      images.push(nextImage);
    }
  }
}

export function deleteGalleryImage(slug: string) {
  for (const locale of locales) {
    siteConfig.gallery[locale].images = siteConfig.gallery[locale].images.filter(
      (image) => image.slug !== slug
    );
  }
}

export function saveOffer(input: {
  offerSlug?: string;
  slug?: string;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  imageSrc?: string;
  translations: Record<Locale, { title: string; description: string }>;
}) {
  const slug = slugify(input.slug || input.translations.de.title || input.translations.en.title);
  const fallbackLocale = siteConfig.defaultLocale;
  const fallbackTranslation = input.translations[fallbackLocale];
  const fallbackExisting = siteConfig.offers[fallbackLocale].offers.find(
    (offer) => offer.slug === input.offerSlug
  );

  for (const locale of locales) {
    const offers = siteConfig.offers[locale].offers;
    const index = offers.findIndex((offer) => offer.slug === input.offerSlug);
    const payload = input.translations[locale];
    const existing = index >= 0 ? offers[index] : undefined;
    const nextOffer = {
      slug,
      serviceSlug: existing?.serviceSlug ?? fallbackExisting?.serviceSlug,
      isActive: input.isActive,
      validFrom: input.validFrom,
      validUntil: input.validUntil,
      imageSrc: input.imageSrc || undefined,
      title:
        firstNonEmptyString(
          payload.title,
          existing?.title,
          fallbackTranslation.title,
          fallbackExisting?.title,
          slug
        ) || slug,
      description: firstNonEmptyString(
        payload.description,
        existing?.description,
        fallbackTranslation.description,
        fallbackExisting?.description
      )
    };

    if (index >= 0) {
      offers[index] = nextOffer;
    } else {
      offers.push(nextOffer);
    }
  }
}

export function deleteOffer(slug: string) {
  for (const locale of locales) {
    siteConfig.offers[locale].offers = siteConfig.offers[locale].offers.filter(
      (offer) => offer.slug !== slug
    );
  }
}

export function saveShopSettings(input: {
  shopName: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  enabledLocales: Locale[];
  defaultLocale: Locale;
  hero: Record<Locale, { title: string; subtitle: string; kicker: string }>;
}) {
  siteConfig.brand.shopName = input.shopName;
  siteConfig.brand.logoText = input.logoText;
  siteConfig.brand.primaryColor = input.primaryColor;
  siteConfig.brand.secondaryColor = input.secondaryColor;
  siteConfig.brand.accentColor = input.accentColor;
  siteConfig.defaultLocale = input.defaultLocale;
  const mutableLocales = siteConfig.locales as Locale[];
  mutableLocales.splice(0, mutableLocales.length, ...input.enabledLocales);

  for (const locale of locales) {
    const existingHero = getHomepageContent(locale).hero;
    const fallbackHero = input.hero[siteConfig.defaultLocale];

    siteConfig.content[locale].hero = {
      kicker: firstNonEmptyString(
        input.hero[locale].kicker,
        existingHero.kicker,
        fallbackHero.kicker
      ),
      title: firstNonEmptyString(input.hero[locale].title, existingHero.title, fallbackHero.title),
      subtitle: firstNonEmptyString(
        input.hero[locale].subtitle,
        existingHero.subtitle,
        fallbackHero.subtitle
      )
    };
  }
}

export function saveHomepageHeroContent(input: {
  locale: Locale;
  kicker: string;
  title: string;
  subtitle: string;
}) {
  const existingHero = getHomepageContent(input.locale).hero;

  siteConfig.content[input.locale].hero = {
    ...siteConfig.content[input.locale].hero,
    kicker: firstNonEmptyString(input.kicker, existingHero.kicker),
    subtitle: firstNonEmptyString(input.subtitle, existingHero.subtitle),
    title: firstNonEmptyString(input.title, existingHero.title)
  };
}

export function saveHomepageCounterOverrides(input: {
  employees: number | null;
  maxCustomersDaily: number | null;
  maxAppointmentsDaily: number | null;
  allBookings: number | null;
}) {
  siteConfig.homepageCounterOverrides = {
    employees: input.employees,
    maxCustomersDaily: input.maxCustomersDaily,
    maxAppointmentsDaily: input.maxAppointmentsDaily,
    allBookings: input.allBookings
  };
}

export function saveEmailSettings(input: {
  providerName: string;
  fromEmail: string;
  replyToEmail: string;
  sendCustomerConfirmation: boolean;
  sendInternalNotification: boolean;
  internalNotificationEmail: string;
}) {
  siteConfig.emailSettings = { ...input };
}

export function saveContactContent(input: {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  workingHours: Record<Locale, string>;
  mapEmbedUrl: string;
  mapDirectionsHref: string;
  mapVisible: boolean;
  translations: Record<Locale, { title: string; subtitle: string; addressLabel: string }>;
}) {
  const fallbackLocale = siteConfig.defaultLocale;

  for (const locale of locales) {
    const content = siteConfig.contact[locale];
    const fallbackContent = getContactContent(locale);
    const payload = input.translations[locale];
    const fallbackPayload = input.translations[fallbackLocale];

    content.title = firstNonEmptyString(payload.title, fallbackContent.title, fallbackPayload.title);
    content.subtitle = firstNonEmptyString(
      payload.subtitle,
      fallbackContent.subtitle,
      fallbackPayload.subtitle
    );
    content.items.address.label = firstNonEmptyString(
      payload.addressLabel,
      fallbackContent.items.address.label,
      fallbackPayload.addressLabel
    );
    content.items.address.value = input.address;
    content.items.phone.value = input.phone;
    content.items.phone.href = `tel:${input.phone.replace(/[^\d+]/g, "")}`;
    content.items.email.value = input.email;
    content.items.email.href = `mailto:${input.email}`;
    content.items.whatsapp = input.whatsapp
      ? {
          label: "WhatsApp",
          value: input.whatsapp,
          href: input.whatsapp
        }
      : undefined;
    const workingHoursSource =
      firstNonEmptyString(input.workingHours[locale], input.workingHours[fallbackLocale]) ||
      fallbackContent.workingHours.map((entry) => `${entry.days}: ${entry.hours}`).join("\n");
    content.workingHours = workingHoursSource
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [days, ...rest] = line.split(":");
        return {
          days: days.trim(),
          hours: rest.join(":").trim() || line.trim()
        };
      });
    content.map.embedUrl = input.mapEmbedUrl;
    content.map.directionsHref = input.mapDirectionsHref;
    content.map.isVisible = input.mapVisible;
  }
}

export function setBookingStatus(bookingId: string, status: BookingStatus) {
  return updateBookingStatus(bookingId, status);
}

export function formatAssignmentDuration(durationMinutes: number) {
  return `${durationMinutes} min`;
}

export function buildWeekdaySummary(employeeSlug: string) {
  return siteConfig.booking.workingHours
    .filter((entry) => entry.employeeSlug === employeeSlug)
    .sort((left, right) => left.weekday - right.weekday)
    .map((entry) =>
      entry.isOff ? `${entry.weekday}: off` : `${entry.weekday}: ${entry.start}-${entry.end}`
    )
    .join(", ");
}

export function getBlockedTimeSummary(employeeSlug: string) {
  return siteConfig.booking.blockedTimes
    .filter((entry) => entry.employeeSlug === employeeSlug)
    .sort((left, right) =>
      `${left.date}-${left.start}`.localeCompare(`${right.date}-${right.start}`)
    );
}

export function isValidTimeRange(start: string, end: string) {
  return parseTimeToMinutes(start) < parseTimeToMinutes(end);
}
