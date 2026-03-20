import { readdirSync } from "fs";
import { join } from "path";

const fallbackHeroImageUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2322333b'/%3E%3Cstop offset='55%25' stop-color='%234f2c17'/%3E%3Cstop offset='100%25' stop-color='%238b5e3c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='url(%23bg)'/%3E%3Ccircle cx='1220' cy='180' r='190' fill='rgba(214,176,125,0.18)'/%3E%3Ccircle cx='260' cy='760' r='260' fill='rgba(255,250,244,0.08)'/%3E%3C/svg%3E";
export const heroImageKeys = ["home", "services", "team", "gallery", "offers", "contact", "booking"] as const;

export type HeroImageKey = (typeof heroImageKeys)[number];

function getHeroUploadDirectory(page: HeroImageKey) {
  return join(process.cwd(), "public", "heros", page);
}

function getPreviousHeroUploadDirectory(page: HeroImageKey) {
  return join(process.cwd(), "public", "uploads", "hero", page);
}

function getLegacyHeroUploadDirectory() {
  return join(process.cwd(), "public", "uploads", "hero");
}

function getLatestFileUrl(directoryPath: string, publicPath: string) {
  const heroFiles = readdirSync(directoryPath)
    .filter((fileName) => !fileName.startsWith("."))
    .sort();

  if (heroFiles.length === 0) {
    return null;
  }

  return `${publicPath}/${heroFiles[heroFiles.length - 1]}`;
}

export function isHeroImageKey(value: string): value is HeroImageKey {
  return heroImageKeys.includes(value as HeroImageKey);
}

export function getUploadedHeroImageUrl(page: HeroImageKey) {
  try {
    return getLatestFileUrl(getHeroUploadDirectory(page), `/heros/${page}`);
  } catch {
    // Fall through to compatibility paths.
  }

  try {
    return getLatestFileUrl(getPreviousHeroUploadDirectory(page), `/uploads/hero/${page}`);
  } catch {
    if (page !== "home") {
      return null;
    }
  }

  try {
    return getLatestFileUrl(getLegacyHeroUploadDirectory(), "/uploads/hero");
  } catch {
    return null;
  }
}

export function getHeroImageUrl(page: HeroImageKey) {
  return getUploadedHeroImageUrl(page) ?? (page === "home" ? fallbackHeroImageUrl : getUploadedHeroImageUrl("home") ?? fallbackHeroImageUrl);
}