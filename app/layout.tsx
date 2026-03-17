import "./globals.css";
import type { Metadata } from "next";
import { getThemeStyle } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Barbershop Template",
  description: "Reusable barbershop booking website template"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={getThemeStyle()}>{children}</body>
    </html>
  );
}
