"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Segmented } from "@/components/common/segmented";
import { StatusBadge } from "@/components/common/status-badge";
import { EditAction, RowActions } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import {
  useDeleteScheduleEntry,
  useScheduleQuery,
  type ScheduleEntry,
} from "@/hooks/use-internal";
import { cn } from "@/lib/utils";

type Phase = "upcoming" | "live" | "past";

function phaseOf(entry: ScheduleEntry, now: number): Phase {
  const start = new Date(entry.startAt).getTime();
  const end = entry.endAt ? new Date(entry.endAt).getTime() : start;
  if (now < start) return "upcoming";
  if (now <= end) return "live";
  return "past";
}

function time(value: string) {
  return new Date(value).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

type PhaseFilter = "upcoming" | "past" | "all";

export default function SchedulePage() {
  const { data, isLoading } = useScheduleQuery();
  const deleteEntry = useDeleteScheduleEntry();
  const [filter, setFilter] = useState<PhaseFilter>("upcoming");

  // Snapshot once per mount — render must stay pure.
  const [now] = useState(() => Date.now());
  const all = [...(data ?? [])].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
  const upcoming = all.filter((e) => phaseOf(e, now) !== "past");
  const past = all.filter((e) => phaseOf(e, now) === "past").reverse();
  const rows = filter === "upcoming" ? upcoming : filter === "past" ? past : all;

  const columns: ColumnDef<ScheduleEntry>[] = [
    {
      accessorKey: "startAt",
      header: "Ngày",
      cell: ({ row }) => {
        const d = new Date(row.original.startAt);
        const isPast = phaseOf(row.original, now) === "past";
        return (
          <div
            className={cn(
              "flex w-12 flex-col items-center overflow-hidden rounded-lg border bg-card text-center shadow-xs",
              isPast && "opacity-60",
            )}
          >
            <span
              className={cn(
                "w-full py-0.5 text-[10px] font-semibold text-white uppercase",
                isPast ? "bg-stone-400" : "bg-teal-600",
              )}
            >
              Th{d.getMonth() + 1}
            </span>
            <span className="py-1 text-lg leading-none font-semibold tabular-nums">
              {d.getDate()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Sự kiện",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="max-w-[360px] truncate font-medium text-foreground">{row.original.title}</p>
          {row.original.description && (
            <p className="mt-0.5 max-w-[360px] truncate text-xs text-muted-foreground">
              {row.original.description}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "time",
      header: "Thời gian",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5 text-[13px] tabular-nums">
          <Clock className="size-3.5 text-muted-foreground" />
          {time(row.original.startAt)}
          {row.original.endAt && ` – ${time(row.original.endAt)}`}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: "Địa điểm",
      cell: ({ row }) =>
        row.original.location ? (
          <span className="inline-flex max-w-[220px] items-center gap-1.5 text-[13px]">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{row.original.location}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "phase",
      header: "Trạng thái",
      cell: ({ row }) => {
        const phase = phaseOf(row.original, now);
        if (phase === "live")
          return (
            <StatusBadge tone="danger" pulse>
              Đang diễn ra
            </StatusBadge>
          );
        if (phase === "upcoming") return <StatusBadge tone="info">Sắp diễn ra</StatusBadge>;
        return <StatusBadge tone="neutral">Đã kết thúc</StatusBadge>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions>
          <EditAction href={`/admin/dashboard/internal/schedule/form/?id=${row.original.id}`} />
          <DeleteButton
            itemLabel={row.original.title}
            onConfirm={async () => {
              try {
                await deleteEntry.mutateAsync(row.original.id);
                toast.success("Đã xoá lịch");
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
        module="/admin/dashboard/internal/schedule"
        actions={
          <LinkButton href="/admin/dashboard/internal/schedule/form/">
            <Plus />
            Thêm lịch
          </LinkButton>
        }
      />
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        itemLabel="sự kiện"
        rowHref={(e) => `/admin/dashboard/internal/schedule/form/?id=${e.id}`}
        toolbar={
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "upcoming", label: "Sắp tới", count: upcoming.length },
              { value: "past", label: "Đã qua", count: past.length },
              { value: "all", label: "Tất cả", count: all.length },
            ]}
          />
        }
        empty={{
          icon: CalendarDays,
          title: filter === "past" ? "Chưa có sự kiện nào đã qua" : "Không có lịch sắp tới",
          description: "Lên lịch họp, đào tạo hoặc sự kiện cho cả đội.",
          action: filter !== "past" && (
            <LinkButton href="/admin/dashboard/internal/schedule/form/" variant="outline">
              <Plus />
              Thêm lịch
            </LinkButton>
          ),
        }}
      />
    </div>
  );
}
