import { describe, expect, it } from "vitest";

import { createProductRecord, MOCK_RESEARCH_WARNING } from "./mock-generator";
import { approve, saveDraft } from "./operations";
import { checkReadiness } from "./readiness";
import { productInputSchema, productRecordSchema, type ProductContent } from "./schema";
import { htmlToText, slugify, URL_COMPONENT_PATTERN } from "./text";

const NOW = "2026-11-12T10:00:00.000Z";
const LATER = "2026-11-12T11:00:00.000Z";
const INPUT = {
  sku: "41000529749",
  internalId: "12345",
  productName: "APPLE 24-INCH IMAC RETINA 4.5K M6 12C CPU 12C GPU",
};

function cleanContent(base: ProductContent): ProductContent {
  return {
    ...base,
    webStoreDescription: "<p>Short description.</p>",
    detailedDescription: "<h3>Overview</h3><p>Details.</p>",
    featuredDescription: "<p>Highlight.</p>",
    metaDescription: "A real meta description.",
  };
}

describe("productInputSchema", () => {
  it("keeps identifiers as strings, including leading zeros", () => {
    const r = productInputSchema.parse({ ...INPUT, sku: "000123" });
    expect(r.sku).toBe("000123");
  });

  it("trims surrounding whitespace only", () => {
    const r = productInputSchema.parse({ ...INPUT, sku: "  AB 12\t", internalId: " 99 " });
    expect(r.sku).toBe("AB 12");
    expect(r.internalId).toBe("99");
  });

  it("requires all three fields and a numeric internal ID", () => {
    expect(
      productInputSchema.safeParse({ sku: "", internalId: "", productName: " " }).success,
    ).toBe(false);
    expect(productInputSchema.safeParse({ ...INPUT, internalId: "12a" }).success).toBe(false);
  });
});

describe("mock generator", () => {
  const record = createProductRecord(INPUT, "id-1", NOW);

  it("produces a schema-valid record", () => {
    expect(productRecordSchema.safeParse(record).success).toBe(true);
  });

  it("copies identifiers exactly and never generates them", () => {
    expect(record.input).toEqual(INPUT);
  });

  it("is deterministic", () => {
    expect(createProductRecord(INPUT, "id-1", NOW)).toEqual(record);
  });

  it("does not invent specification values", () => {
    expect(record.generated.specifications.length).toBeGreaterThan(0);
    for (const s of record.generated.specifications) {
      expect(s.value).toBeNull();
      expect(s.verification).toBe("unverified");
    }
  });

  it("marks itself as mock research and leaves publishing flags off", () => {
    expect(record.research.mode).toBe("mock");
    expect(record.research.sources).toEqual([]);
    expect(record.research.warnings).toContain(MOCK_RESEARCH_WARNING);
    expect(record.merchandising).toEqual({
      displayInWebStore: false,
      hideAddToCart: false,
      newBadge: false,
    });
    expect(record.status).toBe("needs_review");
  });

  it("starts edited content as an independent copy of generated content", () => {
    record.edited.specifications[0].value = "changed";
    expect(record.generated.specifications[0].value).toBeNull();
  });
});

describe("operations", () => {
  it("saveDraft keeps generated content and identifiers untouched", () => {
    const r = createProductRecord(INPUT, "id-1", NOW);
    const edited = { ...r.edited, pageTitle: "New title" };
    const saved = saveDraft(r, edited, { ...r.merchandising, newBadge: true }, LATER);
    expect(saved.edited.pageTitle).toBe("New title");
    expect(saved.generated).toEqual(r.generated);
    expect(saved.input).toEqual(INPUT);
    expect(saved.merchandising.newBadge).toBe(true);
    expect(saved.status).toBe("draft");
    expect(saved.updatedAt).toBe(LATER);
  });

  it("approve is refused while placeholder content remains", () => {
    const r = createProductRecord(INPUT, "id-1", NOW);
    const result = approve(r, r.edited, r.merchandising, LATER);
    expect(result.ok).toBe(false);
  });

  it("approve succeeds on complete content, and a later save re-opens it", () => {
    const r = createProductRecord(INPUT, "id-1", NOW);
    const result = approve(r, cleanContent(r.edited), r.merchandising, LATER);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.record.status).toBe("approved");
    expect(result.record.approvedAt).toBe(LATER);
    const reopened = saveDraft(result.record, result.record.edited, r.merchandising, LATER);
    expect(reopened.status).toBe("draft");
    expect(reopened.approvedAt).toBeNull();
  });
});

describe("readiness", () => {
  const r = createProductRecord(INPUT, "id-1", NOW);

  it("flags blank required HTML fields", () => {
    const res = checkReadiness(
      INPUT,
      { ...cleanContent(r.edited), detailedDescription: "<p></p>" },
      r.merchandising,
      r.research,
    );
    expect(res.errors.map((e) => e.field)).toContain("detailedDescription");
  });

  it("rejects invalid URL components", () => {
    const res = checkReadiness(
      INPUT,
      { ...cleanContent(r.edited), urlComponent: "Bad URL" },
      r.merchandising,
      r.research,
    );
    expect(res.errors.map((e) => e.field)).toContain("urlComponent");
  });

  it("warns about unverified specifications and mock research", () => {
    const content = cleanContent(r.edited);
    content.specifications = [
      { id: "a", label: "Memory", value: "16GB", verification: "unverified", sourceUrl: null },
    ];
    const res = checkReadiness(INPUT, content, r.merchandising, r.research);
    expect(res.ready).toBe(true);
    expect(res.warnings.some((w) => w.field === "specifications")).toBe(true);
    expect(res.warnings.some((w) => /mock/i.test(w.message))).toBe(true);
  });
});

describe("text helpers", () => {
  it("slugify produces valid URL components", () => {
    const s = slugify(INPUT.productName);
    expect(s).toBe("apple-24-inch-imac-retina-4-5k-m6-12c-cpu-12c-gpu");
    expect(URL_COMPONENT_PATTERN.test(s)).toBe(true);
    expect(slugify("  Café — Déjà Vu!  ")).toBe("cafe-deja-vu");
  });

  it("htmlToText strips tags and decodes common entities", () => {
    expect(htmlToText("<p>A &amp; B</p><ul><li>x</li></ul>")).toBe("A & B x");
  });
});
