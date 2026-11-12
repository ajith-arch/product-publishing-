import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type MockProductStatus } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<MockProductStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  needs_review: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  exported: "bg-sky-50 text-sky-800 border-sky-200",
};

export function StatusBadge({ status }: { status: MockProductStatus }) {
  return (
    <Badge variant="outline" className={cn(STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
