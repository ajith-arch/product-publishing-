import { PageHeader } from "@/components/layout/page-header";
import { ExportsView } from "@/components/products/exports-view";

export default function ExportsPage() {
  return (
    <>
      <PageHeader title="Exports" description="Preview and download approved products as CSV." />
      <ExportsView />
    </>
  );
}
