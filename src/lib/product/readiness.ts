import type { ProductContent, ProductInput, Research } from "./schema";
import { htmlToText, isBlankHtml, URL_COMPONENT_PATTERN } from "./text";

export const SEO_LIMITS = { metaTitle: 60, metaDescription: 160 } as const;

export type ExportFieldKey =
  | "internalId"
  | "sku"
  | "pageTitle"
  | "displayName"
  | "webStoreDescription"
  | "detailedDescription"
  | "featuredDescription"
  | "specifications"
  | "inTheBox"
  | "metaTitle"
  | "metaDescription"
  | "searchKeywords"
  | "urlComponent"
  | "displayInWebStore"
  | "hideAddToCart"
  | "newBadge";

export type ExportFieldDef = {
  key: ExportFieldKey;
  label: string;
  required: boolean;
  kind: "identifier" | "text" | "html" | "list" | "boolean";
};

/** App fields that will be mapped to NetSuite columns in Milestone 6. Order = default export order. */
export const EXPORT_FIELDS: readonly ExportFieldDef[] = [
  { key: "internalId", label: "Internal ID", required: true, kind: "identifier" },
  { key: "sku", label: "SKU", required: true, kind: "identifier" },
  { key: "pageTitle", label: "Page Title", required: true, kind: "text" },
  { key: "displayName", label: "Web Store Display Name", required: true, kind: "text" },
  { key: "webStoreDescription", label: "Web Store Description", required: true, kind: "html" },
  { key: "detailedDescription", label: "Detailed Description", required: true, kind: "html" },
  { key: "featuredDescription", label: "Featured Description", required: false, kind: "html" },
  { key: "specifications", label: "Specifications", required: false, kind: "list" },
  { key: "inTheBox", label: "In the Box", required: false, kind: "list" },
  { key: "metaTitle", label: "Meta Title", required: true, kind: "text" },
  { key: "metaDescription", label: "Meta Description", required: true, kind: "text" },
  { key: "searchKeywords", label: "Search Keywords", required: false, kind: "text" },
  { key: "urlComponent", label: "URL Component", required: true, kind: "text" },
  { key: "displayInWebStore", label: "Display in Web Store", required: false, kind: "boolean" },
  { key: "hideAddToCart", label: "Hide Add to Cart", required: false, kind: "boolean" },
  { key: "newBadge", label: "New Product Badge", required: false, kind: "boolean" },
];

export type Issue = { field?: ExportFieldKey; message: string };

export type Readiness = {
  errors: Issue[];
  warnings: Issue[];
  ready: boolean;
};

type Merch = { displayInWebStore: boolean; hideAddToCart: boolean; newBadge: boolean };

/** Plain-text value of a field, for previews and emptiness checks. */
export function exportFieldText(
  key: ExportFieldKey,
  input: ProductInput,
  content: ProductContent,
  merch: Merch,
): string {
  switch (key) {
    case "internalId":
    case "sku":
      return input[key];
    case "webStoreDescription":
    case "detailedDescription":
    case "featuredDescription":
      return htmlToText(content[key]);
    case "specifications":
      return content.specifications
        .filter((s) => s.value)
        .map((s) => `${s.label}: ${s.value}`)
        .join("; ");
    case "inTheBox":
      return content.inTheBox
        .map((s) => s.trim())
        .filter(Boolean)
        .join("; ");
    case "displayInWebStore":
    case "hideAddToCart":
    case "newBadge":
      return merch[key] ? "Yes" : "No";
    default:
      return content[key];
  }
}

export function checkReadiness(
  input: ProductInput,
  content: ProductContent,
  merch: Merch,
  research: Research,
): Readiness {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];

  for (const f of EXPORT_FIELDS) {
    if (!f.required) continue;
    const blank =
      f.kind === "html"
        ? isBlankHtml(content[f.key as "webStoreDescription"])
        : exportFieldText(f.key, input, content, merch).trim() === "";
    if (blank) errors.push({ field: f.key, message: `${f.label} is required.` });
  }

  if (content.urlComponent && !URL_COMPONENT_PATTERN.test(content.urlComponent)) {
    errors.push({
      field: "urlComponent",
      message: "URL Component may only contain lowercase letters, numbers and single hyphens.",
    });
  }

  const placeholder = /\[(placeholder|feature to be verified)\]/i;
  for (const f of EXPORT_FIELDS) {
    if (f.kind === "boolean" || f.kind === "identifier") continue;
    if (placeholder.test(exportFieldText(f.key, input, content, merch))) {
      errors.push({ field: f.key, message: `${f.label} still contains placeholder text.` });
    }
  }

  if (content.metaTitle.length > SEO_LIMITS.metaTitle) {
    warnings.push({
      field: "metaTitle",
      message: `Meta Title is longer than ${SEO_LIMITS.metaTitle} characters and may be truncated in search results.`,
    });
  }
  if (content.metaDescription.length > SEO_LIMITS.metaDescription) {
    warnings.push({
      field: "metaDescription",
      message: `Meta Description is longer than ${SEO_LIMITS.metaDescription} characters and may be truncated.`,
    });
  }

  const unverified = content.specifications.filter((s) => s.value && s.verification !== "verified");
  if (unverified.length > 0) {
    warnings.push({
      field: "specifications",
      message: `${unverified.length} specification${unverified.length === 1 ? " is" : "s are"} not marked verified.`,
    });
  }
  const unknown = content.specifications.filter((s) => !s.value);
  if (unknown.length > 0) {
    warnings.push({
      field: "specifications",
      message: `${unknown.length} specification${unknown.length === 1 ? " has" : "s have"} no value and will be left out.`,
    });
  }

  if (research.mode === "mock") {
    warnings.push({ message: "Content was produced by the mock generator, not real research." });
  }

  return { errors, warnings, ready: errors.length === 0 };
}
