import { FileSpreadsheet } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function ExportSettingsPage() {
  return (
    <>
      <PageHeader
        title="Export Settings"
        description="Configure how product fields map to your NetSuite CSV import columns."
      />
      <PlaceholderPanel
        icon={FileSpreadsheet}
        title="CSV column mapping"
        description="Column headers, ordering and default publishing flags will be configured here, based on your sanitized NetSuite import template."
        milestone="Milestone 6"
      />
    </>
  );
}
