import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-5">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="flex flex-col gap-5">{children}</CardContent>
    </Card>
  );
}
