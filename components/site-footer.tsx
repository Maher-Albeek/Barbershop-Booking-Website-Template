import type { Route } from "next";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { getDictionary, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

function localeHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const dictionary = getDictionary(locale);

  return (
    <footer
      style={{
        padding: "0 20px 32px"
      }}
    >
      <div
        className="page-container page-header"
        style={{
          border: "1px solid var(--border)",
          background: "var(--surface)",
          boxShadow: "var(--shadow)",
          display: "flex",
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <strong>{siteConfig.brand.shopName}</strong>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>{dictionary.footer.legalLabel}</span>
        </div>

        <nav
          className="page-nav"
          aria-label={dictionary.footer.legalLabel}
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <Link href={localeHref(locale, "/impressum")}>{dictionary.footer.impressum}</Link>
          <Link href={localeHref(locale, "/datenschutz")}>{dictionary.footer.datenschutz}</Link>
          <CookieSettingsButton label={dictionary.footer.cookieSettings} />
        </nav>
      </div>
    </footer>
  );
}
