import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="bg-muted flex size-10 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-5" aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground mx-auto max-w-md text-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function LoadingState() {
  return (
    <p role="status" className="text-muted-foreground py-12 text-center text-sm">
      Loading…
    </p>
  );
}
