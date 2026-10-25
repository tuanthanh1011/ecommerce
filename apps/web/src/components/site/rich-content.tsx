"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

/**
 * Renders CMS rich text (Tiptap HTML) on the public site. The HTML is
 * sanitized first — it is author-supplied, and must never be able to run
 * script on a visitor's browser. Content only ever arrives via client-side
 * fetches, so there is no server render of unsanitized HTML.
 */
export function RichContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const clean = useMemo(
    () => (DOMPurify.isSupported ? DOMPurify.sanitize(html) : ""),
    [html],
  );
  if (!clean) return null;
  return (
    <div
      className={cn("rich-content font-body", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
