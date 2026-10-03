"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

/** Click-or-drop file target shared by every uploader. */
export function Dropzone({
  onFile,
  uploading,
  accept,
  title = "Kéo thả hoặc bấm để tải lên",
  hint = "PNG, JPG, WEBP",
  compact,
  className,
}: {
  onFile: (file: File) => void;
  uploading?: boolean;
  accept?: string;
  title?: string;
  hint?: string;
  compact?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <button
      type="button"
      disabled={uploading}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      className={cn(
        "group flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-muted/30 text-center transition-colors outline-none hover:border-amber-400 hover:bg-amber-50/50 focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none dark:hover:bg-amber-500/5",
        compact ? "px-4 py-5" : "px-6 py-9",
        dragging && "border-amber-500 bg-amber-50 dark:bg-amber-500/10",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-card text-amber-600 shadow-sm ring-1 ring-border transition-transform group-hover:scale-105",
          compact ? "size-9" : "size-11",
        )}
      >
        {uploading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <UploadCloud className="size-5" />
        )}
      </span>
      <span className="text-sm font-medium text-foreground">
        {uploading ? "Đang tải lên..." : title}
      </span>
      {!uploading && hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </button>
  );
}
