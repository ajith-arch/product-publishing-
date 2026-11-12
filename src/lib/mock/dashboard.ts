/**
 * Mock dashboard data for Milestone 1.
 * Placeholder only: not real research output. Replaced once the product schema (M3) exists.
 */

export type MockProductStatus = "draft" | "needs_review" | "approved" | "exported";

export type MockRecentProduct = {
  sku: string;
  name: string;
  status: MockProductStatus;
  updatedAt: string; // ISO 8601
};

export const MOCK_DASHBOARD_STATS = {
  productsCreated: 12,
  draftProducts: 4,
  approvedProducts: 6,
} as const;

export const MOCK_RECENT_PRODUCTS: readonly MockRecentProduct[] = [
  {
    sku: "41000529749",
    name: "APPLE 24-INCH IMAC RETINA 4.5K M6 12C CPU 12C GPU",
    status: "needs_review",
    updatedAt: "2026-11-12T09:42:00Z",
  },
  {
    sku: "SAMPLE-0002",
    name: "Sample Wireless Keyboard",
    status: "draft",
    updatedAt: "2026-11-11T16:05:00Z",
  },
  {
    sku: "SAMPLE-0003",
    name: "Sample 27-inch Monitor",
    status: "approved",
    updatedAt: "2026-11-10T13:20:00Z",
  },
  {
    sku: "SAMPLE-0004",
    name: "Sample USB-C Hub",
    status: "exported",
    updatedAt: "2026-11-08T10:11:00Z",
  },
];

export const STATUS_LABELS: Record<MockProductStatus, string> = {
  draft: "Draft",
  needs_review: "Needs review",
  approved: "Approved",
  exported: "Exported",
};
