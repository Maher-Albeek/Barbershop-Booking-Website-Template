"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", path: "" },
  { label: "Services", path: "services" },
  { label: "Employees", path: "employees" },
  { label: "Schedule", path: "schedule" },
  { label: "Bookings", path: "bookings" },
  { label: "Gallery", path: "gallery" },
  { label: "Offers", path: "offers" },
  { label: "Settings", path: "settings" },
  { label: "Email", path: "email" },
  { label: "Contact", path: "contact" },
];

export function AdminSidebar({ locale }: { locale: string }) {
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    const path = window.location.pathname.split("/admin/")[1] || "";
    setActivePath(path);
  }, []);

  return (
    <nav
      style={{
        width: 210,
        flexShrink: 0,
        position: "sticky",
        top: 20,
        alignSelf: "flex-start",
        border: "1px solid rgba(79, 44, 23, 0.14)",
        borderRadius: 28,
        background: "rgba(255, 250, 244, 0.8)",
        boxShadow: "0 24px 60px rgba(34, 22, 14, 0.12)",
        padding: 12,
        display: "grid",
        gap: 4,
      }}
    >
      <p
        style={{
          margin: "4px 0 8px",
          padding: "0 10px",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#6b5b4f",
        }}
      >
        Navigation
      </p>
      {navItems.map((item) => {
        const href = {
          pathname: `/${locale}/admin${item.path ? `/${item.path}` : ""}` as `/${string}/admin${string}`,
        };
        const isActive = activePath === item.path;
        return (
          <Link
            key={item.path}
            href={href}
            style={{
              display: "block",
              padding: "10px 14px",
              borderRadius: 14,
              fontWeight: isActive ? 700 : 400,
              background: isActive ? "rgba(139, 94, 60, 0.12)" : "transparent",
              color: isActive ? "#8b5e3c" : "inherit",
              borderLeft: isActive ? "3px solid #8b5e3c" : "3px solid transparent",
              fontSize: 14,
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
