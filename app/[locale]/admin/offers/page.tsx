import { redirect } from "next/navigation";

type AdminOffersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminOffersPage({ params }: AdminOffersPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin#offers`);
}
