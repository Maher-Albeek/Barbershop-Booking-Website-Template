import { AdminShell } from "../_components";
import { AdminContactSection, getAdminPageState } from "../_sections";

type AdminContactPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminContactPage({ params }: AdminContactPageProps) {
  const { locale } = await params;
  const state = await getAdminPageState(locale);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin/contact">
      <AdminContactSection {...state} />
    </AdminShell>
  );
}
