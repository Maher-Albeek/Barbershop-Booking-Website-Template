import { redirect } from "next/navigation";

type EmployeeIndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function EmployeeIndexPage({ params }: EmployeeIndexPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/employee/dashboard`);
}
