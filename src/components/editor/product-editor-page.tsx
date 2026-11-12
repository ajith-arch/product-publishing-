"use client";

import Link from "next/link";
import { ArrowLeft, PackageX } from "lucide-react";

import { EmptyState, LoadingState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/lib/product/store";
import { ProductEditor } from "./product-editor";
import { isEditorTab } from "./types";

export function ProductEditorPage({ id, tab }: { id: string; tab?: string }) {
  const { product, hydrated } = useProduct(id);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/products"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Products
      </Link>
      {!hydrated ? (
        <LoadingState />
      ) : !product ? (
        <EmptyState
          icon={PackageX}
          title="Product not found"
          description="It may have been deleted, or it was created in a different browser."
          action={
            <Button asChild variant="outline">
              <Link href="/products">Back to Products</Link>
            </Button>
          }
        />
      ) : (
        <ProductEditor
          key={product.id}
          record={product}
          initialTab={isEditorTab(tab) ? tab : undefined}
        />
      )}
    </div>
  );
}
