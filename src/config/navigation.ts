import {
  CirclePlus,
  FileDown,
  LayoutDashboard,
  Package,
  Settings,
  Settings2,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: readonly NavItem[];
};

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
      { title: "New Product", href: "/products/new", icon: CirclePlus },
      { title: "Products", href: "/products", icon: Package },
      { title: "Exports", href: "/exports", icon: FileDown },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Field Mapping", href: "/settings/field-mapping", icon: Settings2 },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items.map((item) => ({ item, group: g.label })));

/** Most specific match wins, so /products/new resolves to "New Product", not "Products". */
export function getActiveNav(pathname: string): { item: NavItem; group: string } | undefined {
  return [...ALL_ITEMS]
    .sort((a, b) => b.item.href.length - a.item.href.length)
    .find(({ item }) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
}
