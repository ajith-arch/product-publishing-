import { z } from "zod";

/**
 * Product data model.
 *
 * Pipeline: ProductInput → Research → generated content (raw, never edited)
 *           → edited content (user's working copy) → approval → CSV export (Milestone 6).
 * The input identifiers are stored once and never touched by generation.
 */

// ---------------------------------------------------------------------------
// 1. User-provided identity
// ---------------------------------------------------------------------------

/**
 * Identifiers are kept as strings. Surrounding whitespace (common when pasting from
 * spreadsheets) is trimmed; nothing else is altered.
 */
export const productInputSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required").max(100, "SKU must be 100 characters or fewer"),
  internalId: z
    .string()
    .trim()
    .min(1, "NetSuite Internal ID is required")
    .regex(/^\d+$/, "Internal ID must contain digits only"),
  productName: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(300, "Product name must be 300 characters or fewer"),
});
export type ProductInput = z.infer<typeof productInputSchema>;

// ---------------------------------------------------------------------------
// 2. Research evidence
// ---------------------------------------------------------------------------

export const verificationStatusSchema = z.enum(["verified", "unverified"]);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

export const sourceSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  kind: z.enum(["manufacturer", "retailer", "other"]),
});
export type Source = z.infer<typeof sourceSchema>;

export const researchSchema = z.object({
  /** "mock" means no real research happened; content must not be trusted. */
  mode: z.enum(["mock", "live"]),
  sources: z.array(sourceSchema),
  warnings: z.array(z.string()),
  researchedAt: z.string().nullable(),
});
export type Research = z.infer<typeof researchSchema>;

// ---------------------------------------------------------------------------
// 3/4. Content: generated (raw) and edited (working copy) share this shape
// ---------------------------------------------------------------------------

export const specificationSchema = z.object({
  id: z.string(),
  label: z.string(),
  /** null = unknown. Never filled with a guess. */
  value: z.string().nullable(),
  verification: verificationStatusSchema,
  sourceUrl: z.string().nullable(),
});
export type Specification = z.infer<typeof specificationSchema>;

export const productContentSchema = z.object({
  pageTitle: z.string(),
  displayName: z.string(),
  /** HTML. NetSuite "Web Store Description" (short description). */
  webStoreDescription: z.string(),
  /** HTML. */
  detailedDescription: z.string(),
  /** HTML. */
  featuredDescription: z.string(),
  specifications: z.array(specificationSchema),
  inTheBox: z.array(z.string()),
  metaTitle: z.string(),
  metaDescription: z.string(),
  /** Comma-separated, as typically imported. */
  searchKeywords: z.string(),
  urlComponent: z.string(),
});
export type ProductContent = z.infer<typeof productContentSchema>;

// ---------------------------------------------------------------------------
// 5. Publishing settings
// ---------------------------------------------------------------------------

export const merchandisingSchema = z.object({
  displayInWebStore: z.boolean(),
  hideAddToCart: z.boolean(),
  newBadge: z.boolean(),
});
export type Merchandising = z.infer<typeof merchandisingSchema>;
export type MerchandisingKey = keyof Merchandising;

/** Safe defaults: nothing is published or badged until a person turns it on. */
export const DEFAULT_MERCHANDISING: Merchandising = {
  displayInWebStore: false,
  hideAddToCart: false,
  newBadge: false,
};

export const merchandisingSuggestionSchema = z.object({
  value: z.boolean(),
  reason: z.string(),
});
export const suggestedMerchandisingSchema = z.object({
  displayInWebStore: merchandisingSuggestionSchema.nullable(),
  hideAddToCart: merchandisingSuggestionSchema.nullable(),
  newBadge: merchandisingSuggestionSchema.nullable(),
});
export type SuggestedMerchandising = z.infer<typeof suggestedMerchandisingSchema>;

// ---------------------------------------------------------------------------
// 6. Workflow / export status
// ---------------------------------------------------------------------------

export const PRODUCT_STATUSES = ["needs_review", "draft", "approved", "exported"] as const;
export const productStatusSchema = z.enum(PRODUCT_STATUSES);
export type ProductStatus = z.infer<typeof productStatusSchema>;

export const STATUS_LABELS: Record<ProductStatus, string> = {
  needs_review: "Needs review",
  draft: "Draft",
  approved: "Approved",
  exported: "Exported",
};

// ---------------------------------------------------------------------------
// Product record
// ---------------------------------------------------------------------------

export const productRecordSchema = z.object({
  id: z.string(),
  schemaVersion: z.literal(1),
  input: productInputSchema,
  research: researchSchema,
  /** Raw generator output. Never modified after creation. */
  generated: productContentSchema,
  /** The user's saved edits. Starts as a copy of `generated`. */
  edited: productContentSchema,
  merchandising: merchandisingSchema,
  suggestedMerchandising: suggestedMerchandisingSchema,
  status: productStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  approvedAt: z.string().nullable(),
});
export type ProductRecord = z.infer<typeof productRecordSchema>;
