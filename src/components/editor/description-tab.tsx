"use client";

import { CheckCircle2, CircleDashed, Plus, Trash2 } from "lucide-react";

import { Field } from "@/components/products/field";
import { RichTextField } from "@/components/editor/rich-text-field";
import { Section } from "@/components/editor/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Specification } from "@/lib/product/schema";
import { cn } from "@/lib/utils";
import type { EditorTabProps } from "./types";

export function DescriptionTab({ content, patch, readiness }: EditorTabProps) {
  const hasError = (f: string) => readiness.errors.some((e) => e.field === f);

  const updateSpec = (id: string, p: Partial<Specification>) =>
    patch({
      specifications: content.specifications.map((s) => (s.id === id ? { ...s, ...p } : s)),
    });

  return (
    <div className="flex flex-col gap-6">
      <Section title="Descriptions" description="Formatted text is exported as HTML.">
        <RichTextField
          id="webStoreDescription"
          label="Web Store Description"
          hint="Short description, one or two sentences."
          required
          invalid={hasError("webStoreDescription")}
          value={content.webStoreDescription}
          onChange={(v) => patch({ webStoreDescription: v })}
        />
        <RichTextField
          id="detailedDescription"
          label="Detailed Description"
          hint="Use headings and bullet points for features."
          required
          invalid={hasError("detailedDescription")}
          value={content.detailedDescription}
          onChange={(v) => patch({ detailedDescription: v })}
        />
        <RichTextField
          id="featuredDescription"
          label="Featured Description"
          hint="Optional highlight used in featured placements."
          invalid={hasError("featuredDescription")}
          value={content.featuredDescription}
          onChange={(v) => patch({ featuredDescription: v })}
        />
      </Section>

      <Section
        title="Specifications"
        description="Leave a value empty when it isn't confirmed. Empty rows are not exported. Mark a row verified only after checking an official source."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              patch({
                specifications: [
                  ...content.specifications,
                  {
                    id: crypto.randomUUID(),
                    label: "",
                    value: null,
                    verification: "unverified",
                    sourceUrl: null,
                  },
                ],
              })
            }
          >
            <Plus />
            Add row
          </Button>
        }
      >
        {content.specifications.length === 0 ? (
          <p className="text-muted-foreground text-sm">No specifications.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left text-xs">
                  <th className="w-[32%] py-2 pr-2 font-medium">Specification</th>
                  <th className="py-2 pr-2 font-medium">Value</th>
                  <th className="w-32 py-2 pr-2 font-medium">Verification</th>
                  <th className="w-10 py-2">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.specifications.map((s) => {
                  const verified = s.verification === "verified";
                  return (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-2 pr-2">
                        <Input
                          aria-label="Specification name"
                          value={s.label}
                          onChange={(e) => updateSpec(s.id, { label: e.target.value })}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <Input
                          aria-label={`${s.label || "Specification"} value`}
                          placeholder="Unknown"
                          value={s.value ?? ""}
                          onChange={(e) =>
                            updateSpec(s.id, {
                              value: e.target.value === "" ? null : e.target.value,
                              // Changing a value invalidates a previous verification.
                              verification: "unverified",
                            })
                          }
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <button
                          type="button"
                          disabled={!s.value}
                          aria-pressed={verified}
                          onClick={() =>
                            updateSpec(s.id, { verification: verified ? "unverified" : "verified" })
                          }
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50",
                            verified
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-amber-200 bg-amber-50 text-amber-800",
                          )}
                        >
                          {verified ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : (
                            <CircleDashed className="size-3.5" />
                          )}
                          {!s.value ? "Missing" : verified ? "Verified" : "Unverified"}
                        </button>
                      </td>
                      <td className="py-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive size-8"
                          aria-label={`Remove ${s.label || "row"}`}
                          onClick={() =>
                            patch({
                              specifications: content.specifications.filter((x) => x.id !== s.id),
                            })
                          }
                        >
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="In the Box">
        <Field id="inTheBox" label="Box contents" hint="One item per line.">
          <InTheBoxInput value={content.inTheBox} onChange={(v) => patch({ inTheBox: v })} />
        </Field>
      </Section>
    </div>
  );
}

function InTheBoxInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <Textarea
      id="inTheBox"
      aria-describedby="inTheBox-hint"
      className="min-h-28"
      placeholder={"e.g.\n24-inch iMac\nPower adapter"}
      value={value.join("\n")}
      // Keep blank lines while typing; they're dropped by the export.
      onChange={(e) => onChange(e.target.value.split("\n"))}
    />
  );
}
