import { redirect } from "next/navigation";

type AdminEmployeesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminEmployeesPage({ params }: AdminEmployeesPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin#employees`);
}
