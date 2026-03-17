"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactFormState } from "./actions";
import { emptyContactFormValues } from "@/lib/contact";

type ContactFormLabels = {
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  subjectLabel: string;
  messageLabel: string;
  submitLabel: string;
  submittingLabel: string;
  privacyNote: string;
  errorMessage: string;
  requiredMessage: string;
  invalidEmailMessage: string;
};

type ContactFormProps = {
  locale: string;
  labels: ContactFormLabels;
};

const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: emptyContactFormValues(),
  resetKey: 0
};

function fieldErrorMessage(
  state: ContactFormState,
  field: keyof ContactFormState["fieldErrors"],
  labels: ContactFormLabels
) {
  const error = state.fieldErrors[field];

  if (error === "invalid_email") {
    return labels.invalidEmailMessage;
  }

  if (error === "required") {
    return labels.requiredMessage;
  }

  return "";
}

function SubmitButton({
  submitLabel,
  submittingLabel
}: {
  submitLabel: string;
  submittingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        justifySelf: "start",
        border: "none",
        borderRadius: 999,
        padding: "13px 18px",
        background: pending
          ? "rgba(139, 94, 60, 0.42)"
          : "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
        color: "#fffaf4",
        fontWeight: 700,
        cursor: pending ? "progress" : "pointer"
      }}
    >
      {pending ? submittingLabel : submitLabel}
    </button>
  );
}

export function ContactForm({ locale, labels }: ContactFormProps) {
  const [state, formAction] = useActionState(submitContactForm, initialContactFormState);

  return (
    <form key={state.resetKey} action={formAction} style={{ display: "grid", gap: 16 }}>
      <input type="hidden" name="locale" value={locale} />

      {state.message ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            borderRadius: 18,
            padding: 16,
            background:
              state.status === "success"
                ? "rgba(67, 124, 88, 0.14)"
                : "rgba(190, 92, 75, 0.14)",
            border:
              state.status === "success"
                ? "1px solid rgba(67, 124, 88, 0.28)"
                : "1px solid rgba(190, 92, 75, 0.28)",
            color: state.status === "success" ? "#1f5d32" : "#7f2619"
          }}
        >
          {state.message}
        </div>
      ) : null}

      <div
        className="auto-grid-220 mobile-stack"
        style={{
          display: "grid",
          gap: 14
        }}
      >
        <label style={{ display: "grid", gap: 8 }}>
          <span>{labels.nameLabel}</span>
          <input
            type="text"
            name="name"
            required
            defaultValue={state.values.name}
            aria-invalid={Boolean(state.fieldErrors.name)}
            style={{
              width: "100%",
              borderRadius: 16,
              border: state.fieldErrors.name ? "1px solid #be5c4b" : "1px solid var(--border)",
              background: "rgba(255, 250, 244, 0.7)",
              padding: "14px 16px",
              color: "var(--foreground)"
            }}
          />
          {state.fieldErrors.name ? (
            <span style={{ color: "#7f2619", fontSize: 14 }}>
              {fieldErrorMessage(state, "name", labels)}
            </span>
          ) : null}
        </label>

        <label style={{ display: "grid", gap: 8 }}>
          <span>{labels.emailLabel}</span>
          <input
            type="email"
            name="email"
            required
            defaultValue={state.values.email}
            aria-invalid={Boolean(state.fieldErrors.email)}
            style={{
              width: "100%",
              borderRadius: 16,
              border: state.fieldErrors.email ? "1px solid #be5c4b" : "1px solid var(--border)",
              background: "rgba(255, 250, 244, 0.7)",
              padding: "14px 16px",
              color: "var(--foreground)"
            }}
          />
          {state.fieldErrors.email ? (
            <span style={{ color: "#7f2619", fontSize: 14 }}>
              {fieldErrorMessage(state, "email", labels)}
            </span>
          ) : null}
        </label>
      </div>

      <label style={{ display: "grid", gap: 8 }}>
        <span>{labels.phoneLabel}</span>
        <input
          type="tel"
          name="phone"
          defaultValue={state.values.phone}
          style={{
            width: "100%",
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "rgba(255, 250, 244, 0.7)",
            padding: "14px 16px",
            color: "var(--foreground)"
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 8 }}>
        <span>{labels.subjectLabel}</span>
        <input
          type="text"
          name="subject"
          required
          defaultValue={state.values.subject}
          aria-invalid={Boolean(state.fieldErrors.subject)}
          style={{
            width: "100%",
            borderRadius: 16,
            border: state.fieldErrors.subject ? "1px solid #be5c4b" : "1px solid var(--border)",
            background: "rgba(255, 250, 244, 0.7)",
            padding: "14px 16px",
            color: "var(--foreground)"
          }}
        />
        {state.fieldErrors.subject ? (
          <span style={{ color: "#7f2619", fontSize: 14 }}>
            {fieldErrorMessage(state, "subject", labels)}
          </span>
        ) : null}
      </label>

      <label style={{ display: "grid", gap: 8 }}>
        <span>{labels.messageLabel}</span>
        <textarea
          name="message"
          required
          rows={6}
          defaultValue={state.values.message}
          aria-invalid={Boolean(state.fieldErrors.message)}
          style={{
            width: "100%",
            borderRadius: 18,
            border: state.fieldErrors.message ? "1px solid #be5c4b" : "1px solid var(--border)",
            background: "rgba(255, 250, 244, 0.7)",
            padding: "14px 16px",
            color: "var(--foreground)",
            resize: "vertical"
          }}
        />
        {state.fieldErrors.message ? (
          <span style={{ color: "#7f2619", fontSize: 14 }}>
            {fieldErrorMessage(state, "message", labels)}
          </span>
        ) : null}
      </label>

      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{labels.privacyNote}</p>

      <SubmitButton
        submitLabel={labels.submitLabel}
        submittingLabel={labels.submittingLabel}
      />
    </form>
  );
}
