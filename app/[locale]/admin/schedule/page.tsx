import { redirect } from "next/navigation";

type AdminSchedulePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminSchedulePage({ params }: AdminSchedulePageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin#availability`);
}
