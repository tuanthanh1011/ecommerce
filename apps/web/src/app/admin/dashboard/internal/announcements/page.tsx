"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Megaphone, Pin, Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { EditAction } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import {
  useAnnouncementsQuery,
  useDeleteAnnouncement,
} from "@/hooks/use-internal";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

// Rotating accents keep a wall of notices from reading as one grey block.
const ACCENTS = [
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-fuchsia-500",
];

export default function AnnouncementsPage() {
  const { data, isLoading } = useAnnouncementsQuery();
  const deleteAnnouncement = useDeleteAnnouncement();
  const [now] = useState(() => Date.now());

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/internal/announcements"
        actions={
          <LinkButton href="/admin/dashboard/internal/announcements/form/">
            <Plus />
            Thông báo mới
          </LinkButton>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl border bg-card" />
          ))}
        </div>
      ) : !data?.length ? (
        <div className="rounded-xl border border-dashed bg-card">
          <EmptyState
            icon={Megaphone}
            title="Chưa có thông báo"
            description="Chia sẻ tin tức, thay đổi lịch làm hoặc lưu ý vận hành với cả đội."
            action={
              <LinkButton href="/admin/dashboard/internal/announcements/form/" variant="outline">
                <Plus />
                Thông báo mới
              </LinkButton>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((item, i) => {
            const pinned =
              item.pinnedUntil && new Date(item.pinnedUntil).getTime() > now;
            return (
              <article
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgb(28_25_23/0.04)] transition-shadow hover:shadow-lg hover:shadow-stone-900/5"
              >
                <div className={cn("h-1 bg-linear-to-r", ACCENTS[i % ACCENTS.length])} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-white shadow-sm",
                        ACCENTS[i % ACCENTS.length],
                      )}
                    >
                      <Megaphone className="size-4" />
                    </span>
                    {pinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
                        <Pin className="size-3" />
                        Ghim tới {formatDate(item.pinnedUntil)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[15px] leading-snug font-semibold tracking-tight">
                    <Link
                      href={`/admin/dashboard/internal/announcements/form/?id=${item.id}`}
                      className="after:absolute after:inset-0 hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {item.content}
                  </p>
                </div>
                <div className="relative z-10 flex items-center justify-end gap-0.5 border-t bg-muted/30 px-3 py-2">
                  <EditAction href={`/admin/dashboard/internal/announcements/form/?id=${item.id}`} />
                  <DeleteButton
                    itemLabel={item.title}
                    onConfirm={async () => {
                      try {
                        await deleteAnnouncement.mutateAsync(item.id);
                        toast.success("Đã xoá thông báo");
                      } catch {
                        toast.error("Xoá thất bại");
                      }
                    }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}

    </div>
  );
}
