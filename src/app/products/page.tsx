import { History } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function ProductHistoryPage() {
  return (
    <>
      <PageHeader
        title="Product History"
        description="Every product you've generated, edited, approved or exported."
      />
      <PlaceholderPanel
        icon={History}
        title="No saved products yet"
        description="Products will be listed here once the product data model and draft storage exist."
        milestone="Milestone 3"
      />
    </>
  );
}
