"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Briefcase, Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { Segmented } from "@/components/common/segmented";
import { StatusBadge, TagBadge } from "@/components/common/status-badge";
import { TitleCell } from "@/components/common/thumb";
import { EditAction, RowActions } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import { useDeleteJob, useJobsQuery, type Job } from "@/hooks/use-jobs";
import { JobStatus } from "@/lib/constants";
import { formatDate } from "@/lib/format";

type StatusFilter = "ALL" | JobStatus;

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const { data, isLoading } = useJobsQuery(search);
  const deleteJob = useDeleteJob();

  const all = data?.data ?? [];
  const openCount = all.filter((j) => j.status === JobStatus.OPEN).length;
  const rows = status === "ALL" ? all : all.filter((j) => j.status === status);

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "title",
      header: "Vị trí",
      cell: ({ row }) => (
        <TitleCell
          leading={
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <Briefcase className="size-4" />
            </span>
          }
          title={row.original.title}
          subtitle={row.original.description}
        />
      ),
    },
    {
      accessorKey: "department",
      header: "Bộ phận",
      cell: ({ row }) => <TagBadge>{row.original.department}</TagBadge>,
    },
    {
      accessorKey: "postedAt",
      header: "Ngày đăng",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground tabular-nums">
          {formatDate(row.original.postedAt)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) =>
        row.original.status === JobStatus.OPEN ? (
          <StatusBadge tone="success" pulse>
            Đang tuyển
          </StatusBadge>
        ) : (
          <StatusBadge tone="neutral">Đã đóng</StatusBadge>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions>
          <EditAction href={`/admin/dashboard/jobs/form/?id=${row.original.id}`} />
          <DeleteButton
            itemLabel={row.original.title}
            onConfirm={async () => {
              try {
                await deleteJob.mutateAsync(row.original.id);
                toast.success("Đã xoá tin tuyển dụng");
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
        module="/admin/dashboard/jobs"
        actions={
          <LinkButton href="/admin/dashboard/jobs/form/">
            <Plus />
            Đăng tin tuyển dụng
          </LinkButton>
        }
      />
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        itemLabel="vị trí"
        rowHref={(j) => `/admin/dashboard/jobs/form/?id=${j.id}`}
        toolbar={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo vị trí..." />
            <Segmented
              value={status}
              onChange={setStatus}
              options={[
                { value: "ALL", label: "Tất cả", count: all.length },
                { value: JobStatus.OPEN, label: "Đang tuyển", count: openCount },
                { value: JobStatus.CLOSED, label: "Đã đóng", count: all.length - openCount },
              ]}
            />
          </>
        }
        empty={{
          icon: Briefcase,
          title: search ? "Không tìm thấy vị trí" : "Chưa có tin tuyển dụng",
          description: search ? "Thử từ khoá khác." : "Đăng vị trí đầu tiên để thu hút ứng viên.",
          action: !search && (
            <LinkButton href="/admin/dashboard/jobs/form/" variant="outline">
              <Plus />
              Đăng tin tuyển dụng
            </LinkButton>
          ),
        }}
      />
    </div>
  );
}
