import { AdminShell } from "../_components";
import { AdminSettingsSection, getAdminPageState } from "../_sections";

type AdminSettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminSettingsPage({ params }: AdminSettingsPageProps) {
  const { locale } = await params;
  const state = await getAdminPageState(locale);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin/settings">
      <AdminSettingsSection {...state} />
    </AdminShell>
  );
}
