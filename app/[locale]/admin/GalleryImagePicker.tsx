"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";

type GalleryImagePickerProps = {
  name: string;
  initialPreview?: string;
};

const hiddenInputStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
} as const;

export function GalleryImagePicker({ name, initialPreview }: GalleryImagePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewSrc, setPreviewSrc] = useState(initialPreview ?? "");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreviewSrc(initialPreview ?? "");
  }, [initialPreview]);

  useEffect(() => {
    return () => {
      if (previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  function updatePreview(file: File | null) {
    setFileName(file?.name ?? "");
    setPreviewSrc((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return file ? URL.createObjectURL(file) : initialPreview ?? "";
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updatePreview(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !inputRef.current) {
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputRef.current.files = transfer.files;
    updatePreview(file);
  }

  return (
    <label
      htmlFor={inputId}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{
        display: "grid",
        gap: 12,
        padding: 14,
        borderRadius: 18,
        border: `1px dashed ${isDragging ? "var(--brand-primary)" : "var(--border)"}`,
        background: isDragging ? "rgba(139, 94, 60, 0.08)" : "var(--surface-strong)",
        cursor: "pointer"
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={hiddenInputStyle}
      />
      <div style={{ display: "grid", gap: 4 }}>
        <strong>Drop image here or click to browse</strong>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>
          {fileName || "Accepted: JPG, PNG, WEBP, GIF, SVG"}
        </span>
      </div>
      {previewSrc ? (
        <img
          src={previewSrc}
          alt="Selected gallery preview"
          style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 14 }}
        />
      ) : null}
    </label>
  );
}
