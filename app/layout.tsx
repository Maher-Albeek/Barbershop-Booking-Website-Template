import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
