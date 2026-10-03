"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadFile } from "@/lib/upload";

export interface GalleryPhoto {
  id: string;
  sortOrder: number;
  media: { url: string };
}

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  onAttach: (mediaId: string) => Promise<void>;
  onDetach: (photoId: string) => Promise<void>;
}

export function PhotoGallery({ photos, onAttach, onDetach }: PhotoGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const media = await uploadFile(file);
      await onAttach(media.id);
      toast.success("Đã thêm ảnh");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const sorted = [...photos].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-5">
      {sorted.map((photo, i) => (
        <div
          key={photo.id}
          className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.media.url} alt="" className="size-full object-cover" />
          {i === 0 && (
            <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
              Ảnh bìa
            </span>
          )}
          <button
            type="button"
            onClick={() => onDetach(photo.id)}
            aria-label="Gỡ ảnh"
            className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-red-600 focus-visible:opacity-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-input text-muted-foreground transition-colors hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-700 disabled:pointer-events-none dark:hover:bg-amber-500/5"
      >
        {uploading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <ImagePlus className="size-5" />
        )}
        <span className="text-[11px] font-medium">{uploading ? "Đang tải" : "Thêm ảnh"}</span>
      </button>
    </div>
  );
}
