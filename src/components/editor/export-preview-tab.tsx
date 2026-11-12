"use client";

import { AlertTriangle, CheckCircle2, Download, OctagonAlert } from "lucide-react";

import { Section } from "@/components/editor/section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EXPORT_FIELDS, exportFieldText } from "@/lib/product/readiness";
import type { EditorTabProps } from "./types";

export function ExportPreviewTab({ record, content, merch, readiness }: EditorTabProps) {
  const { errors, warnings, ready } = readiness;

  return (
    <div className="flex flex-col gap-6">
      {ready ? (
        <Alert variant="success">
          <CheckCircle2 />
          <AlertTitle>
            {record.status === "approved" ? "Approved and ready for export" : "Ready for approval"}
          </AlertTitle>
          <AlertDescription>
            All required fields are complete
            {warnings.length > 0 &&
              `, with ${warnings.length} warning${warnings.length === 1 ? "" : "s"} to review`}
            .
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <OctagonAlert />
          <AlertTitle>
            {errors.length} issue{errors.length === 1 ? "" : "s"} must be fixed before approval
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {errors.map((e, i) => (
                <li key={i}>{e.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle />
          <AlertTitle>Warnings</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {warnings.map((w, i) => (
                <li key={i}>{w.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Section
        title="Export row preview"
        description="One CSV row per product. NetSuite column headers are set in Field Mapping (Milestone 6)."
        action={
          <Button disabled title="CSV export arrives in Milestone 6">
            <Download />
            Download CSV
          </Button>
        }
      >
        <p className="text-muted-foreground -mt-2 text-xs">
          CSV download is not implemented yet (Milestone 6).
        </p>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">Field</TableHead>
              <TableHead className="w-32">NetSuite column</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-24 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EXPORT_FIELDS.map((f) => {
              const value = exportFieldText(f.key, record.input, content, merch);
              const fieldErrors = errors.filter((e) => e.field === f.key);
              const fieldWarnings = warnings.filter((w) => w.field === f.key);
              const missing = value.trim() === "";
              return (
                <TableRow key={f.key}>
                  <TableCell className="font-medium whitespace-normal">
                    {f.label}
                    {f.required && <span className="text-destructive"> *</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs italic">Not mapped</TableCell>
                  <TableCell className="whitespace-normal">
                    <span className="line-clamp-2 text-xs break-words" title={value}>
                      {missing ? <span className="text-muted-foreground">—</span> : value}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {fieldErrors.length > 0 ? (
                      <Badge variant="outline" className="border-red-200 bg-red-50 text-red-800">
                        {missing ? "Missing" : "Error"}
                      </Badge>
                    ) : fieldWarnings.length > 0 ? (
                      <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-amber-800"
                      >
                        Review
                      </Badge>
                    ) : missing ? (
                      <Badge variant="outline" className="text-muted-foreground">
                        Empty
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-800"
                      >
                        OK
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}
