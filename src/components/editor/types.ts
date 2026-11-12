import type { Merchandising, ProductContent, ProductRecord } from "@/lib/product/schema";
import type { Readiness } from "@/lib/product/readiness";

export const EDITOR_TABS = [
  { id: "overview", label: "Overview" },
  { id: "description", label: "Description" },
  { id: "seo", label: "SEO" },
  { id: "images", label: "Images" },
  { id: "merchandising", label: "Merchandising" },
  { id: "export", label: "Export Preview" },
] as const;
export type EditorTabId = (typeof EDITOR_TABS)[number]["id"];

export function isEditorTab(v: unknown): v is EditorTabId {
  return EDITOR_TABS.some((t) => t.id === v);
}

export type EditorTabProps = {
  record: ProductRecord;
  content: ProductContent;
  patch: (p: Partial<ProductContent>) => void;
  merch: Merchandising;
  setMerch: (m: Merchandising) => void;
  readiness: Readiness;
  goTo: (tab: EditorTabId) => void;
};
