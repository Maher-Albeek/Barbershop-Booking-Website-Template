import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { updateEmailSettingsAction } from "../actions";
import {
  AdminShell,
  SectionTitle,
  gridTwo,
  inputStyle,
  sectionStyle
} from "../_components";

type AdminEmailPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminEmailPage({ params }: AdminEmailPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-011" title="Manage email settings" />
        <form action={updateEmailSettingsAction} style={gridTwo}>
          <input type="hidden" name="locale" value={locale} />
          <input
            name="providerName"
            defaultValue={siteConfig.emailSettings.providerName}
            placeholder="Provider name"
            style={inputStyle}
          />
          <input
            name="fromEmail"
            defaultValue={siteConfig.emailSettings.fromEmail}
            placeholder="From email"
            style={inputStyle}
          />
          <input
            name="replyToEmail"
            defaultValue={siteConfig.emailSettings.replyToEmail}
            placeholder="Reply-to email"
            style={inputStyle}
          />
          <input
            name="internalNotificationEmail"
            defaultValue={siteConfig.emailSettings.internalNotificationEmail}
            placeholder="Internal notification email"
            style={inputStyle}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              name="sendCustomerConfirmation"
              defaultChecked={siteConfig.emailSettings.sendCustomerConfirmation}
            />
            Send customer confirmations
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              name="sendInternalNotification"
              defaultChecked={siteConfig.emailSettings.sendInternalNotification}
            />
            Send internal notifications
          </label>
          <button type="submit" style={{ ...inputStyle, cursor: "pointer", fontWeight: 700 }}>
            Save email settings
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
