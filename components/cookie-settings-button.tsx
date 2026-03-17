"use client";

import { COOKIE_PREFERENCES_OPEN_EVENT } from "@/lib/cookie-consent";

type CookieSettingsButtonProps = {
  label: string;
};

export function CookieSettingsButton({ label }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_PREFERENCES_OPEN_EVENT))}
      style={{
        border: 0,
        background: "transparent",
        color: "inherit",
        padding: 0,
        cursor: "pointer"
      }}
    >
      {label}
    </button>
  );
}
