import { redirect } from "next/navigation";

type AdminGalleryPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminGalleryPage({ params }: AdminGalleryPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin#gallery`);
}
