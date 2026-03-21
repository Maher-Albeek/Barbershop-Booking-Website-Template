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

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.26 8.26 0 0 0 4.83 1.55V7.17a4.85 4.85 0 0 1-1.06-.48z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const dictionary = getDictionary(locale);
  const contact = siteConfig.contact[locale];
  const { brand } = siteConfig;

  return (
    <footer className={styles.footerShell}>
      <div className={styles.footerFrame}>
        <div className={styles.footerGlow} aria-hidden="true" />

        <div className={styles.footerBody}>
          {/* Column 1: Brand */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>{brand.shopName}</h3>
            <hr className={styles.columnRule} />
            <p className={styles.tagline}>{dictionary.footer.tagline}</p>
            {(brand.socials?.instagram || brand.socials?.tiktok) && (
              <div className={styles.socialLinks}>
                {brand.socials.instagram && (
                  <a
                    href={brand.socials.instagram}
                    className={styles.socialIcon}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {brand.socials.tiktok && (
                  <a
                    href={brand.socials.tiktok}
                    className={styles.socialIcon}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                  >
                    <TikTokIcon />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Location */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>{dictionary.footer.locationTitle}</h3>
            <hr className={styles.columnRule} />
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPinIcon />
                <span>{contact.items.address.value}</span>
              </li>
              {contact.items.phone.href ? (
                <li className={styles.contactItem}>
                  <PhoneIcon />
                  <a href={contact.items.phone.href} className={styles.contactLink}>
                    {contact.items.phone.value}
                  </a>
                </li>
              ) : (
                <li className={styles.contactItem}>
                  <PhoneIcon />
                  <span>{contact.items.phone.value}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Working Hours */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>{contact.workingHoursTitle}</h3>
            <hr className={styles.columnRule} />
            <ul className={styles.hoursList}>
              {contact.workingHours.map((entry) => (
                <li key={entry.days} className={styles.hoursItem}>
                  <strong className={styles.hoursDay}>{entry.days}</strong>
                  <span className={styles.hoursTime}>{entry.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className={`${styles.column} ${styles.legalColumn}`}>
            <h3 className={styles.columnHeading}>{dictionary.footer.legalLinksTitle}</h3>
            <hr className={styles.columnRule} />
            <nav aria-label={dictionary.footer.legalLabel} className={styles.legalNav}>
              <Link className={styles.legalLink} href={localeHref(locale, "/datenschutz")}>
                {dictionary.footer.datenschutz}
              </Link>
              <Link className={styles.legalLink} href={localeHref(locale, "/impressum")}>
                {dictionary.footer.impressum}
              </Link>
              <span className={styles.legalLink}>
                <CookieSettingsButton label={dictionary.footer.cookieSettings} />
              </span>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
