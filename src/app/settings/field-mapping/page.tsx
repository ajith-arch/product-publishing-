import { Info } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EXPORT_FIELDS } from "@/lib/product/readiness";

const KIND_LABELS = {
  identifier: "Identifier",
  text: "Text",
  html: "HTML",
  list: "List",
  boolean: "Checkbox",
} as const;

export default function FieldMappingPage() {
  return (
    <>
      <PageHeader
        title="Field Mapping"
        description="Map each product field to a column in your NetSuite CSV import."
      />
      <div className="flex flex-col gap-6">
        <Alert variant="info">
          <Info />
          <AlertDescription>
            Not configured yet. Column headers, order and accepted values will be set from your
            sanitized NetSuite import template in Milestone 6. No NetSuite field IDs are assumed.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Product fields</CardTitle>
            <CardDescription>Listed in the default export order.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>App field</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>NetSuite column header</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EXPORT_FIELDS.map((f, i) => (
                  <TableRow key={f.key}>
                    <TableCell className="text-muted-foreground tabular-nums">{i + 1}</TableCell>
                    <TableCell className="font-medium">{f.label}</TableCell>
                    <TableCell className="text-muted-foreground">{KIND_LABELS[f.kind]}</TableCell>
                    <TableCell>{f.required ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-muted-foreground">
                        Not mapped
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
