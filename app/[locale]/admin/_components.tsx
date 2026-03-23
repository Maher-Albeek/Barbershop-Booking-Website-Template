import Link from "next/link";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { logoutUser } from "../login/actions";
import { AdminSidebar } from "./_sidebar";

type AdminShellProps = {
  locale: string;
  children: ReactNode;
};

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

export const localeLabels = { en: "English", de: "Deutsch", ar: "Arabic" } as const;

export const weekdayLabels = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" }
] as const;

export async function AdminShell({ locale, children }: AdminShellProps) {
  const session = await getSession();

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
                ADMIN-001 to ADMIN-017
              </p>
              <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 2.5rem)" }}>
                Business control center
              </h1>
              <p
                style={{
                  margin: 0,
                  maxWidth: 760,
                  lineHeight: 1.7,
                  color: "rgba(255, 250, 244, 0.82)"
                }}
              >
                Signed in as {session?.displayName ?? "staff user"}. This route manages the reusable
                admin feature set for the template.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "start", flexWrap: "wrap" }}>
              <Link href={`/${locale}`}>Public site</Link>
              <Link href={`/${locale}/booking`}>Booking flow</Link>
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
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <AdminSidebar locale={locale} />
          <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 20 }}>
            {children}
          </div>
        </div>
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
