"use server";

import { redirect } from "next/navigation";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import { join } from "path";
import { requireRole } from "@/lib/auth";
import { isHeroImageKey } from "@/lib/hero-image";
import {
  addBlockedTime,
  ensureLocale,
  isValidTimeRange,
  saveAssignment,
  saveContactContent,
  saveEmailSettings,
  saveEmployee,
  saveGalleryImage,
  saveOffer,
  saveHomepageHeroContent,
  saveService,
  saveShopSettings,
  saveWorkingHours,
  setBookingStatus,
  deleteGalleryImage,
  deleteOffer
} from "@/lib/admin-data";
import { locales, type Locale } from "@/lib/i18n";

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function checked(formData: FormData, key: string) {
  return normalize(formData.get(key)) === "on";
}

async function authorize(localeValue: string) {
  const locale = ensureLocale(localeValue);
  await requireRole(["admin"], locale, "/admin");
  return locale;
}

function redirectToAdmin(locale: Locale, section?: string) {
  redirect(`/${locale}/admin${section ? `#${section}` : ""}`);
}

export async function upsertServiceAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveService({
    serviceSlug: normalize(formData.get("serviceSlug")) || undefined,
    slug: normalize(formData.get("slug")) || undefined,
    isActive: checked(formData, "isActive"),
    translations: {
      en: {
        name: normalize(formData.get("name_en")),
        description: normalize(formData.get("description_en")),
        durationLabel: normalize(formData.get("duration_en")),
        priceLabel: normalize(formData.get("price_en"))
      },
      de: {
        name: normalize(formData.get("name_de")),
        description: normalize(formData.get("description_de")),
        durationLabel: normalize(formData.get("duration_de")),
        priceLabel: normalize(formData.get("price_de"))
      },
      ar: {
        name: normalize(formData.get("name_ar")),
        description: normalize(formData.get("description_ar")),
        durationLabel: normalize(formData.get("duration_ar")),
        priceLabel: normalize(formData.get("price_ar"))
      }
    }
  });

  redirectToAdmin(locale, "services");
}

export async function upsertEmployeeAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveEmployee({
    employeeSlug: normalize(formData.get("employeeSlug")) || undefined,
    slug: normalize(formData.get("slug")) || undefined,
    isActive: checked(formData, "isActive"),
    email: normalize(formData.get("loginEmail")) || undefined,
    linkLogin: checked(formData, "linkLogin"),
    translations: {
      en: {
        name: normalize(formData.get("name_en")),
        bio: normalize(formData.get("bio_en")),
        imageSrc: normalize(formData.get("image_en")),
        specialties: normalize(formData.get("specialties_en"))
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      },
      de: {
        name: normalize(formData.get("name_de")),
        bio: normalize(formData.get("bio_de")),
        imageSrc: normalize(formData.get("image_de")),
        specialties: normalize(formData.get("specialties_de"))
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      },
      ar: {
        name: normalize(formData.get("name_ar")),
        bio: normalize(formData.get("bio_ar")),
        imageSrc: normalize(formData.get("image_ar")),
        specialties: normalize(formData.get("specialties_ar"))
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      }
    }
  });

  redirectToAdmin(locale, "employees");
}

export async function upsertAssignmentAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveAssignment({
    employeeSlug: normalize(formData.get("employeeSlug")),
    serviceSlug: normalize(formData.get("serviceSlug")),
    durationMinutes: Number(normalize(formData.get("durationMinutes")) || 0),
    priceLabel: normalize(formData.get("priceLabel")),
    isActive: checked(formData, "isActive")
  });

  redirectToAdmin(locale, "availability");
}

export async function upsertWorkingHoursAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  const start = normalize(formData.get("start"));
  const end = normalize(formData.get("end"));
  const isOff = checked(formData, "isOff");

  if (!isOff && (!start || !end || !isValidTimeRange(start, end))) {
    redirectToAdmin(locale, "availability");
  }

  saveWorkingHours({
    employeeSlug: normalize(formData.get("employeeSlug")),
    weekday: Number(normalize(formData.get("weekday")) || 0),
    start: start || "00:00",
    end: end || "00:00",
    isOff
  });

  redirectToAdmin(locale, "availability");
}

