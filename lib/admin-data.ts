import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
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

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
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

export function getDashboardData(locale: Locale) {
  const bookings = listBookings();

  return {
    recentBookings: bookings.slice(0, 6),
    metrics: {
      totalBookings: bookings.length,
      employees: siteConfig.team[locale].members.length,
      services: siteConfig.services[locale].services.length,
      activeOffers: siteConfig.offers[locale].offers.filter((offer) => offer.isActive).length
    }
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

function firstNonEmptyTranslationValue<T>(
  translations: Record<Locale, T>,
  pick: (translation: T) => string | undefined
) {
  for (const locale of locales) {
    const value = pick(translations[locale]);
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
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
  const slug = slugify(input.slug || firstNonEmptyTranslationValue(input.translations, (item) => item.name));
  const existingSlug = input.serviceSlug;
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
    const nextService = {
      slug,
      isActive: input.isActive,
      pricing: "variable" as const,
      priceLabel:
        firstNonEmptyString(
          payload.priceLabel,
          existing?.priceLabel,
          fallbackTranslation.priceLabel,
          fallbackExisting?.priceLabel
        ) || undefined,
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
  }
}

export function deleteService(serviceSlug: string) {
  if (!serviceSlug) {
    return;
  }

  for (const locale of locales) {
    siteConfig.services[locale].services = siteConfig.services[locale].services.filter(
      (service) => service.slug !== serviceSlug
    );

    for (const member of siteConfig.team[locale].members) {
      member.bookingServiceSlugs = member.bookingServiceSlugs.filter((slug) => slug !== serviceSlug);
    }
  }

  siteConfig.booking.employeeServices = siteConfig.booking.employeeServices.filter(
    (entry) => entry.serviceSlug !== serviceSlug
  );
}

export function saveEmployee(input: {
  employeeSlug?: string;
  slug?: string;
  isActive: boolean;
  email?: string;
  linkLogin: boolean;
  translations: Record<Locale, { name: string; bio: string; imageSrc: string; specialties: string[] }>;
}) {
  const slug = slugify(input.slug || firstNonEmptyTranslationValue(input.translations, (item) => item.name));
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
        displayName: firstNonEmptyTranslationValue(input.translations, (item) => item.name) || slug,
        employeeSlug: slug,
        canManageAvailability: true,
        passwordSalt: "b572d2ea55bd90b48d3cb074a32761d6",
        passwordHash:
          "c41e2d4e694e03dccaa15a094953c9d4d143dbc572d601fbb1dc925fb46afe4f9c1cd855b4c0feb8f808911803c36d2be63018d2b860471bbc899ab4700e3dcf"
      });
    }
  }
}

export function deleteEmployee(employeeSlug: string) {
  if (!employeeSlug) {
    return;
  }

  for (const locale of locales) {
    siteConfig.team[locale].members = siteConfig.team[locale].members.filter(
      (member) => member.slug !== employeeSlug
    );
  }

  siteConfig.booking.employeeServices = siteConfig.booking.employeeServices.filter(
    (entry) => entry.employeeSlug !== employeeSlug
  );
  siteConfig.booking.workingHours = siteConfig.booking.workingHours.filter(
    (entry) => entry.employeeSlug !== employeeSlug
  );
  siteConfig.booking.blockedTimes = siteConfig.booking.blockedTimes.filter(
    (entry) => entry.employeeSlug !== employeeSlug
  );

  const nextUsers = authUsers.filter(
    (user) => !(user.role === "employee" && user.employeeSlug === employeeSlug)
  );
  authUsers.splice(0, authUsers.length, ...nextUsers);
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
}

