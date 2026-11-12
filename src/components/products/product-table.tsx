"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import { StatusBadge } from "@/components/products/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { imageStore } from "@/lib/product/image-store";
import type { ProductRecord } from "@/lib/product/schema";
import { productStore } from "@/lib/product/store";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function ProductTable({
  products,
  allowDelete,
  tab,
}: {
  products: ProductRecord[];
  allowDelete?: boolean;
  tab?: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Internal ID</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Last edited</TableHead>
          {allowDelete && (
            <TableHead className="w-10">
              <span className="sr-only">Actions</span>
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono text-xs">{p.input.sku}</TableCell>
            <TableCell className="font-mono text-xs">{p.input.internalId}</TableCell>
            <TableCell className="max-w-[24rem] truncate">
              <Link
                href={`/products/${p.id}${tab ? `?tab=${tab}` : ""}`}
                className="font-medium hover:underline focus-visible:underline focus-visible:outline-none"
              >
                {p.edited.displayName || p.input.productName}
              </Link>
            </TableCell>
            <TableCell>
              <StatusBadge status={p.status} />
            </TableCell>
            <TableCell className="text-muted-foreground text-right tabular-nums">
              <time dateTime={p.updatedAt}>{dateFormat.format(new Date(p.updatedAt))}</time>
            </TableCell>
            {allowDelete && (
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive size-8"
                  aria-label={`Delete ${p.input.sku}`}
                  onClick={() => {
                    if (window.confirm(`Delete product ${p.input.sku}? This cannot be undone.`)) {
                      productStore.remove(p.id);
                      imageStore.delete(p.id);
                    }
                  }}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
