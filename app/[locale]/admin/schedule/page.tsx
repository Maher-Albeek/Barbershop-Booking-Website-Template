import { AdminShell } from "../_components";
import { AdminScheduleSection, getAdminPageState } from "../_sections";

type AdminSchedulePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminSchedulePage({ params }: AdminSchedulePageProps) {
  const { locale } = await params;
  const state = await getAdminPageState(locale);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin/schedule">
      <AdminScheduleSection {...state} />
    </AdminShell>
  );
}
