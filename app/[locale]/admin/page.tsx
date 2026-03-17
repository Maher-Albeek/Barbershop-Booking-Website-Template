import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";
import { logoutUser } from "../login/actions";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();

  return (
    <main style={{ minHeight: "100vh", padding: "32px 20px 56px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gap: 20 }}>
        <header
          style={{
            border: "1px solid var(--border)",
            borderRadius: 28,
            background: "var(--surface)",
            padding: 24,
            boxShadow: "var(--shadow)"
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
            Admin dashboard
          </p>
          <h1 style={{ margin: "12px 0 8px", fontSize: 36 }}>Business control center</h1>
          <p style={{ margin: 0, lineHeight: 1.6, color: "var(--muted)" }}>
            Signed in as {session?.displayName}. This route only accepts admin sessions.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          {[
            ["Recent bookings", "Monitor today’s appointments and status changes."],
            ["Employees", "Manage staff access and scheduling constraints."],
            ["Services", "Control what the public booking flow can sell."],
            ["Offers", "Enable or disable promotions without exposing draft entries."]
          ].map(([title, description]) => (
            <article
              key={title}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 24,
                background: "var(--surface)",
                padding: 20
              }}
            >
              <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>{title}</h2>
              <p style={{ margin: 0, lineHeight: 1.6, color: "var(--muted)" }}>{description}</p>
            </article>
          ))}
        </section>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href={`/${locale}/employee`}>Open employee area</Link>
          <Link href={`/${locale}`}>Back to public site</Link>
          <form action={logoutUser}>
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 999,
                background: "var(--surface-strong)",
                padding: "10px 16px"
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
