"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";

import { cn } from "@/lib/utils";

/** Renders untrusted HTML after sanitizing it with DOMPurify. Client-only. */
export function SafeHtml({ html, className }: { html: string; className?: string }) {
  const clean = useMemo(
    () =>
      typeof window === "undefined"
        ? ""
        : DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }),
    [html],
  );
  return (
    <div className={cn("rich-content", className)} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