export function deleteAssignment(employeeSlug: string, serviceSlug: string) {
  if (!employeeSlug || !serviceSlug) {
    return;
  }

  siteConfig.booking.employeeServices = siteConfig.booking.employeeServices.filter(
    (entry) => !(entry.employeeSlug === employeeSlug && entry.serviceSlug === serviceSlug)
  );

  for (const locale of locales) {
    const member = siteConfig.team[locale].members.find((item) => item.slug === employeeSlug);

    if (member) {
      member.bookingServiceSlugs = member.bookingServiceSlugs.filter((slug) => slug !== serviceSlug);
    }
  }
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

export function updateBlockedTime(input: {
  employeeSlug: string;
  originalDate: string;
  originalStart: string;
  originalEnd: string;
  date: string;
  start: string;
  end: string;
  reason?: string;
}) {
  const existing = siteConfig.booking.blockedTimes.find(
    (entry) =>
      entry.employeeSlug === input.employeeSlug &&
      entry.date === input.originalDate &&
      entry.start === input.originalStart &&
      entry.end === input.originalEnd
  );

  if (existing) {
    existing.date = input.date;
    existing.start = input.start;
    existing.end = input.end;
    existing.reason = input.reason || undefined;
    return;
  }

  addBlockedTime({
    employeeSlug: input.employeeSlug,
    date: input.date,
    start: input.start,
    end: input.end,
    reason: input.reason
  });
}

export function deleteBlockedTime(input: {
  employeeSlug: string;
  date: string;
  start: string;
  end: string;
}) {
  siteConfig.booking.blockedTimes = siteConfig.booking.blockedTimes.filter(
    (entry) =>
      !(
        entry.employeeSlug === input.employeeSlug &&
        entry.date === input.date &&
        entry.start === input.start &&
        entry.end === input.end
      )
  );
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

const galleryUploadDirectory = path.join(process.cwd(), "public", "uploads", "gallery");

function sanitizeFilenamePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getGalleryUploadFilename(fileName: string, slug?: string, caption?: string) {
  const extension = path.extname(fileName).toLowerCase() || ".jpg";
  const baseName = sanitizeFilenamePart(path.basename(fileName, extension));
  const preferredBase = sanitizeFilenamePart(slug || caption || baseName || `gallery-${Date.now()}`);
  return `${preferredBase}-${Date.now()}${extension}`;
}

export async function uploadGalleryImage(input: { file: File; slug?: string; caption?: string }) {
  const { file, slug, caption } = input;

  if (!file || file.size === 0) {
    throw new Error("Gallery image file is required.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed for gallery items.");
  }

  await mkdir(galleryUploadDirectory, { recursive: true });
  const fileName = getGalleryUploadFilename(file.name, slug, caption);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(galleryUploadDirectory, fileName), buffer);
  return `/uploads/gallery/${fileName}`;
}

function getLocalGalleryUploadPath(imageSrc: string) {
  if (!imageSrc.startsWith("/uploads/gallery/")) {
    return null;
  }

  const relativePath = imageSrc.replace(/^\/+/, "").split("/").join(path.sep);
  return path.join(process.cwd(), "public", relativePath);
}

export function deleteGalleryImage(slug: string) {
  let deletedImageSrc: string | undefined;

  for (const locale of locales) {
    const existing = siteConfig.gallery[locale].images.find((image) => image.slug === slug);
    if (!deletedImageSrc && existing) {
      deletedImageSrc = existing.imageSrc;
    }

    siteConfig.gallery[locale].images = siteConfig.gallery[locale].images.filter(
      (image) => image.slug !== slug
    );
  }

  if (deletedImageSrc) {
    void deleteGalleryUploadIfUnused(deletedImageSrc);
  }
}

async function deleteGalleryUploadIfUnused(imageSrc: string) {
  const isStillUsed = locales.some((locale) =>
    siteConfig.gallery[locale].images.some((image) => image.imageSrc === imageSrc)
  );

  if (isStillUsed) {
    return;
  }

  const filePath = getLocalGalleryUploadPath(imageSrc);
  if (!filePath) {
    return;
  }

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

export function cleanupGalleryUpload(imageSrc: string) {
  void deleteGalleryUploadIfUnused(imageSrc);
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
  const slug = slugify(input.slug || firstNonEmptyTranslationValue(input.translations, (item) => item.title));
  const existingSlug = input.offerSlug;
  const fallbackLocale = siteConfig.defaultLocale;
  const fallbackTranslation = input.translations[fallbackLocale];
  const fallbackExisting = siteConfig.offers[fallbackLocale].offers.find(
    (offer) => offer.slug === existingSlug
  );

  for (const locale of locales) {
    const offers = siteConfig.offers[locale].offers;
    const index = offers.findIndex((offer) => offer.slug === input.offerSlug);
    const payload = input.translations[locale];
    const existing = index >= 0 ? offers[index] : undefined;
    const nextOffer = {
      slug,
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

  if (existingSlug && existingSlug !== slug) {
    for (const locale of locales) {
      siteConfig.offers[locale].offers = siteConfig.offers[locale].offers.filter(
        (offer) => offer.slug !== existingSlug || offer.slug === slug
      );
    }
  }
}

export function deleteOffer(slug: string) {
  if (!slug) {
    return;
  }

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