export async function addBlockedTimeAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  const start = normalize(formData.get("start"));
  const end = normalize(formData.get("end"));

  if (!start || !end || !isValidTimeRange(start, end)) {
    redirectToAdmin(locale, "availability");
  }

  addBlockedTime({
    employeeSlug: normalize(formData.get("employeeSlug")),
    date: normalize(formData.get("date")),
    start,
    end,
    reason: normalize(formData.get("reason")) || undefined
  });

  redirectToAdmin(locale, "availability");
}

export async function updateBookingStatusAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  setBookingStatus(
    normalize(formData.get("bookingId")),
    normalize(formData.get("status")) as "cancelled" | "completed" | "confirmed" | "no_show"
  );
  redirectToAdmin(locale, "bookings");
}

export async function upsertGalleryAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveGalleryImage({
    slug: normalize(formData.get("slug")) || undefined,
    imageSrc: normalize(formData.get("imageSrc")),
    alt: normalize(formData.get("alt")),
    caption: normalize(formData.get("caption")),
    isVisible: checked(formData, "isVisible"),
    sortOrder: Number(normalize(formData.get("sortOrder")) || 0)
  });

  redirectToAdmin(locale, "gallery");
}

export async function deleteGalleryAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  deleteGalleryImage(normalize(formData.get("slug")));
  redirectToAdmin(locale, "gallery");
}

export async function upsertOfferAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveOffer({
    offerSlug: normalize(formData.get("offerSlug")) || undefined,
    slug: normalize(formData.get("slug")) || undefined,
    isActive: checked(formData, "isActive"),
    validFrom: normalize(formData.get("validFrom")),
    validUntil: normalize(formData.get("validUntil")),
    imageSrc: normalize(formData.get("imageSrc")) || undefined,
    translations: {
      en: {
        title: normalize(formData.get("title_en")),
        description: normalize(formData.get("description_en"))
      },
      de: {
        title: normalize(formData.get("title_de")),
        description: normalize(formData.get("description_de"))
      },
      ar: {
        title: normalize(formData.get("title_ar")),
        description: normalize(formData.get("description_ar"))
      }
    }
  });

  redirectToAdmin(locale, "offers");
}

export async function deleteOfferAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  deleteOffer(normalize(formData.get("slug")));
  redirectToAdmin(locale, "offers");
}

export async function updateShopSettingsAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  const enabledLocales = locales.filter((item) => checked(formData, `locale_${item}`));
  const defaultLocale = ensureLocale(normalize(formData.get("defaultLocale")));

  saveShopSettings({
    shopName: normalize(formData.get("shopName")),
    logoText: normalize(formData.get("logoText")),
    primaryColor: normalize(formData.get("primaryColor")),
    secondaryColor: normalize(formData.get("secondaryColor")),
    accentColor: normalize(formData.get("accentColor")),
    enabledLocales: enabledLocales.length > 0 ? enabledLocales : [defaultLocale],
    defaultLocale,
    hero: {
      en: {
        kicker: normalize(formData.get("hero_kicker_en")),
        title: normalize(formData.get("hero_title_en")),
        subtitle: normalize(formData.get("hero_subtitle_en"))
      },
      de: {
        kicker: normalize(formData.get("hero_kicker_de")),
        title: normalize(formData.get("hero_title_de")),
        subtitle: normalize(formData.get("hero_subtitle_de"))
      },
      ar: {
        kicker: normalize(formData.get("hero_kicker_ar")),
        title: normalize(formData.get("hero_title_ar")),
        subtitle: normalize(formData.get("hero_subtitle_ar"))
      }
    }
  });

  redirectToAdmin(locale, "settings");
}

