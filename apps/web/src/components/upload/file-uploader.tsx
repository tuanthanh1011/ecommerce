"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, FileText, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile, type MediaRecord } from "@/lib/upload";
import { Dropzone } from "./dropzone";

interface FileUploaderProps {
  value?: { url: string; originalFileName?: string | null } | null;
  onUploaded: (media: MediaRecord) => void;
  onRemove?: () => void;
}

export function FileUploader({ value, onUploaded, onRemove }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const media = await uploadFile(file);
      onUploaded(media);
      toast.success("Tải lên thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tải lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  if (!value?.url) {
    return (
      <Dropzone
        onFile={handleFile}
        uploading={uploading}
        compact
        hint="PDF, DOCX, XLSX…"
      />
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-xs">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
        <FileText className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {value.originalFileName ?? "Tệp đính kèm"}
        </p>
        <a
          href={value.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Mở tệp
          <ExternalLink className="size-3" />
        </a>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        aria-label="Đổi tệp"
        title="Đổi tệp"
      >
        {uploading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
      </Button>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          aria-label="Xoá tệp"
          title="Xoá tệp"
          className="text-muted-foreground hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 />
        </Button>
      )}
    </div>
  );
}
