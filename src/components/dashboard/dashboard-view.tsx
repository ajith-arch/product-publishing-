"use client";

import Link from "next/link";
import { CheckCircle2, FilePen, Package, PackagePlus } from "lucide-react";

import { EmptyState, LoadingState } from "@/components/layout/empty-state";
import { ProductTable } from "@/components/products/product-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductStore } from "@/lib/product/store";

export function DashboardView() {
  const { products, hydrated } = useProductStore();

  const stats = [
    { label: "Products Created", value: products.length, icon: Package },
    {
      label: "Drafts & In Review",
      value: products.filter((p) => p.status === "draft" || p.status === "needs_review").length,
      icon: FilePen,
    },
    {
      label: "Approved Products",
      value: products.filter((p) => p.status === "approved").length,
      icon: CheckCircle2,
    },
  ];
  const recent = [...products].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <>
      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="gap-2 py-5">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardDescription>{label}</CardDescription>
              <Icon className="text-muted-foreground size-4" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{hydrated ? value : "–"}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recently Edited Products</CardTitle>
          <CardDescription>Stored in this browser only.</CardDescription>
        </CardHeader>
        <CardContent>
          {!hydrated ? (
            <LoadingState />
          ) : recent.length === 0 ? (
            <EmptyState
              icon={PackagePlus}
              title="No products yet"
              description="Create your first product from a SKU, NetSuite Internal ID and product name."
              action={
                <Button asChild>
                  <Link href="/products/new">New Product</Link>
                </Button>
              }
            />
          ) : (
            <ProductTable products={recent} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
