"use client";

import { useState } from "react";
import Link from "next/link";
import { PackagePlus, Search } from "lucide-react";

import { EmptyState, LoadingState } from "@/components/layout/empty-state";
import { ProductTable } from "@/components/products/product-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, NativeSelect } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRODUCT_STATUSES, STATUS_LABELS, type ProductStatus } from "@/lib/product/schema";
import { useProductStore } from "@/lib/product/store";

export function ProductsView() {
  const { products, hydrated } = useProductStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProductStatus | "all">("all");

  const q = query.trim().toLowerCase();
  const filtered = products
    .filter((p) => status === "all" || p.status === status)
    .filter(
      (p) =>
        !q ||
        p.input.sku.toLowerCase().includes(q) ||
        p.input.internalId.includes(q) ||
        p.input.productName.toLowerCase().includes(q) ||
        p.edited.displayName.toLowerCase().includes(q),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Label htmlFor="product-search" className="sr-only">
              Search products
            </Label>
            <Search
              className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 size-4"
              aria-hidden
            />
            <Input
              id="product-search"
              type="search"
              placeholder="Search SKU, Internal ID or name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Label htmlFor="status-filter" className="sr-only">
            Filter by status
          </Label>
          <NativeSelect
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus | "all")}
            className="sm:w-44"
          >
            <option value="all">All statuses</option>
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </NativeSelect>
        </div>

        {!hydrated ? (
          <LoadingState />
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackagePlus}
            title="No products yet"
            description="Products you generate will appear here."
            action={
              <Button asChild>
                <Link href="/products/new">New Product</Link>
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No products match your filters.
          </p>
        ) : (
          <ProductTable products={filtered} allowDelete />
        )}
      </CardContent>
    </Card>
  );
}
