import Link from "next/link";
import { PackagePlus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ProductsView } from "@/components/products/products-view";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        description="Search, review and edit your product drafts."
        actions={
          <Button asChild>
            <Link href="/products/new">
              <PackagePlus />
              New Product
            </Link>
          </Button>
        }
      />
      <ProductsView />
    </>
  );
}
