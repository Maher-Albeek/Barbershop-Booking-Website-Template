import Link from "next/link";
import type { ReactNode } from "react";
import { logoutUser } from "../login/actions";

type EmployeeShellProps = {
  locale: string;
  title: string;
  description: string;
  active: "dashboard" | "bookings" | "schedule";
  displayName: string;
  children: ReactNode;
};

const shellWidth = 1080;

export function EmployeeShell({
  locale,
  title,
  description,
  active,
  displayName,
  children
}: EmployeeShellProps) {
  const navItems = [
    { href: `/${locale}/employee/dashboard`, label: "Dashboard", key: "dashboard" },
    { href: `/${locale}/employee/bookings`, label: "Bookings", key: "bookings" },
    { href: `/${locale}/employee/schedule`, label: "Schedule", key: "schedule" }
  ] as const;

  return (
    <main style={{ minHeight: "100vh", padding: "32px 20px 56px" }}>
      <div style={{ maxWidth: shellWidth, margin: "0 auto", display: "grid", gap: 20 }}>
        <header
          style={{
            border: "1px solid var(--border)",
            borderRadius: 28,
            background: "var(--surface)",
            padding: 24,
            boxShadow: "var(--shadow)",
            display: "grid",
            gap: 16
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: 8 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--muted)"
                }}
              >
                Employee dashboard
              </p>
              <h1 style={{ margin: 0, fontSize: 34 }}>{title}</h1>
              <p style={{ margin: 0, lineHeight: 1.6, color: "var(--muted)", maxWidth: 720 }}>
                {description}
              </p>
            </div>
            <div style={{ display: "grid", gap: 10, justifyItems: "end" }}>
              <strong>{displayName}</strong>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Link href={`/${locale}`}>Public site</Link>
                <form action={logoutUser}>
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 999,
                      background: "var(--surface-strong)",
                      padding: "10px 16px",
                      cursor: "pointer"
                    }}
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {navItems.map((item) => {
              const isActive = item.key === active;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 999,
                    padding: "10px 16px",
                    background: isActive ? "var(--brand-primary)" : "var(--surface-strong)",
                    color: isActive ? "#fff" : "inherit",
                    textDecoration: "none",
                    fontWeight: 600
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {children}
      </div>
    </main>
  );
}

export const cardStyle = {
  border: "1px solid var(--border)",
  borderRadius: 24,
  background: "var(--surface)",
  padding: 20
} as const;

export const inputStyle = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "var(--surface-strong)",
  color: "inherit",
  padding: "12px 14px"
} as const;
