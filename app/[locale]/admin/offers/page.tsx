import { AdminShell } from "../_components";
import { AdminOffersSection, type AdminSearchFilters, getAdminPageState } from "../_sections";

type AdminOffersPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<AdminSearchFilters>;
};

export default async function AdminOffersPage({ params, searchParams }: AdminOffersPageProps) {
  const { locale } = await params;
  const filters = await searchParams;
  const state = await getAdminPageState(locale, filters);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin/offers">
      <AdminOffersSection {...state} />
    </AdminShell>
  );
}
