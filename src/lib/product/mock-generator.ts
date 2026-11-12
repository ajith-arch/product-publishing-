import {
  DEFAULT_MERCHANDISING,
  type ProductContent,
  type ProductInput,
  type ProductRecord,
  type Research,
  type Specification,
  type SuggestedMerchandising,
} from "./schema";
import { slugify } from "./text";

/**
 * Deterministic MOCK generator. Performs no research and states so in its output.
 * Content is templated placeholder text; every specification value is left unknown.
 * Replaced by the real research + AI engine in Milestone 4.
 */

const SPEC_LABELS = [
  "Processor",
  "Graphics",
  "Display",
  "Memory",
  "Storage",
  "Ports",
  "Colour",
  "Dimensions",
  "Weight",
] as const;

export const MOCK_RESEARCH_WARNING =
  "Mock generation: no research was performed. All content is placeholder text and must be verified before approval.";

function mockSpecifications(): Specification[] {
  return SPEC_LABELS.map((label, i) => ({
    id: `spec-${i + 1}`,
    label,
    value: null,
    verification: "unverified",
    sourceUrl: null,
  }));
}

function keywordsFrom(name: string): string {
  const words = name
    .toLowerCase()
    .split(/[^a-z0-9.]+/)
    .filter((w) => w.length > 1);
  return Array.from(new Set(words)).slice(0, 10).join(", ");
}

export function generateMockContent(input: ProductInput): ProductContent {
  const name = input.productName;
  return {
    pageTitle: name,
    displayName: name,
    webStoreDescription: `<p>[Placeholder] Short description for ${escapeHtml(name)}. Replace with verified product information.</p>`,
    detailedDescription: [
      `<h3>Overview</h3>`,
      `<p>[Placeholder] Detailed description for ${escapeHtml(name)}.</p>`,
      `<h3>Key features</h3>`,
      `<ul><li>[Feature to be verified]</li><li>[Feature to be verified]</li><li>[Feature to be verified]</li></ul>`,
    ].join(""),
    featuredDescription: `<p>[Placeholder] One-line highlight for ${escapeHtml(name)}.</p>`,
    specifications: mockSpecifications(),
    inTheBox: [],
    metaTitle: name.slice(0, 60),
    metaDescription: `[Placeholder] Shop ${name}. Meta description pending verified research.`,
    searchKeywords: keywordsFrom(name),
    urlComponent: slugify(name),
  };
}

function mockSuggestions(): SuggestedMerchandising {
  return {
    displayInWebStore: {
      value: true,
      reason: "Mock suggestion: listings are usually shown in the web store once approved.",
    },
    hideAddToCart: null,
    newBadge: {
      value: true,
      reason: "Mock suggestion: not based on research. Confirm the release date first.",
    },
  };
}

export function createMockResearch(now: string): Research {
  return { mode: "mock", sources: [], warnings: [MOCK_RESEARCH_WARNING], researchedAt: now };
}

export function createProductRecord(input: ProductInput, id: string, now: string): ProductRecord {
  const generated = generateMockContent(input);
  return {
    id,
    schemaVersion: 1,
    input: { ...input },
    research: createMockResearch(now),
    generated,
    edited: structuredClone(generated),
    merchandising: { ...DEFAULT_MERCHANDISING },
    suggestedMerchandising: mockSuggestions(),
    status: "needs_review",
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
