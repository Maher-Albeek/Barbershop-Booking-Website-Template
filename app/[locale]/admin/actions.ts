"use server";

import { redirect } from "next/navigation";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import { join } from "path";
import { requireRole } from "@/lib/auth";
import { isHeroImageKey } from "@/lib/hero-image";
import { prisma } from "@/lib/prisma";
import {
  addBlockedTime,
  ensureLocale,
  isValidTimeRange,
  slugify,
  saveAssignment,
  saveContactContent,
  saveHomepageCounterOverrides,
  saveEmailSettings,
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
import { getAdminPageHref, type AdminPageKey } from "./_navigation";

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function checked(formData: FormData, key: string) {
  return normalize(formData.get(key)) === "on";
}

function parseOptionalNonNegativeInt(value: FormDataEntryValue | null) {
  const normalized = normalize(value);

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function parseOptionalPositiveInt(value: FormDataEntryValue | null) {
  const normalized = normalize(value);

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function imageMimeToExtension(mimeType: string) {
  switch (mimeType) {
    case "image/avif":
      return "avif";
    case "image/webp":
      return "webp";
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    default:
      return null;
  }
}

async function saveEmployeeAvatarFromDataUrl(slug: string, maybeDataUrl: string) {
  if (!slug || !maybeDataUrl.startsWith("data:image/")) {
    return "";
  }

  const parsed = maybeDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!parsed) {
    return "";
  }

  const mimeType = parsed[1];
  const base64 = parsed[2];
  const extension = imageMimeToExtension(mimeType);

  if (!extension) {
    return "";
  }

  const uploadDir = join(process.cwd(), "public", "employees");
  await mkdir(uploadDir, { recursive: true });

  const existingFiles = await readdir(uploadDir);
  await Promise.all(
    existingFiles
      .filter((filename) => filename.startsWith(`${slug}.`))
      .map((filename) => unlink(join(uploadDir, filename)))
  );

  const fileName = `${slug}.${extension}`;
  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, Buffer.from(base64, "base64"));

  return `/employees/${fileName}`;
}

async function authorize(localeValue: string) {
  const locale = ensureLocale(localeValue);
  await requireRole(["admin"], locale, "/admin");
  return locale;
}

function redirectToAdmin(locale: Locale, pageKey: AdminPageKey) {
  redirect(getAdminPageHref(locale, pageKey));
}

async function getPrimaryShopId() {
  const shop = await prisma.shop.findFirst({
    select: { id: true },
    orderBy: { id: "asc" }
  });

  return shop?.id ?? null;
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
  const employeeId = parseOptionalPositiveInt(formData.get("employeeId"));
  const name = normalize(formData.get("name"));
  const bioValue = normalize(formData.get("bio"));
  const avatarInput = normalize(formData.get("avatar"));
  const isActive = checked(formData, "isActive");

  if (employeeId) {
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true, name: true, avatar: true }
    });

    if (!existingEmployee) {
      redirectToAdmin(locale, "employees");
    }

    const avatarUploadKey = slugify(name || existingEmployee.name || `employee-${employeeId}`);
    const uploadedAvatar = await saveEmployeeAvatarFromDataUrl(avatarUploadKey, avatarInput);

    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        name: name || existingEmployee.name,
        bio: bioValue || null,
        avatar: uploadedAvatar || avatarInput || existingEmployee.avatar || null,
        isActive
      }
    });
  } else {
    if (!name) {
      redirectToAdmin(locale, "employees");
    }

    const shopId = await getPrimaryShopId();

    if (!shopId) {
      redirectToAdmin(locale, "employees");
    }

    const avatarUploadKey = slugify(name);
    const uploadedAvatar = await saveEmployeeAvatarFromDataUrl(avatarUploadKey, avatarInput);

    await prisma.employee.create({
      data: {
        shopId,
        name,
        bio: bioValue || null,
        avatar: uploadedAvatar || avatarInput || null,
        isActive
      }
    });
  }

  redirectToAdmin(locale, "employees");
}

export async function setEmployeeActiveAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  const employeeId = parseOptionalPositiveInt(formData.get("employeeId"));

  if (!employeeId) {
    redirectToAdmin(locale, "employees");
  }

  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      isActive: checked(formData, "isActive")
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

  redirectToAdmin(locale, "schedule");
}

export async function upsertWorkingHoursAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  const start = normalize(formData.get("start"));
  const end = normalize(formData.get("end"));
  const isOff = checked(formData, "isOff");

  if (!isOff && (!start || !end || !isValidTimeRange(start, end))) {
    redirectToAdmin(locale, "schedule");
  }

  saveWorkingHours({
    employeeSlug: normalize(formData.get("employeeSlug")),
    weekday: Number(normalize(formData.get("weekday")) || 0),
    start: start || "00:00",
    end: end || "00:00",
    isOff
  });

  redirectToAdmin(locale, "schedule");
}

export async function addBlockedTimeAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  const start = normalize(formData.get("start"));
  const end = normalize(formData.get("end"));

  if (!start || !end || !isValidTimeRange(start, end)) {
    redirectToAdmin(locale, "schedule");
  }

  addBlockedTime({
    employeeSlug: normalize(formData.get("employeeSlug")),
    date: normalize(formData.get("date")),
    start,
    end,
    reason: normalize(formData.get("reason")) || undefined
  });

  redirectToAdmin(locale, "schedule");
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

  redirectToAdmin(locale, "galleryPage");
}

export async function deleteGalleryAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));
  deleteGalleryImage(normalize(formData.get("slug")));
  redirectToAdmin(locale, "galleryPage");
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

  redirectToAdmin(locale, "contactPage");
}

export async function updateHomepageHeroContentAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveHomepageHeroContent({
    locale,
    kicker: normalize(formData.get("heroKicker")),
    subtitle: normalize(formData.get("heroSubtitle")),
    title: normalize(formData.get("heroTitle"))
  });

  redirectToAdmin(locale, "homePage");
}

export async function updateHomepageCounterOverridesAction(formData: FormData) {
  const locale = await authorize(normalize(formData.get("locale")));

  saveHomepageCounterOverrides({
    employees: parseOptionalNonNegativeInt(formData.get("counterEmployees")),
    maxCustomersDaily: parseOptionalNonNegativeInt(formData.get("counterMaxCustomersDaily")),
    maxAppointmentsDaily: parseOptionalNonNegativeInt(formData.get("counterMaxAppointmentsDaily")),
    allBookings: parseOptionalNonNegativeInt(formData.get("counterAllBookings"))
  });

  redirectToAdmin(locale, "settings");
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
