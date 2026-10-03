"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Images, Loader2, Trash2, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Dropzone } from "@/components/upload/dropzone";
import { useDeleteMedia, useMediaQuery } from "@/hooks/use-media";
import { uploadFile, type MediaRecord } from "@/lib/upload";

export default function MediaLibraryPage() {
  const { data, isLoading } = useMediaQuery();
  const deleteMedia = useDeleteMedia();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<MediaRecord | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      await uploadFile(file);
      await queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Tải lên thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tải lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Đã sao chép đường dẫn");
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  const items = data?.data ?? [];

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/media"
        meta={
          data && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
              {data.total} ảnh
            </span>
          )
        }
        actions={
          <>
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
            <Button disabled={uploading} onClick={() => inputRef.current?.click()}>
              {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
              {uploading ? "Đang tải..." : "Tải ảnh lên"}
            </Button>
          </>
        }
      />

      <Dropzone
        onFile={handleFile}
        uploading={uploading}
        accept="image/*"
        title="Kéo thả ảnh vào đây để tải lên"
        hint="Hoặc bấm để chọn từ máy · PNG, JPG, WEBP"
        className="mb-6"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={Images}
            title="Thư viện đang trống"
            description="Ảnh tải lên ở đây có thể dùng lại cho sản phẩm, cửa hàng và bài viết."
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {items.map((media) => (
            <figure
              key={media.id}
              className="group relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.url}
                alt={media.originalFileName ?? ""}
                loading="lazy"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/75 via-black/10 to-black/30 p-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(media.url)}
                    aria-label="Sao chép đường dẫn"
                    title="Sao chép đường dẫn"
                    className="flex size-7 items-center justify-center rounded-md bg-white/90 text-stone-800 backdrop-blur hover:bg-white"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Mở ảnh"
                    title="Mở ảnh"
                    className="flex size-7 items-center justify-center rounded-md bg-white/90 text-stone-800 backdrop-blur hover:bg-white"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(media)}
                    aria-label="Xoá ảnh"
                    title="Xoá"
                    className="flex size-7 items-center justify-center rounded-md bg-white/90 text-red-600 backdrop-blur hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <figcaption className="truncate text-[11px] font-medium text-white">
                  {media.originalFileName ?? media.key}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Xoá ảnh khỏi thư viện?"
        description="Các nội dung đang dùng ảnh này có thể bị mất hình. Hành động này không thể hoàn tác."
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await deleteMedia.mutateAsync(pendingDelete.id);
            toast.success("Đã xoá ảnh");
          } catch {
            toast.error("Xoá thất bại");
          }
        }}
      />
    </div>
  );
}
