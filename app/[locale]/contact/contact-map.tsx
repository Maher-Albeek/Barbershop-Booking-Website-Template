"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_PREFERENCES_CHANGED_EVENT,
  COOKIE_PREFERENCES_OPEN_EVENT,
  readStoredCookiePreferences
} from "@/lib/cookie-consent";

type ContactMapProps = {
  shopName: string;
  embedUrl: string;
  directionsHref: string;
  directionsLabel: string;
  consentTitle: string;
  consentDescription: string;
  consentButtonLabel: string;
  privacyNotice: string;
};

export function ContactMap({
  shopName,
  embedUrl,
  directionsHref,
  directionsLabel,
  consentTitle,
  consentDescription,
  consentButtonLabel,
  privacyNotice
}: ContactMapProps) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    function syncConsent() {
      setHasConsent(Boolean(readStoredCookiePreferences()?.functional));
    }

    syncConsent();
    window.addEventListener(COOKIE_PREFERENCES_CHANGED_EVENT, syncConsent);

    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_CHANGED_EVENT, syncConsent);
    };
  }, []);

  function handleConsent() {
    window.dispatchEvent(new Event(COOKIE_PREFERENCES_OPEN_EVENT));
  }

  if (!hasConsent) {
    return (
      <div style={{ display: "grid", gap: 18 }}>
        <div
          style={{
            borderRadius: 24,
            border: "1px solid var(--border)",
            minHeight: 340,
            padding: 24,
            background:
              "linear-gradient(135deg, rgba(214, 176, 125, 0.16), rgba(34, 51, 59, 0.08))",
            display: "grid",
            alignContent: "center",
            gap: 14
          }}
        >
          <strong style={{ fontSize: 22 }}>{consentTitle}</strong>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
            {consentDescription}
          </p>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{privacyNotice}</p>
          <button
            type="button"
            onClick={handleConsent}
            style={{
              justifySelf: "start",
              border: "none",
              borderRadius: 999,
              padding: "13px 18px",
              background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
              color: "#fffaf4",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {consentButtonLabel}
          </button>
        </div>

        <a
          href={directionsHref}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            justifyContent: "center",
            justifySelf: "start",
            padding: "13px 18px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "rgba(214, 176, 125, 0.12)",
            color: "var(--foreground)",
            fontWeight: 700
          }}
        >
          {directionsLabel}
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div
        style={{
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid var(--border)",
          minHeight: 340
        }}
      >
        <iframe
          title={`${shopName} map`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            width: "100%",
            height: "100%",
            minHeight: 340,
            border: 0
          }}
        />
      </div>

      <a
        href={directionsHref}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex",
          justifyContent: "center",
          justifySelf: "start",
          padding: "13px 18px",
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: "rgba(214, 176, 125, 0.12)",
          color: "var(--foreground)",
          fontWeight: 700
        }}
      >
        {directionsLabel}
      </a>
    </div>
  );
}
