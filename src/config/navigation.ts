import {
  FileSpreadsheet,
  History,
  LayoutDashboard,
  PackagePlus,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview of product drafts and approvals",
  },
  {
    title: "New Product",
    href: "/products/new",
    icon: PackagePlus,
    description: "Create a listing from SKU, Internal ID and name",
  },
  {
    title: "Product History",
    href: "/products",
    icon: History,
    description: "All generated, edited and exported products",
  },
  {
    title: "Export Settings",
    href: "/settings/export",
    icon: FileSpreadsheet,
    description: "NetSuite CSV column mapping and defaults",
  },
];

/** Most specific match wins, so /products/new resolves to "New Product", not "Product History". */
export function getActiveNavItem(pathname: string): NavItem | undefined {
  return [...NAV_ITEMS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
}
