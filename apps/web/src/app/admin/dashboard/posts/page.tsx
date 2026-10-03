"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Newspaper, Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Segmented } from "@/components/common/segmented";
import { StatusBadge } from "@/components/common/status-badge";
import { Thumb, TitleCell } from "@/components/common/thumb";
import { EditAction, RowActions } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import { useDeletePost, usePostsQuery, type Post } from "@/hooks/use-posts";
import { PostType, POST_TYPE_LABELS, POST_TYPE_TONES } from "@/lib/constants";
import { toneChip } from "@/lib/tones";
import { formatDate } from "@/lib/format";

const PUBLIC_TYPES = Object.values(PostType).filter(
  (t) => t !== PostType.INTERNAL_UPDATE,
);

export default function PostsPage() {
  const [type, setType] = useState<PostType>(PostType.ANNOUNCEMENT);
  const { data, isLoading } = usePostsQuery(type);
  const deletePost = useDeletePost();

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: "Bài viết",
      cell: ({ row }) => (
        <TitleCell
          leading={
            <Thumb
              src={row.original.coverImage?.url}
              icon={Newspaper}
              className="h-10 w-14"
            />
          }
          title={row.original.title}
          subtitle={row.original.excerpt ?? `/${row.original.slug}`}
        />
      ),
    },
    {
      accessorKey: "type",
      header: "Chuyên mục",
      cell: ({ row }) => (
        <span className={toneChip(POST_TYPE_TONES[row.original.type])}>
          {POST_TYPE_LABELS[row.original.type]}
        </span>
      ),
    },
    {
      accessorKey: "publishedAt",
      header: "Ngày đăng",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground tabular-nums">
          {formatDate(row.original.publishedAt)}
        </span>
      ),
    },
    {
      accessorKey: "isPublished",
      header: "Trạng thái",
      cell: ({ row }) => (
        <StatusBadge tone={row.original.isPublished ? "success" : "warning"}>
          {row.original.isPublished ? "Đã đăng" : "Bản nháp"}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions>
          <EditAction href={`/admin/dashboard/posts/form/?id=${row.original.id}`} />
          <DeleteButton
            itemLabel={row.original.title}
            onConfirm={async () => {
              try {
                await deletePost.mutateAsync(row.original.id);
                toast.success("Đã xoá bài viết");
              } catch {
                toast.error("Xoá thất bại");
              }
            }}
          />
        </RowActions>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/posts"
        actions={
          <LinkButton href={`/admin/dashboard/posts/form/?type=${type}`}>
            <Plus />
            Viết bài mới
          </LinkButton>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total}
        isLoading={isLoading}
        itemLabel="bài viết"
        rowHref={(p) => `/admin/dashboard/posts/form/?id=${p.id}`}
        toolbar={
          <Segmented
            value={type}
            onChange={setType}
            options={PUBLIC_TYPES.map((t) => ({ value: t, label: POST_TYPE_LABELS[t] }))}
          />
        }
        empty={{
          icon: Newspaper,
          title: `Chưa có bài “${POST_TYPE_LABELS[type]}”`,
          description: "Bài viết mới sẽ ở trạng thái nháp cho tới khi bạn đăng.",
          action: (
            <LinkButton href={`/admin/dashboard/posts/form/?type=${type}`} variant="outline">
              <Plus />
              Viết bài mới
            </LinkButton>
          ),
        }}
      />
    </div>
  );
}
