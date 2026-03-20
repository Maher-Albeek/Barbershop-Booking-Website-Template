import Link from "next/link";
import type { ReactNode } from "react";
import { logoutUser } from "../login/actions";

type AdminShellProps = {
  locale: string;
  displayName?: string;
  activePath?: string;
  children: ReactNode;
};

const adminNavItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/email", label: "Email" },
  { href: "/admin/contact", label: "Contact" }
] as const;

export const sectionStyle = {
  border: "1px solid var(--border)",
  borderRadius: 28,
  background: "var(--surface)",
  boxShadow: "var(--shadow)",
  padding: "clamp(18px, 3vw, 24px)",
  display: "grid",
  gap: 18
} as const;

export const surfaceCardStyle = {
  border: "1px solid var(--border)",
  borderRadius: 20,
  padding: 16,
  background: "var(--surface-strong)"
} as const;

export const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "var(--surface-strong)"
} as const;

export const gridTwo = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14
} as const;

export const localeLabels = { en: "Englisch", de: "Deutsch", ar: "Arabisch" } as const;

export const weekdayLabels = [
  { value: 1, label: "Mo" },
  { value: 2, label: "Di" },
  { value: 3, label: "Mi" },
  { value: 4, label: "Do" },
  { value: 5, label: "Fr" },
  { value: 6, label: "Sa" },
  { value: 0, label: "So" }
] as const;

export function AdminShell({ locale, displayName, activePath = "/admin", children }: AdminShellProps) {
  return (
    <main style={{ minHeight: "100vh", padding: "clamp(20px, 4vw, 32px) 20px 56px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gap: 20 }}>
        <header
          style={{
            ...sectionStyle,
            background:
              "linear-gradient(140deg, rgba(34, 51, 59, 0.96), rgba(61, 38, 21, 0.88) 56%, rgba(139, 94, 60, 0.82))",
            color: "#fffaf4"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: 10 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(255, 250, 244, 0.72)"
                }}
              >
                ADMIN-001 to ADMIN-012
              </p>
              <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 2.5rem)" }}>
                Verwaltungszentrale
              </h1>
              <p
                style={{
                  margin: 0,
                  maxWidth: 760,
                  lineHeight: 1.7,
                  color: "rgba(255, 250, 244, 0.82)"
                }}
              >
                Angemeldet als {displayName ?? "Mitarbeiter"}. Hier verwalten Sie die
                wiederverwendbaren Admin-Funktionen der Vorlage.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "start", flexWrap: "wrap" }}>
              <Link href={`/${locale}`}>Oeffentliche Seite</Link>
              <Link href={`/${locale}/booking`}>Buchungsstrecke</Link>
              <form action={logoutUser}>
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  style={{
                    border: "1px solid rgba(255, 250, 244, 0.2)",
                    borderRadius: 999,
                    background: "rgba(255, 250, 244, 0.1)",
                    color: "#fffaf4",
                    padding: "10px 16px",
                    cursor: "pointer"
                  }}
                >
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </header>

        <nav
          aria-label="Admin navigation"
          style={{
            ...sectionStyle,
            padding: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))"
          }}
        >
          {adminNavItems.map((item) => {
            const isActive = activePath === item.href;

            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                style={{
                  borderRadius: 16,
                  padding: "14px 16px",
                  textAlign: "center",
                  textDecoration: "none",
                  border: isActive ? "1px solid transparent" : "1px solid var(--border)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(139, 94, 60, 0.22), rgba(34, 51, 59, 0.14))"
                    : "var(--surface-strong)",
                  color: "inherit",
                  fontWeight: 700,
                  boxShadow: isActive ? "var(--shadow)" : "none"
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </main>
  );
}

export function LocaleFields({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ ...surfaceCardStyle, display: "grid", gap: 12 }}>
      <strong>{title}</strong>
      {children}
    </div>
  );
}

export function SectionTitle({ story, title }: { story: string; title: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted)"
        }}
      >
        {story}
      </div>
      <h2 style={{ margin: "8px 0 0", fontSize: "clamp(1.6rem, 3vw, 1.75rem)" }}>{title}</h2>
    </div>
  );
}
