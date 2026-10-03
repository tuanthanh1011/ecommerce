"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ExternalLink, MapPin, Phone, Plus, Store as StoreIcon } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { Segmented } from "@/components/common/segmented";
import { StatusBadge } from "@/components/common/status-badge";
import { Thumb, TitleCell } from "@/components/common/thumb";
import { EditAction, RowActions } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import { useDeleteStore, useStoresQuery, type Store } from "@/hooks/use-stores";

type VisibilityFilter = "ALL" | "ACTIVE" | "HIDDEN";

export default function StoresPage() {
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState<VisibilityFilter>("ALL");
  const { data, isLoading } = useStoresQuery(search);
  const deleteStore = useDeleteStore();

  const all = data?.data ?? [];
  const activeCount = all.filter((s) => s.isActive).length;
  const rows =
    visibility === "ALL"
      ? all
      : all.filter((s) => s.isActive === (visibility === "ACTIVE"));

  const columns: ColumnDef<Store>[] = [
    {
      accessorKey: "name",
      header: "Cửa hàng",
      cell: ({ row }) => {
        const s = row.original;
        const cover = [...s.photos].sort((a, b) => a.sortOrder - b.sortOrder)[0];
        return (
          <TitleCell
            leading={<Thumb src={cover?.media.url} icon={StoreIcon} />}
            title={s.name}
            subtitle={`${s.photos.length} ảnh`}
          />
        );
      },
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ row }) => (
        <div className="flex max-w-[340px] items-start gap-1.5 text-[13px] whitespace-normal">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <span className="line-clamp-2">{row.original.address}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Liên hệ",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex flex-col gap-1 text-[13px]">
            {s.phone ? (
              <span className="flex items-center gap-1.5 tabular-nums">
                <Phone className="size-3.5 text-muted-foreground" />
                {s.phone}
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
            {s.googleMapsUrl && (
              <a
                href={s.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Google Maps
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => (
        <StatusBadge tone={row.original.isActive ? "success" : "neutral"}>
          {row.original.isActive ? "Hoạt động" : "Ẩn"}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions>
          <EditAction href={`/admin/dashboard/stores/form/?id=${row.original.id}`} />
          <DeleteButton
            itemLabel={row.original.name}
            onConfirm={async () => {
              try {
                await deleteStore.mutateAsync(row.original.id);
                toast.success("Đã xoá cửa hàng");
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
        module="/admin/dashboard/stores"
        actions={
          <LinkButton href="/admin/dashboard/stores/form/">
            <Plus />
            Thêm cửa hàng
          </LinkButton>
        }
      />
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        itemLabel="cửa hàng"
        rowHref={(s) => `/admin/dashboard/stores/form/?id=${s.id}`}
        toolbar={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên cửa hàng..." />
            <Segmented
              value={visibility}
              onChange={setVisibility}
              options={[
                { value: "ALL", label: "Tất cả", count: all.length },
                { value: "ACTIVE", label: "Hoạt động", count: activeCount },
                { value: "HIDDEN", label: "Đang ẩn", count: all.length - activeCount },
              ]}
            />
          </>
        }
        empty={{
          icon: StoreIcon,
          title: search ? "Không tìm thấy cửa hàng" : "Chưa có cửa hàng",
          description: search
            ? "Thử từ khoá khác."
            : "Thêm cửa hàng đầu tiên để khách hàng tìm thấy S.t.",
          action: !search && (
            <LinkButton href="/admin/dashboard/stores/form/" variant="outline">
              <Plus />
              Thêm cửa hàng
            </LinkButton>
          ),
        }}
      />
    </div>
  );
}
