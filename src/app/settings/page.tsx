import { PageHeader } from "@/components/layout/page-header";
import { SettingsView } from "@/components/settings/settings-view";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Application preferences for this browser." />
      <SettingsView />
    </>
  );
}
