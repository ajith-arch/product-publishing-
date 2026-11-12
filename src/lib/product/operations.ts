import { checkReadiness } from "./readiness";
import type { Merchandising, ProductContent, ProductRecord } from "./schema";

/** Pure state transitions for a product record. No I/O, so they are easy to test. */

export function saveDraft(
  record: ProductRecord,
  edited: ProductContent,
  merchandising: Merchandising,
  now: string,
): ProductRecord {
  return {
    ...record,
    // `generated` and `input` are deliberately carried over untouched.
    edited: structuredClone(edited),
    merchandising: { ...merchandising },
    // Any saved edit re-opens an approved product for review.
    status: "draft",
    approvedAt: null,
    updatedAt: now,
  };
}

export type ApproveResult = { ok: true; record: ProductRecord } | { ok: false; errors: string[] };

export function approve(
  record: ProductRecord,
  edited: ProductContent,
  merchandising: Merchandising,
  now: string,
): ApproveResult {
  const readiness = checkReadiness(record.input, edited, merchandising, record.research);
  if (!readiness.ready) return { ok: false, errors: readiness.errors.map((e) => e.message) };
  const saved = saveDraft(record, edited, merchandising, now);
  return { ok: true, record: { ...saved, status: "approved", approvedAt: now } };
}
