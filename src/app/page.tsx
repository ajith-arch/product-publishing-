import Link from "next/link";
import { CheckCircle2, FilePen, Package, PackagePlus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/products/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_DASHBOARD_STATS, MOCK_RECENT_PRODUCTS } from "@/lib/mock/dashboard";

const STATS = [
  { label: "Products Created", value: MOCK_DASHBOARD_STATS.productsCreated, icon: Package },
  { label: "Draft Products", value: MOCK_DASHBOARD_STATS.draftProducts, icon: FilePen },
  { label: "Approved Products", value: MOCK_DASHBOARD_STATS.approvedProducts, icon: CheckCircle2 },
] as const;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Track product listings from first draft to CSV export."
        actions={
          <Button asChild>
            <Link href="/products/new">
              <PackagePlus />
              New Product
            </Link>
          </Button>
        }
      />

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="gap-2 py-5">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardDescription>{label}</CardDescription>
              <Icon className="text-muted-foreground size-4" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recently Edited Products</CardTitle>
          <CardDescription>Sample data until product storage is implemented.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Edited (UTC)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RECENT_PRODUCTS.map((p) => (
                <TableRow key={p.sku}>
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell className="max-w-[22rem] truncate">{p.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right tabular-nums">
                    <time dateTime={p.updatedAt}>{dateFormat.format(new Date(p.updatedAt))}</time>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
