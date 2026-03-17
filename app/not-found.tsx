import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px 56px",
        display: "grid",
        placeItems: "center"
      }}
    >
      <section
        style={{
          maxWidth: 640,
          width: "100%",
          borderRadius: 32,
          border: "1px solid var(--border)",
          background: "var(--surface-strong)",
          boxShadow: "var(--shadow)",
          padding: "40px 28px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--muted)"
          }}
        >
          404
        </div>
        <h1 style={{ margin: "14px 0 12px", fontSize: "clamp(2.4rem, 6vw, 4rem)" }}>
          Page not found
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          The requested page does not exist or is no longer available.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            marginTop: 24,
            padding: "13px 18px",
            borderRadius: 999,
            background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
            color: "#fffaf4",
            fontWeight: 700
          }}
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
