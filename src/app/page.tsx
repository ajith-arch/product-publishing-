import Link from "next/link";
import { PackagePlus } from "lucide-react";

import { DashboardView } from "@/components/dashboard/dashboard-view";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

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
      <DashboardView />
    </>
  );
}
