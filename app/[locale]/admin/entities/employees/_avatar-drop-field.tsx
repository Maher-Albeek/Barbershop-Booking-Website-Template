"use client";

import { useId, useState, type ChangeEvent, type DragEvent } from "react";

type AvatarDropFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
};

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read image."));
    };

    reader.onerror = () => {
      reject(new Error("Could not read image."));
    };

    reader.readAsDataURL(file);
  });
}

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read converted image."));
    };

    reader.onerror = () => {
      reject(new Error("Could not read converted image."));
    };

    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not decode image."));
    image.src = src;
  });
}

async function convertImageFileToAvifDataUrl(file: File) {
  const sourceDataUrl = await readImageAsDataUrl(file);
  const image = await loadImage(sourceDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not prepare image canvas.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const avifBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/avif", 0.82);
  });

  if (avifBlob && avifBlob.type === "image/avif") {
    return readBlobAsDataUrl(avifBlob);
  }

  const webpBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.86);
  });

  if (webpBlob && webpBlob.type === "image/webp") {
    return readBlobAsDataUrl(webpBlob);
  }

  return sourceDataUrl;
}

export function AvatarDropField({ name, label, defaultValue = "" }: AvatarDropFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputId = useId();

  async function applyFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please drop or choose an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Image is too large. Maximum file size is 2 MB.");
      return;
    }

    try {
      const optimizedDataUrl = await convertImageFileToAvifDataUrl(file);
      setValue(optimizedDataUrl);
      setError("");
    } catch {
      setError("Could not process image.");
    }
  }

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      await applyFile(file);
    }

    event.target.value = "";
  }

  async function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      await applyFile(file);
    }
  }

  function onDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 12,
        display: "grid",
        gap: 10,
        background: "var(--surface-strong)"
      }}
    >
      <input type="hidden" name={name} value={value} />
      <label htmlFor={inputId} style={{ fontWeight: 700 }}>
        {label}
      </label>

      <div
        onDrop={(event) => {
          void onDrop(event);
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          border: isDragging ? "2px solid var(--brand-primary)" : "1px dashed var(--border)",
          borderRadius: 14,
          background: isDragging ? "rgba(139, 94, 60, 0.08)" : "rgba(255, 255, 255, 0.7)",
          padding: "14px 12px",
          textAlign: "center",
          color: "var(--muted)"
        }}
      >
        Drag and drop avatar image here
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label
          htmlFor={inputId}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "9px 12px",
            cursor: "pointer",
            background: "#fff"
          }}
        >
          Choose file
        </label>
        <input id={inputId} type="file" accept="image/*" hidden onChange={(event) => void onFileChange(event)} />
        <button
          type="button"
          onClick={() => {
            setValue("");
            setError("");
          }}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "9px 12px",
            cursor: "pointer",
            background: "#fff"
          }}
        >
          Clear
        </button>
      </div>

      {error ? <p style={{ margin: 0, color: "#8f2a17", fontSize: 13 }}>{error}</p> : null}

      {value ? (
        <img
          src={value}
          alt={`${label} preview`}
          style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12 }}
        />
      ) : null}
    </div>
  );
}