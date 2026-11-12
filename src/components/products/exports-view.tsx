"use client";

import Link from "next/link";
import { Download, FileDown, Info } from "lucide-react";

import { EmptyState, LoadingState } from "@/components/layout/empty-state";
import { ProductTable } from "@/components/products/product-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductStore } from "@/lib/product/store";

export function ExportsView() {
  const { products, hydrated } = useProductStore();
  const ready = products
    .filter((p) => p.status === "approved")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="flex flex-col gap-6">
      <Alert variant="info">
        <Info />
        <AlertDescription>
          CSV generation is not implemented yet (Milestone 6). Nothing is sent to NetSuite: you will
          download the file and import it yourself.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Export-ready products</CardTitle>
            <CardDescription>Only approved products can be exported.</CardDescription>
          </div>
          <Button disabled title="CSV export arrives in Milestone 6">
            <Download />
            Download CSV
          </Button>
        </CardHeader>
        <CardContent>
          {!hydrated ? (
            <LoadingState />
          ) : ready.length === 0 ? (
            <EmptyState
              icon={FileDown}
              title="No approved products"
              description="Approve a product in the editor and it will appear here for export."
              action={
                <Button asChild variant="outline">
                  <Link href="/products">Go to Products</Link>
                </Button>
              }
            />
          ) : (
            <ProductTable products={ready} tab="export" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
