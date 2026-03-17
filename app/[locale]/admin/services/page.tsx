import { redirect } from "next/navigation";

type AdminServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminServicesPage({ params }: AdminServicesPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin#services`);
}
