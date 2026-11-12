import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Label + control + hint/error, wired for screen readers via ids. */
export function Field({
  id,
  label,
  required,
  hint,
  error,
  counter,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string;
  counter?: { value: number; limit: number };
  className?: string;
  children: React.ReactNode;
}) {
  const over = counter && counter.value > counter.limit;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          {required && (
            <span className="text-destructive" aria-hidden>
              *
            </span>
          )}
        </Label>
        {counter && (
          <span
            id={`${id}-counter`}
            className={cn(
              "text-xs tabular-nums",
              over ? "font-medium text-amber-700" : "text-muted-foreground",
            )}
          >
            {counter.value} / {counter.limit}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-destructive text-xs">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-muted-foreground text-xs">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function describedBy(
  id: string,
  opts: { error?: unknown; hint?: unknown; counter?: unknown },
) {
  const ids = [
    opts.error ? `${id}-error` : opts.hint ? `${id}-hint` : null,
    opts.counter ? `${id}-counter` : null,
  ].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}
