import { readdirSync } from "fs";
import { join } from "path";
import type { CSSProperties } from "react";
import type { HeroImageKey } from "@/lib/hero-image";

function getContentBackgroundUploadDirectory(page: HeroImageKey) {
  return join(process.cwd(), "public", "content-backgrounds", page);
}

function getLatestFileUrl(directoryPath: string, publicPath: string) {
  const files = readdirSync(directoryPath)
    .filter((fileName) => !fileName.startsWith("."))
    .sort();

  if (files.length === 0) {
    return null;
  }

  return `${publicPath}/${files[files.length - 1]}`;
}

export function getUploadedContentBackgroundImageUrl(page: HeroImageKey) {
  try {
    return getLatestFileUrl(getContentBackgroundUploadDirectory(page), `/content-backgrounds/${page}`);
  } catch {
    return null;
  }
}

export function getContentBackgroundImageUrl(page: HeroImageKey) {
  return getUploadedContentBackgroundImageUrl(page) ?? (page === "home" ? null : getUploadedContentBackgroundImageUrl("home"));
}

export function getContentSectionContainerStyle(page: HeroImageKey): CSSProperties {
  const imageUrl = getContentBackgroundImageUrl(page);

  return {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px 20px 56px",
    borderRadius: imageUrl ? 30 : undefined,
    border: imageUrl ? "1px solid rgba(79, 44, 23, 0.16)" : undefined,
    background: imageUrl
      ? `linear-gradient(140deg, rgba(255, 250, 244, 0.9), rgba(247, 241, 232, 0.84)), url('${imageUrl}') center/cover no-repeat`
      : undefined,
    boxShadow: imageUrl ? "0 20px 45px rgba(34, 22, 14, 0.1)" : undefined
  };
}