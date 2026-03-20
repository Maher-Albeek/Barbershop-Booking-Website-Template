import { AdminShell } from "../_components";
import { AdminGallerySection, getAdminPageState } from "../_sections";

type AdminGalleryPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminGalleryPage({ params }: AdminGalleryPageProps) {
  const { locale } = await params;
  const state = await getAdminPageState(locale);

  return (
    <AdminShell locale={state.locale} displayName={state.session?.displayName} activePath="/admin/gallery">
      <AdminGallerySection {...state} />
    </AdminShell>
  );
}
