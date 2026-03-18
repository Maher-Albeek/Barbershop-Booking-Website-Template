import { AdminShell } from "./_components";
import { AdminOverviewSection, getAdminPageState } from "./_sections";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const state = await getAdminPageState(locale);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin">
      <AdminOverviewSection {...state} />
    </AdminShell>
  );
}
