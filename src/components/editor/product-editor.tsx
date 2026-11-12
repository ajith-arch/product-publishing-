"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Circle, Save } from "lucide-react";

import { StatusBadge } from "@/components/products/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkReadiness } from "@/lib/product/readiness";
import type { Merchandising, ProductContent, ProductRecord } from "@/lib/product/schema";
import { productStore } from "@/lib/product/store";
import { DescriptionTab } from "./description-tab";
import { ExportPreviewTab } from "./export-preview-tab";
import { ImagesTab } from "./images-tab";
import { MerchandisingTab } from "./merchandising-tab";
import { OverviewTab } from "./overview-tab";
import { SeoTab } from "./seo-tab";
import { EDITOR_TABS, type EditorTabId, type EditorTabProps } from "./types";

const TAB_COMPONENTS: Record<EditorTabId, (p: EditorTabProps) => React.ReactNode> = {
  overview: OverviewTab,
  description: DescriptionTab,
  seo: SeoTab,
  images: ImagesTab,
  merchandising: MerchandisingTab,
  export: ExportPreviewTab,
};

const timeFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function ProductEditor({
  record,
  initialTab = "overview",
}: {
  record: ProductRecord;
  initialTab?: EditorTabId;
}) {
  const [tab, setTab] = useState<EditorTabId>(initialTab);
  // Working copy. The store holds the last saved version.
  const [content, setContent] = useState<ProductContent>(() => structuredClone(record.edited));
  const [merch, setMerch] = useState<Merchandising>(() => ({ ...record.merchandising }));
  const [confirmingApproval, setConfirmingApproval] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const dirty = useMemo(
    () =>
      JSON.stringify(content) !== JSON.stringify(record.edited) ||
      JSON.stringify(merch) !== JSON.stringify(record.merchandising),
    [content, merch, record.edited, record.merchandising],
  );
  const readiness = useMemo(
    () => checkReadiness(record.input, content, merch, record.research),
    [record.input, record.research, content, merch],
  );

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const patch = (p: Partial<ProductContent>) => {
    setConfirmingApproval(false);
    setContent((c) => ({ ...c, ...p }));
  };

  const save = () => {
    productStore.saveDraft(record.id, content, merch);
    setConfirmingApproval(false);
    setNotice(
      record.status === "approved"
        ? "Draft saved. Approval was removed because content changed."
        : "Draft saved.",
    );
  };

  const requestApproval = () => {
    if (!readiness.ready) {
      setTab("export");
      setNotice(null);
      return;
    }
    if (readiness.warnings.length > 0 && !confirmingApproval) {
      setConfirmingApproval(true);
      return;
    }
    const result = productStore.approve(record.id, content, merch);
    setConfirmingApproval(false);
    setNotice(result.ok ? "Product approved." : result.errors.join(" "));
  };

  const tabProps: EditorTabProps = {
    record,
    content,
    patch,
    merch,
    setMerch: (m) => {
      setConfirmingApproval(false);
      setMerch(m);
    },
    readiness,
    goTo: setTab,
  };
  const isApprovedAndClean = record.status === "approved" && !dirty;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              {content.displayName || record.input.productName}
            </h1>
            <StatusBadge status={record.status} />
          </div>
          <p className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>
              SKU <span className="text-foreground font-mono">{record.input.sku}</span>
            </span>
            <span>
              Internal ID{" "}
              <span className="text-foreground font-mono">{record.input.internalId}</span>
            </span>
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <span
            role="status"
            className="text-muted-foreground flex items-center gap-1.5 text-xs sm:mr-2"
          >
            {dirty ? (
              <>
                <Circle className="size-2.5 fill-amber-500 text-amber-500" aria-hidden />
                Unsaved changes
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden />
                Saved {timeFormat.format(new Date(record.updatedAt))}
              </>
            )}
          </span>
          <Button variant="outline" onClick={save} disabled={!dirty}>
            <Save />
            Save Draft
          </Button>
          <Button onClick={requestApproval} disabled={isApprovedAndClean}>
            <CheckCircle2 />
            {isApprovedAndClean ? "Approved" : dirty ? "Save & Approve" : "Approve"}
          </Button>
        </div>
      </div>

      {notice && (
        <p role="status" className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {notice}
        </p>
      )}

      {confirmingApproval && (
        <Alert variant="warning">
          <AlertTriangle />
          <AlertTitle>
            Approve with {readiness.warnings.length} unresolved warning
            {readiness.warnings.length === 1 ? "" : "s"}?
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {readiness.warnings.map((w, i) => (
                <li key={i}>{w.message}</li>
              ))}
            </ul>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={requestApproval}>
                I&apos;ve reviewed these. Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmingApproval(false)}>
                Cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as EditorTabId)}>
        <TabsList aria-label="Product editor sections">
          {EDITOR_TABS.map((t) => {
            const hasError = t.id === "export" ? !readiness.ready : false;
            return (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
                {hasError && (
                  <span className="size-1.5 rounded-full bg-red-500" aria-label="has issues" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {EDITOR_TABS.map((t) => {
          const Comp = TAB_COMPONENTS[t.id];
          return (
            <TabsContent key={t.id} value={t.id}>
              <Comp {...tabProps} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
