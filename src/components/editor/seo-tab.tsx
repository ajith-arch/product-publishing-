"use client";

import { Wand2 } from "lucide-react";

import { Field, describedBy } from "@/components/products/field";
import { Section } from "@/components/editor/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SEO_LIMITS } from "@/lib/product/readiness";
import { slugify } from "@/lib/product/text";
import type { EditorTabProps } from "./types";

export function SeoTab({ content, patch, readiness }: EditorTabProps) {
  const err = (f: string) => readiness.errors.find((e) => e.field === f)?.message;
  const keywords = content.searchKeywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
      <Section title="Search engine listing">
        <Field
          id="metaTitle"
          label="Meta Title"
          required
          error={err("metaTitle")}
          hint="Aim for 60 characters or fewer."
          counter={{ value: content.metaTitle.length, limit: SEO_LIMITS.metaTitle }}
        >
          <Input
            id="metaTitle"
            value={content.metaTitle}
            aria-invalid={!!err("metaTitle")}
            aria-describedby={describedBy("metaTitle", {
              error: err("metaTitle"),
              hint: true,
              counter: true,
            })}
            onChange={(e) => patch({ metaTitle: e.target.value })}
          />
        </Field>
        <Field
          id="metaDescription"
          label="Meta Description"
          required
          error={err("metaDescription")}
          hint="Aim for 160 characters or fewer."
          counter={{ value: content.metaDescription.length, limit: SEO_LIMITS.metaDescription }}
        >
          <Textarea
            id="metaDescription"
            value={content.metaDescription}
            aria-invalid={!!err("metaDescription")}
            aria-describedby={describedBy("metaDescription", {
              error: err("metaDescription"),
              hint: true,
              counter: true,
            })}
            onChange={(e) => patch({ metaDescription: e.target.value })}
          />
        </Field>
        <Field id="searchKeywords" label="Search Keywords" hint="Separate keywords with commas.">
          <Input
            id="searchKeywords"
            value={content.searchKeywords}
            aria-describedby="searchKeywords-hint"
            onChange={(e) => patch({ searchKeywords: e.target.value })}
          />
        </Field>
        {keywords.length > 0 && (
          <ul aria-label="Keywords" className="-mt-2 flex flex-wrap gap-1.5">
            {keywords.map((k, i) => (
              <li key={`${k}-${i}`} className="bg-muted rounded px-2 py-0.5 text-xs">
                {k}
              </li>
            ))}
          </ul>
        )}
        <Field
          id="urlComponent"
          label="URL Component"
          required
          error={err("urlComponent")}
          hint="Lowercase letters, numbers and hyphens."
        >
          <div className="flex gap-2">
            <Input
              id="urlComponent"
              value={content.urlComponent}
              spellCheck={false}
              aria-invalid={!!err("urlComponent")}
              aria-describedby={describedBy("urlComponent", {
                error: err("urlComponent"),
                hint: true,
              })}
              onChange={(e) => patch({ urlComponent: e.target.value })}
              className="font-mono text-xs"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => patch({ urlComponent: slugify(content.pageTitle) })}
              title="Generate from Page Title"
            >
              <Wand2 />
              <span className="hidden sm:inline">From title</span>
            </Button>
          </div>
        </Field>
      </Section>

      <Section
        title="Search result preview"
        description="Approximate. Search engines may rewrite it."
      >
        <div className="rounded-lg border p-4" aria-live="polite">
          <p className="text-muted-foreground truncate text-xs">
            www.your-store.com › <span className="font-mono">{content.urlComponent || "…"}</span>
          </p>
          <p className="mt-1 line-clamp-2 text-lg leading-snug text-[#1a0dab]">
            {truncate(content.metaTitle, SEO_LIMITS.metaTitle) || "Meta title"}
          </p>
          <p className="mt-1 line-clamp-3 text-sm text-[#4d5156]">
            {truncate(content.metaDescription, SEO_LIMITS.metaDescription) || "Meta description"}
          </p>
        </div>
      </Section>
    </div>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}
