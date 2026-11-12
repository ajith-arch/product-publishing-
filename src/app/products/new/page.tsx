import { PackagePlus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function NewProductPage() {
  return (
    <>
      <PageHeader
        title="New Product"
        description="Enter a SKU, NetSuite Internal ID and product name to start a listing."
      />
      <PlaceholderPanel
        icon={PackagePlus}
        title="Product input form"
        description="SKU, Internal ID and Product Name fields with optional image upload will appear here."
        milestone="Milestone 2"
      />
    </>
  );
}
