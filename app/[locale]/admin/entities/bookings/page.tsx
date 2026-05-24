import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type AdminBookingsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    bookingDate?: string;
    bookingEmployee?: string;
    bookingService?: string;
    bookingStatus?: "confirmed" | "cancelled" | "completed" | "no_show";
  }>;
};

export default async function AdminBookingsPage({ params, searchParams }: AdminBookingsPageProps) {
  const [{ locale }, filters] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  const paramsForRedirect = new URLSearchParams();

  if (filters.bookingDate) {
    paramsForRedirect.set("bookingDate", filters.bookingDate);
  }
  if (filters.bookingEmployee) {
    paramsForRedirect.set("bookingEmployee", filters.bookingEmployee);
  }
  if (filters.bookingService) {
    paramsForRedirect.set("bookingService", filters.bookingService);
  }
  if (filters.bookingStatus) {
    paramsForRedirect.set("bookingStatus", filters.bookingStatus);
  }

  const query = paramsForRedirect.toString();
  const target = query ? `/${locale}/admin/pages/booking?${query}` : `/${locale}/admin/pages/booking`;
  redirect(target);
}
