import { redirect } from "next/navigation";

type AdminBookingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminBookingsPage({ params }: AdminBookingsPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin#bookings`);
}
