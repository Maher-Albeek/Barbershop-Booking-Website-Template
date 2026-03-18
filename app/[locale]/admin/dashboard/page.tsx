import { AdminShell } from "../_components";
import { AdminOverviewSection, getAdminPageState } from "../_sections";

type AdminDashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: AdminDashboardPageProps) {
  const { locale } = await params;
  const state = await getAdminPageState(locale);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin">
      <AdminOverviewSection {...state} />
    </AdminShell>
  );
}
