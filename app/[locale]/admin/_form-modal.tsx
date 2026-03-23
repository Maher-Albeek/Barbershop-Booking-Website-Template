"use client";

import type { ReactNode } from "react";
import { useId, useRef } from "react";

type FormModalProps = {
  buttonLabel: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormModal({ buttonLabel, title, description, children }: FormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "rgba(214, 176, 125, 0.22)",
          color: "var(--foreground)",
          cursor: "pointer",
          fontWeight: 700,
          width: "fit-content"
        }}
      >
        {buttonLabel}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="admin-form-modal"
        style={{
          width: "min(760px, calc(100vw - 32px))",
          margin: "auto",
          border: "1px solid var(--border)",
          borderRadius: 20,
          background: "var(--surface)",
          color: "var(--foreground)",
          boxShadow: "var(--shadow)",
          padding: 0
        }}
      >
        <div style={{ padding: 18, display: "grid", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <h3 id={titleId} style={{ margin: 0, fontSize: "clamp(1.1rem, 2.4vw, 1.3rem)" }}>
                {title}
              </h3>
              {description ? <p style={{ margin: 0, color: "var(--muted)" }}>{description}</p> : null}
            </div>
            <form method="dialog">
              <button
                type="submit"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 999,
                  background: "var(--surface-strong)",
                  color: "var(--foreground)",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontWeight: 700
                }}
              >
                Close
              </button>
            </form>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
