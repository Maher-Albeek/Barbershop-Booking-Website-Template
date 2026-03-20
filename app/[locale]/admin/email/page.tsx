import { AdminShell } from "../_components";
import { AdminEmailSection, getAdminPageState } from "../_sections";

type AdminEmailPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminEmailPage({ params }: AdminEmailPageProps) {
  const { locale } = await params;
  const state = await getAdminPageState(locale);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin/email">
      <AdminEmailSection {...state} />
    </AdminShell>
  );
}
