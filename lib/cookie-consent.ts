export const COOKIE_PREFERENCES_STORAGE_KEY = "barbershop-cookie-preferences";
export const COOKIE_PREFERENCES_CHANGED_EVENT = "barbershop-cookie-preferences-changed";
export const COOKIE_PREFERENCES_OPEN_EVENT = "barbershop-open-cookie-settings";

export type CookiePreferences = {
  essential: true;
  functional: boolean;
  analytics: boolean;
  consentGiven: boolean;
  updatedAt: string;
};

export const defaultCookiePreferences: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  consentGiven: false,
  updatedAt: ""
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function buildCookiePreferences(
  input: Pick<CookiePreferences, "functional" | "analytics" | "consentGiven">
): CookiePreferences {
  return {
    essential: true,
    functional: input.functional,
    analytics: input.analytics,
    consentGiven: input.consentGiven,
    updatedAt: new Date().toISOString()
  };
}

export function parseCookiePreferences(value: string | null): CookiePreferences | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!isObject(parsed)) {
      return null;
    }

    return {
      essential: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      consentGiven: Boolean(parsed.consentGiven),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : ""
    };
  } catch {
    return null;
  }
}

export function readStoredCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseCookiePreferences(window.localStorage.getItem(COOKIE_PREFERENCES_STORAGE_KEY));
}

export function persistCookiePreferences(preferences: CookiePreferences) {
  window.localStorage.setItem(COOKIE_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new CustomEvent(COOKIE_PREFERENCES_CHANGED_EVENT, { detail: preferences }));
}
