"use client";

import { AlertTriangle, Lock, OctagonAlert } from "lucide-react";

import { Field } from "@/components/products/field";
import { StatusBadge } from "@/components/products/status-badge";
import { Section } from "@/components/editor/section";
import { SafeHtml } from "@/components/editor/safe-html";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EditorTabProps } from "./types";

export function OverviewTab({ record, content, patch, readiness, goTo }: EditorTabProps) {
  const errorsFor = (f: string) => readiness.errors.find((e) => e.field === f)?.message;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-6">
        <Section
          title="Identity"
          description="Supplied by you. Locked so generation can never change them."
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            <ReadOnly label="SKU" value={record.input.sku} mono />
            <ReadOnly label="NetSuite Internal ID" value={record.input.internalId} mono />
            <ReadOnly
              label="Original Product Name"
              value={record.input.productName}
              className="sm:col-span-2"
            />
          </dl>
        </Section>

        <Section title="Listing names">
          <Field id="pageTitle" label="Page Title" required error={errorsFor("pageTitle")}>
            <Input
              id="pageTitle"
              value={content.pageTitle}
              aria-invalid={!!errorsFor("pageTitle")}
              onChange={(e) => patch({ pageTitle: e.target.value })}
            />
          </Field>
          <Field
            id="displayName"
            label="Web Store Display Name"
            required
            error={errorsFor("displayName")}
          >
            <Input
              id="displayName"
              value={content.displayName}
              aria-invalid={!!errorsFor("displayName")}
              onChange={(e) => patch({ displayName: e.target.value })}
            />
          </Field>
        </Section>

        <Section
          title="Short description"
          description="The Web Store Description shown on listing pages."
          action={
            <Button variant="outline" size="sm" onClick={() => goTo("description")}>
              Edit
            </Button>
          }
        >
          {content.webStoreDescription.trim() ? (
            <SafeHtml html={content.webStoreDescription} />
          ) : (
            <p className="text-muted-foreground text-sm italic">No short description yet.</p>
          )}
        </Section>
      </div>

      <div className="flex flex-col gap-6">
        <Section title="Listing status">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={record.status} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Research</span>
            <span className="font-medium">
              {record.research.mode === "mock" ? "Mock (none)" : "Live"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sources</span>
            <span className="font-medium">{record.research.sources.length}</span>
          </div>
        </Section>

        <Section
          title="Verification"
          description="Resolve errors before approval. Review every warning."
        >
          {readiness.errors.length === 0 && readiness.warnings.length === 0 ? (
            <p className="text-sm text-emerald-700">No issues found.</p>
          ) : (
            <ul className="flex flex-col gap-2.5 text-sm">
              {readiness.errors.map((e, i) => (
                <li key={`e${i}`} className="flex gap-2 text-red-800">
                  <OctagonAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    <span className="sr-only">Error: </span>
                    {e.message}
                  </span>
                </li>
              ))}
              {readiness.warnings.map((w, i) => (
                <li key={`w${i}`} className="flex gap-2 text-amber-800">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    <span className="sr-only">Warning: </span>
                    {w.message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}

function ReadOnly({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Lock className="size-3" aria-hidden />
        {label}
      </dt>
      <dd className={mono ? "mt-1 font-mono text-sm" : "mt-1 text-sm"}>{value}</dd>
    </div>
  );
}
