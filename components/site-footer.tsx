import type { Route } from "next";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { getDictionary, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import styles from "./site-footer.module.css";

function localeHref(locale: Locale, path: string): Route {
  return `/${locale}${path}` as Route;
}

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const dictionary = getDictionary(locale);

  return (
    <footer className={styles.footerShell}>
      <div className={styles.footerFrame}>
        <div className={styles.footerGlow} aria-hidden="true" />

        <div className={styles.footerBody}>
          <div className={styles.brandBlock}>
          <strong>{siteConfig.brand.shopName}</strong>
            <span className={styles.legalLabel}>{dictionary.footer.legalLabel}</span>
          </div>

          <nav aria-label={dictionary.footer.legalLabel} className={styles.nav}>
            <Link className={styles.linkPill} href={localeHref(locale, "/impressum")}>
              {dictionary.footer.impressum}
            </Link>
            <Link className={styles.linkPill} href={localeHref(locale, "/datenschutz")}>
              {dictionary.footer.datenschutz}
            </Link>
            <span className={styles.linkPill}>
              <CookieSettingsButton label={dictionary.footer.cookieSettings} />
            </span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
