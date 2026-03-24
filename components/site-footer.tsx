import type { Route } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
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
  return <FontAwesomeIcon icon={faInstagram} width={20} height={20} aria-hidden="true" />;
}

function TikTokIcon() {
  return <FontAwesomeIcon icon={faTiktok} width={20} height={20} aria-hidden="true" />;
}

function MapPinIcon() {
  return <FontAwesomeIcon icon={faLocationDot} width={14} height={14} aria-hidden="true" />;
}

function PhoneIcon() {
  return <FontAwesomeIcon icon={faPhone} width={14} height={14} aria-hidden="true" />;
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
