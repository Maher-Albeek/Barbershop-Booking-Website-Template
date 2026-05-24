"use client";

import { useState } from "react";
import type { HeroImageKey } from "@/lib/hero-image";
import { uploadContentBackgroundImageAction, uploadHeroImageAction } from "./actions";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "var(--surface-strong)"
} as const;

type HeroImageManagerProps = {
  locale: string;
  page: HeroImageKey;
  initialImageUrl?: string;
  kind?: "hero" | "content";
};

export function HeroImageManager({
  locale,
  page,
  initialImageUrl = "",
  kind = "hero"
}: HeroImageManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [altText, setAltText] = useState("");
  const [imageFormat, setImageFormat] = useState<"avif" | "webp" | "jpg">("avif");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const imageLabel = kind === "hero" ? "hero image" : "content background image";
  const inputId = `${kind}-image-input-${page}`;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", imageFormat);
      formData.append("locale", locale);
      formData.append("alt", altText);
      formData.append("page", page);

      const result =
        kind === "hero"
          ? await uploadHeroImageAction(formData)
          : await uploadContentBackgroundImageAction(formData);

      if (result.success && result.imageUrl) {
        setImageUrl(result.imageUrl);
        setSuccess(`Image uploaded as ${imageFormat.toUpperCase()}`);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText || `${page} ${imageLabel}`}
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 18 }}
        />
      ) : null}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: "2px dashed",
          borderColor: isDragging ? "#8b5e3c" : "rgba(79, 44, 23, 0.14)",
          borderRadius: 14,
          padding: "32px",
          textAlign: "center",
          background: isDragging ? "rgba(139, 94, 60, 0.08)" : "transparent",
          cursor: "pointer",
          transition: "all 0.15s"
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          disabled={isUploading}
          style={{ display: "none" }}
          id={inputId}
        />
        <label htmlFor={inputId} style={{ cursor: "pointer", display: "block" }}>
          <p style={{ margin: "0 0 8px", fontWeight: 700 }}>
            Drag & drop image or click to select
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>
            Supported formats: JPG, PNG, WebP
          </p>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            Output Format
          </label>
          <select
            value={imageFormat}
            onChange={(e) => setImageFormat(e.target.value as "avif" | "webp" | "jpg")}
            disabled={isUploading}
            style={inputStyle}
          >
            <option value="avif">AVIF (smallest)</option>
            <option value="webp">WebP (modern)</option>
            <option value="jpg">JPG (compatible)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            Alt Text
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Image description"
            disabled={isUploading}
            style={inputStyle}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            borderRadius: 14,
            background: "rgba(220, 38, 38, 0.1)",
            color: "#7f1d1d"
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: 12,
            borderRadius: 14,
            background: "rgba(34, 197, 94, 0.1)",
            color: "#15803d"
          }}
        >
          {success}
        </div>
      )}

    </div>
  );
}
