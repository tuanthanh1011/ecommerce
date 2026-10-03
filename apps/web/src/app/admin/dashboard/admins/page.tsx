"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { KeyRound, Lock, Plus, ShieldCheck, Users } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { RowActions } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import {
  useAdminsQuery,
  useDeactivateAdmin,
  type AdminAccount,
} from "@/hooks/use-admins";
import { initials } from "@/lib/format";

export default function AdminsPage() {
  const { data, isLoading } = useAdminsQuery();
  const deactivateAdmin = useDeactivateAdmin();

  const all = data ?? [];
  const activeCount = all.filter((a) => a.isActive).length;

  const columns: ColumnDef<AdminAccount>[] = [
    {
      accessorKey: "fullName",
      header: "Thành viên",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback
              className={
                row.original.isActive
                  ? "bg-linear-to-br from-amber-400 to-orange-600 text-xs font-semibold text-white"
                  : "bg-muted text-xs font-semibold text-muted-foreground"
              }
            >
              {initials(row.original.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{row.original.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: "Vai trò",
      cell: () => (
        <span className="inline-flex items-center gap-1.5 text-[13px]">
          <ShieldCheck className="size-3.5 text-amber-600" />
          Quản trị viên
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => (
        <StatusBadge tone={row.original.isActive ? "success" : "danger"}>
          {row.original.isActive ? "Hoạt động" : "Đã khoá"}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions>
          <LinkButton
            href={`/admin/dashboard/admins/form/?id=${row.original.id}`}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <KeyRound />
            Đổi mật khẩu
          </LinkButton>
          {row.original.isActive && (
            <DeleteButton
              itemLabel={row.original.email}
              title="Khoá tài khoản?"
              description={
                <>
                  <span className="font-medium text-foreground">{row.original.email}</span>{" "}
                  sẽ không thể đăng nhập CMS cho tới khi được mở lại.
                </>
              }
              onConfirm={async () => {
                try {
                  await deactivateAdmin.mutateAsync(row.original.id);
                  toast.success("Đã khoá tài khoản");
                } catch {
                  toast.error("Thao tác thất bại");
                }
              }}
            >
              <Lock />
              Khoá
            </DeleteButton>
          )}
        </RowActions>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/admins"
        actions={
          <LinkButton href="/admin/dashboard/admins/form/">
            <Plus />
            Thêm admin
          </LinkButton>
        }
      />
      <DataTable
        columns={columns}
        data={all}
        isLoading={isLoading}
        itemLabel={`tài khoản · ${activeCount} đang hoạt động`}
        rowHref={(a) => `/admin/dashboard/admins/form/?id=${a.id}`}
        toolbar={
          <p className="text-[13px] text-muted-foreground">
            Mọi admin đều có quyền chỉnh sửa toàn bộ nội dung.
          </p>
        }
        empty={{ icon: Users, title: "Chưa có tài khoản" }}
      />
    </div>
  );
}
