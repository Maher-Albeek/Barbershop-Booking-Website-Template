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

  if (!imageUrl) {
    return {
      maxWidth: 1200,
      margin: "0 auto",
      minHeight: "100svh",
      padding: "24px 20px 56px",
      display: "grid",
      alignContent: "start"
    };
  }

  
  return {
    width: "100vw",
    marginLeft: "calc(50% - 50vw)",
    marginRight: "calc(50% - 50vw)",
    minHeight: "100svh",
    display: "grid",
    alignContent: "start",
    padding: "64px clamp(20px, calc((100vw - 1200px) / 2 + 20px), 240px) 56px",
    background:
      `linear-gradient(146deg, rgba(10, 7, 5, 0.72), rgba(10, 7, 5, 0.9)), url('${imageUrl}') center/cover no-repeat`,
    backdropFilter: "blur(140px)",
    WebkitBackdropFilter: "blur(140px)"
  };
}