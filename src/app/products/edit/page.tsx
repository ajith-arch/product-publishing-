"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { ProductEditorPage } from "@/components/editor/product-editor-page";
import { LoadingState } from "@/components/layout/empty-state";

/** Query-string route (/products/edit?id=…&tab=…) so the app can be exported as static files. */
function EditRoute() {
  const params = useSearchParams();
  return <ProductEditorPage id={params.get("id") ?? ""} tab={params.get("tab") ?? undefined} />;
}

export default function ProductEditRoute() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EditRoute />
    </Suspense>
  );
}
