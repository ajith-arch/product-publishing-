import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

/** Empty-state panel for routes whose feature lands in a later milestone. */
export function PlaceholderPanel({
  icon: Icon,
  title,
  description,
  milestone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  milestone: string;
}) {
  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="bg-muted flex size-10 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">{description}</p>
        </div>
        <span className="text-muted-foreground text-xs">Planned for {milestone}</span>
      </CardContent>
    </Card>
  );
}