export async function updateEmailSettingsAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveEmailSettings({
    providerName: normalize(formData.get("providerName")),
    fromEmail: normalize(formData.get("fromEmail")),
    replyToEmail: normalize(formData.get("replyToEmail")),
    sendCustomerConfirmation: checked(formData, "sendCustomerConfirmation"),
    sendInternalNotification: checked(formData, "sendInternalNotification"),
    internalNotificationEmail: normalize(formData.get("internalNotificationEmail"))
  });

  redirectToAdmin(locale, "email");
}

export async function updateContactContentAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveContactContent({
    phone: normalize(formData.get("phone")),
    email: normalize(formData.get("email")),
    address: normalize(formData.get("address")),
    whatsapp: normalize(formData.get("whatsapp")),
    workingHours: {
      en: normalize(formData.get("hours_en")),
      de: normalize(formData.get("hours_de")),
      ar: normalize(formData.get("hours_ar"))
    },
    mapEmbedUrl: normalize(formData.get("mapEmbedUrl")),
    mapDirectionsHref: normalize(formData.get("mapDirectionsHref")),
    mapVisible: checked(formData, "mapVisible"),
    translations: {
      en: {
        title: normalize(formData.get("title_en")),
        subtitle: normalize(formData.get("subtitle_en")),
        addressLabel: normalize(formData.get("addressLabel_en"))
      },
      de: {
        title: normalize(formData.get("title_de")),
        subtitle: normalize(formData.get("subtitle_de")),
        addressLabel: normalize(formData.get("addressLabel_de"))
      },
      ar: {
        title: normalize(formData.get("title_ar")),
        subtitle: normalize(formData.get("subtitle_ar")),
        addressLabel: normalize(formData.get("addressLabel_ar"))
      }
    }
  });

  redirectToAdmin(locale, "contact");
}

export async function updateHomepageHeroContentAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveHomepageHeroContent({
    locale,
    kicker: normalize(formData.get("heroKicker")),
    subtitle: normalize(formData.get("heroSubtitle")),
    title: normalize(formData.get("heroTitle"))
  });

  redirect(`/${locale}/admin/pages/hero`);
}

export async function uploadHeroImageAction(formData: FormData) {
  try {
    const locale = normalize(formData.get("locale"));
    const page = normalize(formData.get("page"));
    await authorize(locale);

    const file = formData.get("file") as File;
    const format = normalize(formData.get("format")) as "avif" | "webp" | "jpg";
    const alt = normalize(formData.get("alt"));

    if (!isHeroImageKey(page)) {
      return { success: false, error: "Invalid hero image target" };
    }

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "heros", page);
    await mkdir(uploadDir, { recursive: true });

    const existingFiles = await readdir(uploadDir);
    await Promise.all(
      existingFiles.map((existingFile) => unlink(join(uploadDir, existingFile)))
    );

    // Generate filename with timestamp
    const timestamp = Date.now();
    const filename = `hero-${timestamp}.${format}`;
    const filepath = join(uploadDir, filename);

    // Save file
    await writeFile(filepath, Buffer.from(bytes));

    return {
      success: true,
      imageUrl: `/heros/${page}/${filename}`,
      alt
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed"
    };
  }
}

export async function uploadContentBackgroundImageAction(formData: FormData) {
  try {
    const locale = normalize(formData.get("locale"));
    const page = normalize(formData.get("page"));
    await authorize(locale);

    const file = formData.get("file") as File;
    const format = normalize(formData.get("format")) as "avif" | "webp" | "jpg";
    const alt = normalize(formData.get("alt"));

    if (!isHeroImageKey(page)) {
      return { success: false, error: "Invalid content background target" };
    }

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const uploadDir = join(process.cwd(), "public", "content-backgrounds", page);
    await mkdir(uploadDir, { recursive: true });

    const existingFiles = await readdir(uploadDir);
    await Promise.all(
      existingFiles.map((existingFile) => unlink(join(uploadDir, existingFile)))
    );

    const timestamp = Date.now();
    const filename = `content-bg-${timestamp}.${format}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, Buffer.from(bytes));

    return {
      success: true,
      imageUrl: `/content-backgrounds/${page}/${filename}`,
      alt
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed"
    };
  }
}
