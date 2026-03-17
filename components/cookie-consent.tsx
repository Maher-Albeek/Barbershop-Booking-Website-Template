"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Route } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import {
  COOKIE_PREFERENCES_OPEN_EVENT,
  buildCookiePreferences,
  defaultCookiePreferences,
  persistCookiePreferences,
  readStoredCookiePreferences,
  type CookiePreferences
} from "@/lib/cookie-consent";

type CookieConsentProps = {
  locale: Locale;
};

export function CookieConsent({ locale }: CookieConsentProps) {
  const dictionary = getDictionary(locale);
  const [isReady, setIsReady] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultCookiePreferences);

  useEffect(() => {
    const stored = readStoredCookiePreferences();

    if (stored) {
      setPreferences(stored);
    }

    setIsReady(true);

    function handleOpen() {
      setShowCustomize(true);
      setIsPanelOpen(true);
    }

    window.addEventListener(COOKIE_PREFERENCES_OPEN_EVENT, handleOpen);

    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_OPEN_EVENT, handleOpen);
    };
  }, []);

  if (!isReady) {
    return null;
  }

  const hasDecision = preferences.consentGiven;
  const panelVisible = isPanelOpen || !hasDecision;
  const privacyHref = `/${locale}/datenschutz` as Route;

  function store(next: CookiePreferences) {
    setPreferences(next);
    persistCookiePreferences(next);
    setIsPanelOpen(false);
    setShowCustomize(false);
  }

  function acceptAll() {
    store(buildCookiePreferences({ functional: true, analytics: true, consentGiven: true }));
  }

  function rejectOptional() {
    store(buildCookiePreferences({ functional: false, analytics: false, consentGiven: true }));
  }

  function saveCurrent() {
    store(
      buildCookiePreferences({
        functional: preferences.functional,
        analytics: preferences.analytics,
        consentGiven: true
      })
    );
  }

  return panelVisible ? (
    <div
      style={{
        position: "fixed",
        inset: "auto 16px 16px 16px",
        zIndex: 60,
        display: "grid",
        justifyItems: "end",
        pointerEvents: "none"
      }}
    >
      <section
        aria-label={dictionary.cookies.title}
        style={{
          width: "min(100%, 460px)",
          borderRadius: 28,
          border: "1px solid var(--border)",
          background: "rgba(255, 250, 244, 0.98)",
          boxShadow: "0 28px 80px rgba(34, 22, 14, 0.24)",
          padding: 22,
          display: "grid",
          gap: 16,
          pointerEvents: "auto"
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <strong style={{ fontSize: 22 }}>{dictionary.cookies.title}</strong>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
            {dictionary.cookies.description}{" "}
            <Link href={privacyHref} style={{ textDecoration: "underline" }}>
              {dictionary.footer.datenschutz}
            </Link>
          </p>
        </div>

        {showCustomize ? (
          <div style={{ display: "grid", gap: 12 }}>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
              {dictionary.cookies.customizeTitle}
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <PreferenceRow
                title={dictionary.cookies.essentialTitle}
                description={dictionary.cookies.essentialDescription}
                checked
                disabled
                badge={dictionary.cookies.alwaysOn}
              />
              <PreferenceRow
                title={dictionary.cookies.functionalTitle}
                description={dictionary.cookies.functionalDescription}
                checked={preferences.functional}
                onChange={(checked) => setPreferences((current) => ({ ...current, functional: checked }))}
              />
              <PreferenceRow
                title={dictionary.cookies.analyticsTitle}
                description={dictionary.cookies.analyticsDescription}
                checked={preferences.analytics}
                onChange={(checked) => setPreferences((current) => ({ ...current, analytics: checked }))}
              />
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "flex-end"
          }}
        >
          {hasDecision ? (
            <button
              type="button"
              onClick={() => {
                setIsPanelOpen(false);
                setShowCustomize(false);
              }}
              style={secondaryButtonStyle}
            >
              {dictionary.cookies.close}
            </button>
          ) : null}
          <button type="button" onClick={rejectOptional} style={secondaryButtonStyle}>
            {dictionary.cookies.rejectAll}
          </button>
          {showCustomize ? (
            <button type="button" onClick={saveCurrent} style={primaryButtonStyle}>
              {dictionary.cookies.save}
            </button>
          ) : (
            <button type="button" onClick={() => setShowCustomize(true)} style={secondaryButtonStyle}>
              {dictionary.cookies.customize}
            </button>
          )}
          {!showCustomize ? (
            <button type="button" onClick={acceptAll} style={primaryButtonStyle}>
              {dictionary.cookies.acceptAll}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  ) : null;
}

function PreferenceRow({
  title,
  description,
  checked,
  disabled,
  badge,
  onChange
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label
      style={{
        borderRadius: 20,
        border: "1px solid var(--border)",
        background: "var(--surface-strong)",
        padding: 14,
        display: "grid",
        gap: 8
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <strong>{title}</strong>
          <span style={{ color: "var(--muted)", lineHeight: 1.5 }}>{description}</span>
        </div>
        {disabled ? (
          <span
            style={{
              borderRadius: 999,
              padding: "4px 10px",
              background: "rgba(34, 51, 59, 0.08)",
              whiteSpace: "nowrap",
              fontSize: 12,
              fontWeight: 700
            }}
          >
            {badge}
          </span>
        ) : (
          <input type="checkbox" checked={checked} onChange={(event) => onChange?.(event.target.checked)} />
        )}
      </div>
    </label>
  );
}

const primaryButtonStyle = {
  border: 0,
  borderRadius: 999,
  padding: "12px 16px",
  background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
  color: "#fffaf4",
  fontWeight: 700,
  cursor: "pointer"
} as const;

const secondaryButtonStyle = {
  border: "1px solid var(--border)",
  borderRadius: 999,
  padding: "12px 16px",
  background: "var(--surface-strong)",
  color: "var(--foreground)",
  fontWeight: 700,
  cursor: "pointer"
} as const;
