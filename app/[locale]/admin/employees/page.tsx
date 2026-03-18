import { AdminShell } from "../_components";
import { AdminEmployeesSection, type AdminSearchFilters, getAdminPageState } from "../_sections";

type AdminEmployeesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<AdminSearchFilters>;
};

export default async function AdminEmployeesPage({ params, searchParams }: AdminEmployeesPageProps) {
  const { locale } = await params;
  const filters = await searchParams;
  const state = await getAdminPageState(locale, filters);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin/employees">
      <AdminEmployeesSection {...state} />
    </AdminShell>
  );
}
