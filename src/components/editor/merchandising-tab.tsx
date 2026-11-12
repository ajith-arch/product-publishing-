"use client";

import { Info, Sparkles } from "lucide-react";

import { Section } from "@/components/editor/section";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { MerchandisingKey } from "@/lib/product/schema";
import type { EditorTabProps } from "./types";

const SETTINGS: { key: MerchandisingKey; label: string; description: string }[] = [
  {
    key: "displayInWebStore",
    label: "Display in Web Store",
    description: "Makes the item visible on the storefront after import.",
  },
  {
    key: "hideAddToCart",
    label: "Hide Add to Cart",
    description: "Shows the item without allowing it to be purchased online.",
  },
  {
    key: "newBadge",
    label: "New Product badge",
    description: "Shows a “New” badge on the listing.",
  },
];

export function MerchandisingTab({ record, merch, setMerch }: EditorTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <Alert variant="info">
        <Info />
        <AlertDescription>
          Every setting starts off. Suggestions are never applied automatically. The NetSuite
          columns for these settings are configured in Field Mapping (Milestone 6).
        </AlertDescription>
      </Alert>

      <Section title="Web store settings">
        <ul className="divide-y">
          {SETTINGS.map(({ key, label, description }) => {
            const suggestion = record.suggestedMerchandising[key];
            const differs = suggestion && suggestion.value !== merch[key];
            const id = `merch-${key}`;
            return (
              <li
                key={key}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start"
              >
                <Switch
                  id={id}
                  checked={merch[key]}
                  onCheckedChange={(v) => setMerch({ ...merch, [key]: v })}
                  aria-describedby={`${id}-desc`}
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <Label htmlFor={id}>{label}</Label>
                  <p id={`${id}-desc`} className="text-muted-foreground text-sm">
                    {description}
                  </p>
                  {suggestion && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1 rounded bg-violet-50 px-1.5 py-0.5 font-medium text-violet-800">
                        <Sparkles className="size-3" aria-hidden />
                        Suggested: {suggestion.value ? "On" : "Off"}
                      </span>
                      <span className="text-muted-foreground">{suggestion.reason}</span>
                      {differs && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => setMerch({ ...merch, [key]: suggestion.value })}
                        >
                          Apply suggestion
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}
