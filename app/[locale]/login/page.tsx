import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";
import type { AuthRole } from "@/lib/auth-users";
import { loginUser } from "./actions";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    role?: string;
    redirectTo?: string;
    error?: string;
  }>;
};

function normalizeRole(value?: string): AuthRole {
  return value === "admin" ? "admin" : "employee";
}

function getErrorMessage(error?: string) {
  switch (error) {
    case "missing_fields":
      return "Bitte E-Mail und Passwort eingeben.";
    case "invalid_credentials":
      return "Die E-Mail oder das Passwort ist ungueltig.";
    case "forbidden_role":
      return "Dieses Konto darf den angeforderten Bereich nicht aufrufen.";
    default:
      return "";
  }
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const query = await searchParams;
  const session = await getSession();
  const role = normalizeRole(query.role);
  const redirectTo =
    query.redirectTo && query.redirectTo.startsWith(`/${locale}/`) ? query.redirectTo : `/${locale}/${role}`;
  const errorMessage = getErrorMessage(query.error);

  return (
    <main
      lang={locale}
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top, rgba(192, 153, 107, 0.18), transparent 40%), var(--background)"
      }}
    >
      <section
        style={{
          width: "min(100%, 460px)",
          border: "1px solid var(--border)",
          borderRadius: 28,
          background: "var(--surface)",
          boxShadow: "var(--shadow)",
          padding: 28
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--muted)"
          }}
        >
          Sicherer Login
        </p>
        <h1 style={{ margin: "12px 0 8px", fontSize: 32 }}>
          {role === "admin" ? "Admin-Anmeldung" : "Mitarbeiter-Anmeldung"}
        </h1>
        <p style={{ margin: 0, lineHeight: 1.6, color: "var(--muted)" }}>
          {role === "admin"
            ? "Nur Admin-Konten koennen Admin-Routen oeffnen."
            : "Mitarbeiter sehen nur ihr eigenes Dashboard, Admin-Bereiche bleiben geschuetzt."}
        </p>

        {errorMessage ? (
          <div
            style={{
              marginTop: 18,
              borderRadius: 18,
              padding: "14px 16px",
              background: "rgba(128, 45, 32, 0.12)",
              border: "1px solid rgba(128, 45, 32, 0.28)"
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        <form action={loginUser} style={{ display: "grid", gap: 14, marginTop: 20 }}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="role" value={role} />
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <label style={{ display: "grid", gap: 8 }}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              defaultValue={role === "admin" ? "admin@crownblade.local" : "samir@crownblade.local"}
              style={{
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                padding: "12px 14px"
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span>Passwort</span>
            <input
              type="password"
              name="password"
              defaultValue={role === "admin" ? "AdminPass!2026" : "EmployeePass!2026"}
              style={{
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                padding: "12px 14px"
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: 6,
              border: 0,
              borderRadius: 999,
              padding: "14px 18px",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
              color: "#fffaf4"
            }}
          >
            Sign in
          </button>
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
          <Link href={`/${locale}/login?role=admin`}>Admin-Zugang</Link>
          <Link href={`/${locale}/login?role=employee`}>Mitarbeiter-Zugang</Link>
          <Link href={`/${locale}`}>Zurueck zur Website</Link>
        </div>

        {session ? (
          <p style={{ marginTop: 18, color: "var(--muted)", lineHeight: 1.6 }}>
            Aktuelle Sitzung: {session.displayName} ({session.role}).
          </p>
        ) : (
          <p style={{ marginTop: 18, color: "var(--muted)", lineHeight: 1.6 }}>
            Demo-Zugangsdaten sind fuer lokale Tests vorausgefuellt. Passwoerter werden als gesalzene
            `scrypt`-Hashes gespeichert.
          </p>
        )}
      </section>
    </main>
  );
}
