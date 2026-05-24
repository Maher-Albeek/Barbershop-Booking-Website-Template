import type { Route } from "next";

export type AdminPageKey =
  | "dashboard"
  | "homePage"
  | "servicesPage"
  | "teamPage"
  | "galleryPage"
  | "offersPage"
  | "bookingPage"
  | "contactPage"
  | "database"
  | "schedule"
  | "settings"
  | "email";

export type AdminNavItem = {
  key: AdminPageKey;
  label: string;
  story: string;
  path: string;
  description: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "CORE",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        story: "ADMIN-001",
        path: "dashboard",
        description: "Review business metrics and recent bookings."
      }
    ]
  },
  {
    label: "PAGES MANAGEMENT",
    items: [
      {
        key: "homePage",
        label: "Home Page",
        story: "ADMIN-013",
        path: "pages/hero",
        description: "Edit homepage hero content and imagery."
      },
      {
        key: "servicesPage",
        label: "Services Page",
        story: "ADMIN-014",
        path: "pages/services",
        description: "Manage the services page hero plus service records used for booking and public listings."
      },
      {
        key: "teamPage",
        label: "Team Page",
        story: "ADMIN-015",
        path: "pages/team",
        description: "Manage the team page hero plus team member records and profiles."
      },
      {
        key: "galleryPage",
        label: "Gallery Page",
        story: "ADMIN-008",
        path: "pages/gallery",
        description: "Maintain the gallery page media and hero presentation."
      },
      {
        key: "offersPage",
        label: "Offers Page",
        story: "ADMIN-016",
        path: "pages/offers",
        description: "Manage the offers page hero plus promotional offer records and validity data."
      },
      {
        key: "bookingPage",
        label: "Booking Page",
        story: "ADMIN-017",
        path: "pages/booking",
        description: "Manage booking page hero plus booking records, filters, and status updates."
      },
      {
        key: "contactPage",
        label: "Contact Page",
        story: "ADMIN-012",
        path: "pages/contact-form",
        description: "Update contact page content, map settings, and page imagery."
      }
    ]
  },
  {
    label: "DATA MANAGEMENT",
    items: [
      {
        key: "database",
        label: "Database Manage",
        story: "ADMIN-018",
        path: "entities/database",
        description: "Display all database tables and inspect their current row values."
      },
      {
        key: "schedule",
        label: "Schedule",
        story: "ADMIN-004 / ADMIN-005 / ADMIN-006",
        path: "entities/schedule",
        description: "Configure assignments, working hours, and blocked time."
      }
    ]
  },
  {
    label: "SETTINGS",
    items: [
      {
        key: "settings",
        label: "Shop Settings",
        story: "ADMIN-010",
        path: "settings",
        description: "Manage branding, locales, and global shop settings."
      },
      {
        key: "email",
        label: "Email Templates",
        story: "ADMIN-011",
        path: "email",
        description: "Configure booking-related email delivery settings."
      }
    ]
  }
];

export const adminNavItems = adminNavGroups.flatMap((group) => group.items);

export function getAdminPagePath(pageKey: AdminPageKey) {
  return adminNavItems.find((item) => item.key === pageKey)?.path ?? "dashboard";
}

export function getAdminPageHref(locale: string, pageKey: AdminPageKey): Route {
  return `/${locale}/admin/${getAdminPagePath(pageKey)}` as Route;
}