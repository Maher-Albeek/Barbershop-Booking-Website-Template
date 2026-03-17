import { redirect } from "next/navigation";

type AdminSettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminSettingsPage({ params }: AdminSettingsPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin#settings`);
}
