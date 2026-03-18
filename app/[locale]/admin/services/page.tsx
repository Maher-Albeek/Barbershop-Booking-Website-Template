import { AdminShell } from "../_components";
import { AdminServicesSection, type AdminSearchFilters, getAdminPageState } from "../_sections";

type AdminServicesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<AdminSearchFilters>;
};

export default async function AdminServicesPage({ params, searchParams }: AdminServicesPageProps) {
  const { locale } = await params;
  const filters = await searchParams;
  const state = await getAdminPageState(locale, filters);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin/services">
      <AdminServicesSection {...state} />
    </AdminShell>
  );
}
