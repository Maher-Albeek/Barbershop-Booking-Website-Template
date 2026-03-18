import { AdminShell } from "../_components";
import { AdminBookingsSection, type AdminSearchFilters, getAdminPageState } from "../_sections";

type AdminBookingsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<AdminSearchFilters>;
};

export default async function AdminBookingsPage({ params, searchParams }: AdminBookingsPageProps) {
  const { locale } = await params;
  const filters = await searchParams;
  const state = await getAdminPageState(locale, filters);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin/bookings">
      <AdminBookingsSection {...state} />
    </AdminShell>
  );
}
