"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile, type MediaRecord } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { Dropzone } from "./dropzone";

interface ImageUploaderValue {
  url: string;
  originalFileName?: string | null;
}

interface ImageUploaderProps {
  value?: ImageUploaderValue | null;
  onUploaded: (media: MediaRecord) => void;
  onRemove?: () => void;
  accept?: string;
  /** Preview shape: wide for covers, square for avatars */
  aspect?: "wide" | "square";
}

export function ImageUploader({
  value,
  onUploaded,
  onRemove,
  accept = "image/*",
  aspect = "wide",
}: ImageUploaderProps) {
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
        accept={accept}
        compact={aspect === "square"}
      />
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-muted",
        aspect === "wide" ? "aspect-video w-full" : "size-32",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={value.url}
        alt={value.originalFileName ?? ""}
        className="size-full object-cover"
      />
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      <div
        className={cn(
          "absolute inset-0 flex items-end justify-end gap-1.5 bg-linear-to-t from-black/60 via-black/0 to-black/0 p-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100",
          uploading && "opacity-100",
        )}
      >
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="bg-white/90 text-stone-900 backdrop-blur hover:bg-white"
        >
          {uploading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
          {aspect === "wide" && "Đổi ảnh"}
        </Button>
        {onRemove && (
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            onClick={onRemove}
            aria-label="Xoá ảnh"
            className="bg-white/90 text-red-600 backdrop-blur hover:bg-white"
          >
            <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
}
